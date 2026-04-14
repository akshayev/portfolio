import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { logAuditEvent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getRequestId, isSameOriginRequest, readJsonBody } from "@/lib/security/request";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type ContactMessageInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];

type ContactMessageInsertResponse = {
  error: {
    code?: string;
    message?: string;
  } | null;
};

type ContactMessageInsertClient = {
  from: (table: "contact_messages") => {
    insert: (values: ContactMessageInsert) => Promise<ContactMessageInsertResponse>;
  };
};

const CONTACT_ROUTE = "/api/contact";
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;

function deny(error: string, status: number, retryAfterSeconds?: number) {
  return NextResponse.json(
    { ok: false, error },
    {
      status,
      headers: retryAfterSeconds
        ? {
            "retry-after": String(retryAfterSeconds),
          }
        : undefined,
    },
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeTelegram(value: string): string {
  return value.replace(/[\\_*\[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

function buildTelegramMessage(input: { name: string; email: string; message: string; createdAt: string }) {
  return [
    "*New CTA Contact Message*",
    "",
    `*Name:* ${escapeTelegram(input.name)}`,
    `*Email:* ${escapeTelegram(input.email)}`,
    `*Created:* ${escapeTelegram(input.createdAt)}`,
    "",
    `*Message:*\n${escapeTelegram(input.message)}`,
  ].join("\n");
}

async function sendTelegramNotification(input: { name: string; email: string; message: string; createdAt: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false as const, reason: "missing_env" as const };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(input),
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const errorCode = response.status;

    try {
      await response.text();
    } catch {
      // ignore body parsing failures for notification path
    }

    return {
      ok: false as const,
      reason: "telegram_error" as const,
      errorCode,
    };
  }

  return { ok: true as const };
}

function getServiceRoleSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const requestId = getRequestId(request);

  if (!isSameOriginRequest(request)) {
    logAuditEvent("warn", {
      route: CONTACT_ROUTE,
      action: "submit",
      message: "Rejected non same-origin contact request",
      requestId,
      ip,
    });

    return deny("forbidden", 403);
  }

  const ipLimit = checkRateLimit({
    key: `${CONTACT_ROUTE}:ip:${ip}`,
    limit: 5,
    windowMs: 60_000,
  });

  if (!ipLimit.ok) {
    return deny("rate_limited", 429, ipLimit.retryAfterSeconds);
  }

  const cooldown = checkRateLimit({
    key: `${CONTACT_ROUTE}:cooldown:${ip}`,
    limit: 1,
    windowMs: 15_000,
  });

  if (!cooldown.ok) {
    return deny("cooldown_active", 429, cooldown.retryAfterSeconds);
  }

  const payload = await readJsonBody<ContactPayload>(request, 16 * 1024);

  if (!payload) {
    return deny("invalid_json", 400);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return deny("missing_fields", 400);
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return deny("field_too_long", 400);
  }

  if (!isValidEmail(email)) {
    return deny("invalid_email", 400);
  }

  const supabase = getServiceRoleSupabaseClient();

  if (!supabase) {
    logAuditEvent("error", {
      route: CONTACT_ROUTE,
      action: "submit",
      message: "Missing Supabase service role env vars",
      requestId,
      ip,
    });

    return deny("service_unavailable", 503);
  }

  const createdAt = new Date().toISOString();

  const insertPayload: ContactMessageInsert = {
    name,
    email,
    message,
    created_at: createdAt,
  };

  const { error: insertError } = await (supabase as unknown as ContactMessageInsertClient)
    .from("contact_messages")
    .insert(insertPayload);

  if (insertError) {
    logAuditEvent("error", {
      route: CONTACT_ROUTE,
      action: "insert",
      message: "Failed to insert contact message",
      requestId,
      ip,
      metadata: {
        code: insertError.code,
      },
    });

    return deny("internal_error", 500);
  }

  const telegram = await sendTelegramNotification({
    name,
    email,
    message,
    createdAt,
  });

  if (!telegram.ok) {
    logAuditEvent("error", {
      route: CONTACT_ROUTE,
      action: "telegram",
      message: "Telegram notification failed",
      requestId,
      ip,
      metadata:
        telegram.reason === "telegram_error"
          ? {
              errorCode: telegram.errorCode,
            }
          : {
              reason: telegram.reason,
            },
    });
  }

  return NextResponse.json({ ok: true });
}

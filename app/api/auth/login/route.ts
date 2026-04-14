import { NextResponse } from "next/server";

import { logAuditEvent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getRequestId, isSameOriginRequest, readJsonBody } from "@/lib/security/request";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

const AUTH_ROUTE = "/api/auth/login";

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

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const requestId = getRequestId(request);

  if (!isSameOriginRequest(request)) {
    logAuditEvent("warn", {
      route: AUTH_ROUTE,
      action: "login",
      message: "Rejected non same-origin login request",
      requestId,
      ip,
    });

    return deny("forbidden", 403);
  }

  const payload = await readJsonBody<LoginPayload>(request, 8 * 1024);

  if (!payload) {
    return deny("invalid_json", 400);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !password || password.length > 256 || email.length > 320) {
    return deny("invalid_credentials", 400);
  }

  const ipLimit = checkRateLimit({
    key: `${AUTH_ROUTE}:ip:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!ipLimit.ok) {
    logAuditEvent("warn", {
      route: AUTH_ROUTE,
      action: "login",
      message: "Login IP rate limited",
      requestId,
      ip,
      metadata: { email },
    });

    return deny("rate_limited", 429, ipLimit.retryAfterSeconds);
  }

  const identityLimit = checkRateLimit({
    key: `${AUTH_ROUTE}:identity:${email}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!identityLimit.ok) {
    logAuditEvent("warn", {
      route: AUTH_ROUTE,
      action: "login",
      message: "Login identity rate limited",
      requestId,
      ip,
      metadata: { email },
    });

    return deny("rate_limited", 429, identityLimit.retryAfterSeconds);
  }

  const client = await createServerSupabaseClient();

  if (!client) {
    return deny("service_unavailable", 503);
  }

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    logAuditEvent("warn", {
      route: AUTH_ROUTE,
      action: "login",
      message: "Invalid login attempt",
      requestId,
      ip,
      metadata: { email },
    });

    return deny("invalid_credentials", 401);
  }

  return NextResponse.json({ ok: true });
}

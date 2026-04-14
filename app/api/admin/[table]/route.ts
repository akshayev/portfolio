import { NextResponse } from "next/server";

import { getAdminContext } from "@/lib/auth/admin";
import { adminTableConfig, isAdminTableName } from "@/lib/content/admin-config";
import { sanitizeAdminValues } from "@/lib/content/admin-sanitize";
import { logAuditEvent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getRequestId, isSameOriginRequest, readJsonBody } from "@/lib/security/request";

type RouteContext = {
  params: Promise<{ table: string }>;
};

type BodyPayload = {
  values?: unknown;
};

type DynamicResult = {
  data: unknown;
  error: { message: string } | null;
};

type SelectChain = {
  order: (column: string, options: { ascending: boolean }) => SelectChain;
  limit: (count: number) => Promise<DynamicResult>;
};

type TableChain = {
  select: (columns: string) => SelectChain;
  insert: (values: Record<string, unknown>) => {
    select: (columns: string) => { limit: (count: number) => Promise<DynamicResult> };
  };
  update: (values: Record<string, unknown>) => {
    eq: (column: string, value: string) => {
      select: (columns: string) => { limit: (count: number) => Promise<DynamicResult> };
    };
  };
  delete: () => {
    eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
  };
};

type ResolvedAdminContext = {
  table: string;
  client: unknown;
  ip: string;
  requestId: string;
};

const ADMIN_ROUTE = "/api/admin/[table]";
const MAX_PAYLOAD_BYTES = 24 * 1024;

function fromTable(client: unknown, table: string): TableChain {
  return (client as { from: (name: string) => TableChain }).from(table);
}

function toRecordArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(
    (entry): entry is Record<string, unknown> =>
      typeof entry === "object" && entry !== null && !Array.isArray(entry),
  );
}

function parseId(request: Request): string | null {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  return id && id.trim() ? id : null;
}

function validateId(id: string): boolean {
  return /^[a-zA-Z0-9-]{8,64}$/.test(id);
}

function deny(message: string, status: number, retryAfterSeconds?: number) {
  return NextResponse.json(
    { ok: false, error: message },
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

function serverError(action: string, requestId: string, ip: string, error: unknown) {
  logAuditEvent("error", {
    route: ADMIN_ROUTE,
    action,
    message: "Internal server error",
    requestId,
    ip,
    metadata: { error },
  });

  return deny("internal_error", 500);
}

function validateRateLimit(request: Request, operation: string, identifier: string) {
  const ip = getClientIp(request);
  const key = `${ADMIN_ROUTE}:${operation}:${identifier}:${ip}`;

  const result = checkRateLimit({
    key,
    limit: 120,
    windowMs: 60_000,
  });

  if (!result.ok) {
    return deny("rate_limited", 429, result.retryAfterSeconds);
  }

  return null;
}

async function resolveTable(paramsPromise: RouteContext["params"]) {
  const { table } = await paramsPromise;

  if (!isAdminTableName(table)) {
    return null;
  }

  return table;
}

async function requireAdmin(request: Request, paramsPromise: RouteContext["params"]) {
  const table = await resolveTable(paramsPromise);
  const ip = getClientIp(request);
  const requestId = getRequestId(request);

  if (!table) {
    logAuditEvent("warn", {
      route: ADMIN_ROUTE,
      action: "resolve_table",
      message: "Invalid table requested",
      requestId,
      ip,
    });

    return deny("not_found", 404);
  }

  const authRateLimit = validateRateLimit(request, "auth-check", table);

  if (authRateLimit) {
    return authRateLimit;
  }

  const context = await getAdminContext();

  if (!context.client) {
    logAuditEvent("error", {
      route: ADMIN_ROUTE,
      action: "auth-check",
      message: "Missing Supabase environment",
      requestId,
      ip,
    });

    return deny("service_unavailable", 503);
  }

  if (!context.isAdmin) {
    logAuditEvent("warn", {
      route: ADMIN_ROUTE,
      action: "auth-check",
      message: "Forbidden admin API attempt",
      requestId,
      ip,
      metadata: {
        reason: context.reason,
      },
    });

    return deny("forbidden", 403);
  }

  return { table, client: context.client, ip, requestId } satisfies ResolvedAdminContext;
}

export async function GET(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(request, context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client, ip, requestId } = resolved;
  const config = adminTableConfig[table];

  const { data, error } = config.singleton
    ? await fromTable(client, table)
        .select("*")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .limit(1)
    : await fromTable(client, table)
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .limit(500);

  if (error) {
    return serverError("list", requestId, ip, error);
  }

  return NextResponse.json({ ok: true, items: data, singleton: config.singleton });
}

export async function POST(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(request, context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client, ip, requestId } = resolved;
  const config = adminTableConfig[table];

  if (!isSameOriginRequest(request)) {
    logAuditEvent("warn", {
      route: ADMIN_ROUTE,
      action: "create",
      message: "Rejected non same-origin POST",
      requestId,
      ip,
    });

    return deny("forbidden", 403);
  }

  const writeRateLimit = validateRateLimit(request, "create", table);

  if (writeRateLimit) {
    return writeRateLimit;
  }

  const payload = await readJsonBody<BodyPayload>(request, MAX_PAYLOAD_BYTES);

  if (!payload) {
    return deny("invalid_json", 400);
  }

  if (!payload.values || typeof payload.values !== "object" || Array.isArray(payload.values)) {
    return deny("invalid_payload", 400);
  }

  let values: Record<string, unknown>;

  try {
    values = sanitizeAdminValues(table, payload.values as Record<string, unknown>, "create");
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid_values";
    return deny(message, 400);
  }

  if (config.singleton) {
    const { data: existing, error: existingError } = await fromTable(client, table)
      .select("id")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(1);

    if (existingError) {
      return serverError("create-singleton-read", requestId, ip, existingError);
    }

    const existingRows = toRecordArray(existing);

    if (existingRows.length) {
      const id = typeof existingRows[0]?.id === "string" ? existingRows[0].id : "";

      if (!id) {
        return serverError("create-singleton-id", requestId, ip, "invalid_existing_record");
      }

      const { data, error } = await fromTable(client, table)
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .limit(1);

      if (error) {
        return serverError("create-singleton-update", requestId, ip, error);
      }

      const rows = toRecordArray(data);
      return NextResponse.json({ ok: true, item: rows[0] ?? null });
    }
  }

  const { data, error } = await fromTable(client, table).insert(values).select("*").limit(1);

  if (error) {
    return serverError("create", requestId, ip, error);
  }

  const rows = toRecordArray(data);
  return NextResponse.json({ ok: true, item: rows[0] ?? null });
}

export async function PATCH(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(request, context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client, ip, requestId } = resolved;
  const id = parseId(request);

  if (!isSameOriginRequest(request)) {
    logAuditEvent("warn", {
      route: ADMIN_ROUTE,
      action: "update",
      message: "Rejected non same-origin PATCH",
      requestId,
      ip,
    });

    return deny("forbidden", 403);
  }

  const writeRateLimit = validateRateLimit(request, "update", table);

  if (writeRateLimit) {
    return writeRateLimit;
  }

  if (!id) {
    return deny("missing_id", 400);
  }

  if (!validateId(id)) {
    return deny("invalid_id", 400);
  }

  const payload = await readJsonBody<BodyPayload>(request, MAX_PAYLOAD_BYTES);

  if (!payload) {
    return deny("invalid_json", 400);
  }

  if (!payload.values || typeof payload.values !== "object" || Array.isArray(payload.values)) {
    return deny("invalid_payload", 400);
  }

  const values = sanitizeAdminValues(table, payload.values as Record<string, unknown>, "update");

  if (!Object.keys(values).length) {
    return deny("empty_update", 400);
  }

  const { data, error } = await fromTable(client, table)
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .limit(1);

  if (error) {
    return serverError("update", requestId, ip, error);
  }

  const rows = toRecordArray(data);
  return NextResponse.json({ ok: true, item: rows[0] ?? null });
}

export async function DELETE(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(request, context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client, ip, requestId } = resolved;
  const config = adminTableConfig[table];
  const id = parseId(request);

  if (!isSameOriginRequest(request)) {
    logAuditEvent("warn", {
      route: ADMIN_ROUTE,
      action: "delete",
      message: "Rejected non same-origin DELETE",
      requestId,
      ip,
    });

    return deny("forbidden", 403);
  }

  const writeRateLimit = validateRateLimit(request, "delete", table);

  if (writeRateLimit) {
    return writeRateLimit;
  }

  if (config.singleton) {
    return deny("singleton_delete_disallowed", 400);
  }

  if (!id) {
    return deny("missing_id", 400);
  }

  if (!validateId(id)) {
    return deny("invalid_id", 400);
  }

  const { error } = await fromTable(client, table).delete().eq("id", id);

  if (error) {
    return serverError("delete", requestId, ip, error);
  }

  return NextResponse.json({ ok: true });
}

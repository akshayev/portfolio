import { NextResponse } from "next/server";

import { getAdminContext } from "@/lib/auth/admin";
import { adminTableConfig, isAdminTableName } from "@/lib/content/admin-config";
import { sanitizeAdminValues } from "@/lib/content/admin-sanitize";

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

async function resolveTable(paramsPromise: RouteContext["params"]) {
  const { table } = await paramsPromise;

  if (!isAdminTableName(table)) {
    return null;
  }

  return table;
}

async function requireAdmin(paramsPromise: RouteContext["params"]) {
  const table = await resolveTable(paramsPromise);

  if (!table) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const context = await getAdminContext();

  if (!context.client) {
    return NextResponse.json({ ok: false, error: "missing_env" }, { status: 503 });
  }

  if (!context.isAdmin) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  return { table, client: context.client };
}

export async function GET(_request: Request, context: RouteContext) {
  const resolved = await requireAdmin(context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client } = resolved;
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
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, items: data, singleton: config.singleton });
}

export async function POST(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client } = resolved;
  const config = adminTableConfig[table];

  let payload: BodyPayload;

  try {
    payload = (await request.json()) as BodyPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload.values || typeof payload.values !== "object" || Array.isArray(payload.values)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  let values: Record<string, unknown>;

  try {
    values = sanitizeAdminValues(table, payload.values as Record<string, unknown>, "create");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid values";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  if (config.singleton) {
    const { data: existing, error: existingError } = await fromTable(client, table)
      .select("id")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(1);

    if (existingError) {
      return NextResponse.json({ ok: false, error: existingError.message }, { status: 500 });
    }

    const existingRows = toRecordArray(existing);

    if (existingRows.length) {
      const id = typeof existingRows[0]?.id === "string" ? existingRows[0].id : "";

      if (!id) {
        return NextResponse.json({ ok: false, error: "invalid_existing_record" }, { status: 500 });
      }

      const { data, error } = await fromTable(client, table)
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .limit(1);

      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }

      const rows = toRecordArray(data);

      return NextResponse.json({ ok: true, item: rows[0] ?? null });
    }
  }

  const { data, error } = await fromTable(client, table).insert(values).select("*").limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = toRecordArray(data);

  return NextResponse.json({ ok: true, item: rows[0] ?? null });
}

export async function PATCH(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client } = resolved;
  const id = parseId(request);

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  let payload: BodyPayload;

  try {
    payload = (await request.json()) as BodyPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload.values || typeof payload.values !== "object" || Array.isArray(payload.values)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const values = sanitizeAdminValues(table, payload.values as Record<string, unknown>, "update");

  if (!Object.keys(values).length) {
    return NextResponse.json({ ok: false, error: "empty_update" }, { status: 400 });
  }

  const { data, error } = await fromTable(client, table)
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = toRecordArray(data);

  return NextResponse.json({ ok: true, item: rows[0] ?? null });
}

export async function DELETE(request: Request, context: RouteContext) {
  const resolved = await requireAdmin(context.params);

  if (resolved instanceof NextResponse) {
    return resolved;
  }

  const { table, client } = resolved;
  const config = adminTableConfig[table];

  if (config.singleton) {
    return NextResponse.json({ ok: false, error: "singleton_delete_disallowed" }, { status: 400 });
  }

  const id = parseId(request);

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  const { error } = await fromTable(client, table).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

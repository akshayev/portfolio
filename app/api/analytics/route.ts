import { NextResponse } from "next/server";

import { logAuditEvent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getRequestId, readJsonBody } from "@/lib/security/request";

type AnalyticsBody = {
  name?: unknown;
  timestamp?: unknown;
  properties?: unknown;
};

const ANALYTICS_ROUTE = "/api/analytics";

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

  const limit = checkRateLimit({
    key: `${ANALYTICS_ROUTE}:${ip}`,
    limit: 120,
    windowMs: 60_000,
  });

  if (!limit.ok) {
    logAuditEvent("warn", {
      route: ANALYTICS_ROUTE,
      action: "ingest",
      message: "Analytics endpoint rate limited",
      requestId,
      ip,
    });

    return deny("rate_limited", 429, limit.retryAfterSeconds);
  }

  const body = await readJsonBody<AnalyticsBody>(request, 8 * 1024);

  if (!body) {
    return deny("invalid_json", 400);
  }

  if (typeof body.name !== "string" || body.name.length > 64) {
    return deny("invalid_event", 400);
  }

  if (
    body.properties !== undefined &&
    (typeof body.properties !== "object" || body.properties === null || Array.isArray(body.properties))
  ) {
    return deny("invalid_properties", 400);
  }

  if (process.env.NODE_ENV !== "production") {
    const safeProperties =
      typeof body.properties === "object" && body.properties !== null && !Array.isArray(body.properties)
        ? body.properties
        : {};

    console.info("[analytics]", {
      name: body.name,
      timestamp: typeof body.timestamp === "string" ? body.timestamp : null,
      properties: safeProperties,
    });
  }

  return NextResponse.json({ ok: true });
}

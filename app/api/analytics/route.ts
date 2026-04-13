import { NextResponse } from "next/server";

type AnalyticsBody = {
  name?: unknown;
  timestamp?: unknown;
  properties?: unknown;
};

export async function POST(request: Request) {
  let body: AnalyticsBody;

  try {
    body = (await request.json()) as AnalyticsBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (typeof body.name !== "string") {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", {
      name: body.name,
      timestamp: typeof body.timestamp === "string" ? body.timestamp : null,
      properties: typeof body.properties === "object" && body.properties !== null ? body.properties : {},
    });
  }

  return NextResponse.json({ ok: true });
}

import { getSiteUrl } from "@/lib/seo";

function toOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function getRequestId(request: Request): string {
  const requestId = request.headers.get("x-request-id") ?? request.headers.get("x-vercel-id");

  if (requestId) {
    return requestId;
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isSameOriginRequest(request: Request): boolean {
  const originHeader = request.headers.get("origin");

  if (!originHeader) {
    return false;
  }

  const requestOrigin = toOrigin(request.url);
  const headerOrigin = toOrigin(originHeader);
  const siteOrigin = toOrigin(getSiteUrl());

  if (!requestOrigin || !headerOrigin) {
    return false;
  }

  if (headerOrigin === requestOrigin) {
    return true;
  }

  if (siteOrigin && headerOrigin === siteOrigin) {
    return true;
  }

  return false;
}

export async function readJsonBody<T>(request: Request, maxBytes = 24 * 1024): Promise<T | null> {
  const lengthHeader = request.headers.get("content-length");

  if (lengthHeader) {
    const declaredLength = Number(lengthHeader);

    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      return null;
    }
  }

  const text = await request.text();

  if (text.length > maxBytes) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

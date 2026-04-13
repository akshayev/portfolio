const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

export function normalizeExternalUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function toSafeInternalPath(value: string | null | undefined, fallback = "/admin") {
  if (!value) {
    return fallback;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return fallback;
}

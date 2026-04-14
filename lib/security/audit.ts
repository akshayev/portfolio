type AuditLevel = "warn" | "error";

type AuditEvent = {
  route: string;
  action: string;
  message: string;
  requestId?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
};

export function logAuditEvent(level: AuditLevel, event: AuditEvent) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    ...event,
  };

  if (level === "error") {
    console.error("[security]", payload);
    return;
  }

  console.warn("[security]", payload);
}

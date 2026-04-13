export type AnalyticsEventName = "external_link_click" | "contact_click";

type AnalyticsPayload = {
  name: AnalyticsEventName;
  timestamp: string;
  properties: Record<string, string | number | boolean | null>;
};

export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsPayload["properties"],
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: AnalyticsPayload = {
    name,
    timestamp: new Date().toISOString(),
    properties,
  };

  const body = JSON.stringify(payload);

  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
    keepalive: true,
  });
}

export function trackExternalClick(section: string, label: string, href: string) {
  trackEvent("external_link_click", { section, label, href });
}

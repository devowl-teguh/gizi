import type { BeforeSendEvent } from "@vercel/analytics/next";

// Only the public homepage is tracked. Never forward search strings, fragments,
// unreviewed routes, or custom events that could contain personal information.
export function filterAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  if (event.type !== "pageview") return null;
  try {
    const url = new URL(event.url);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.pathname !== "/") return null;
    return { type: "pageview", url: `${url.origin}/` };
  } catch {
    return null;
  }
}

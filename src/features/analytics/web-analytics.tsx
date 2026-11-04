"use client";

import { Analytics } from "@vercel/analytics/next";
import { filterAnalyticsEvent } from "./analytics-policy";

export function WebAnalytics() {
  return <Analytics beforeSend={filterAnalyticsEvent} />;
}

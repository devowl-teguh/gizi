// Operational counters only: no IP, profile, query, or response is retained.
const windowMs = 60 * 60 * 1000;
const limit = 12;
let start = 0, calls = 0, active = 0;
export function reserve(now = Date.now()) {
  if (now - start >= windowMs) { start = now; calls = 0; }
  if (calls >= limit || active >= 2) return null;
  calls++; active++;
  let released = false;
  return () => { if (!released) { active--; released = true; } };
}

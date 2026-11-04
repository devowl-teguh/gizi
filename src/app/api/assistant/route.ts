import { assistantInputSchema } from "@/lib/ai/contracts";
import { AssistantError, runAssistant } from "@/lib/ai/nararouter";
import { reserve } from "@/lib/ai/limits";

export const maxDuration = 60;
const headers = { "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff" };
function error(status: number, message: string) { return Response.json({ error: message }, { status, headers: { ...headers, ...(status === 429 ? { "Retry-After": "60" } : {}) } }); }
export async function POST(request: Request) {
  // Public hosting needs external shared rate/budget controls before explicit opt-in.
  if (process.env.NODE_ENV === "production" && process.env.AI_PUBLIC_ENABLED !== "true") return error(503, "Pencarian AI belum tersedia pada situs publik ini.");
  const origin = request.headers.get("origin");
  let originMatches = !origin;
  try {
    if (origin) { const parsed = new URL(origin); originMatches = ["http:", "https:"].includes(parsed.protocol) && parsed.host === (request.headers.get("host") || new URL(request.url).host); }
  } catch { originMatches = false; }
  if (!originMatches || request.headers.get("sec-fetch-site") === "cross-site") return error(403, "Permintaan tidak diizinkan.");
  if (!request.headers.get("content-type")?.startsWith("application/json")) return error(415, "Gunakan format JSON.");
  if (Number(request.headers.get("content-length")) > 8192) return error(413, "Isian terlalu panjang.");
  let input;
  try {
    const reader = request.body?.getReader(); if (!reader) return error(400, "Isian tidak lengkap.");
    const chunks: Uint8Array[] = []; let size = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 8192) { await reader.cancel(); return error(413, "Isian terlalu panjang."); } chunks.push(value); }
    const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    input = assistantInputSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
  } catch { return error(400, "Isian tidak dapat dibaca."); }
  if (!input.success) return error(400, "Periksa isian dan persetujuan penggunaan AI.");
  const release = reserve(); if (!release) return error(429, "Batas pencarian sementara tercapai. Silakan coba lagi nanti.");
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]);
  try { return Response.json(await runAssistant(input.data, signal), { headers }); }
  catch (cause) {
    if (signal.aborted) return error(504, "Pencarian terlalu lama atau dibatalkan. Silakan coba lagi.");
    if (cause instanceof AssistantError) return error(cause.status, cause.message);
    return error(502, "Jawaban belum dapat diproses. Silakan coba lagi.");
  } finally { release(); }
}

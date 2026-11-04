import { z } from "zod";

export const assistantInputSchema = z.object({
  kind: z.enum(["recipes", "stimulation", "guide"]),
  query: z.string().trim().min(2).max(500),
  ageMonths: z.number().int().min(0).max(216).optional(),
  ingredients: z.string().trim().max(200).default(""),
  allergies: z.string().trim().max(200).default(""),
  consent: z.literal(true),
}).strict();
export type AssistantInput = z.infer<typeof assistantInputSchema>;
export const answerSchema = z.object({
  summary: z.string().min(1).max(1500),
  ideas: z.array(z.object({
    title: z.string().min(1).max(160),
    materials: z.string().max(500),
    steps: z.array(z.string().min(1).max(600)).min(1).max(6),
    sourceIds: z.array(z.number().int().positive()).min(1).max(3),
  })).max(3),
  cautions: z.array(z.string().max(500)).max(4),
});
export type Source = { id: number; title: string; url: string; snippet: string };
export type AssistantResult = { status: "ok"; answer: z.infer<typeof answerSchema>; sources: Omit<Source, "snippet">[] } | { status: "empty"; message: string };
export const allowedDomains = ["unicef.org", "who.int", "kemkes.go.id", "kemenkes.go.id", "idai.or.id", "nhs.uk", "healthychildren.org"];
export function trustedUrl(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    if (!allowedDomains.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`))) return null;
    return url.href;
  } catch { return null; }
}
export function parseSources(raw: unknown): Source[] {
  const parsed = z.object({ results: z.array(z.object({ title: z.string(), url: z.string(), snippet: z.string().optional() })) }).safeParse(raw);
  if (!parsed.success) return [];
  const seen = new Set<string>();
  return parsed.data.results.flatMap(row => {
    const url = trustedUrl(row.url);
    if (!url || seen.has(url) || !row.snippet?.trim()) return [];
    seen.add(url);
    return [{ id: seen.size, title: row.title.slice(0, 180), url, snippet: row.snippet.slice(0, 2400) }];
  }).slice(0, 3);
}
export function parseAnswer(content: string, sources: Source[]) {
  const cleaned = content.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  const answer = answerSchema.parse(JSON.parse(cleaned));
  const valid = new Set(sources.map(source => source.id));
  if (answer.ideas.some(idea => idea.sourceIds.some(id => !valid.has(id)))) throw new Error("Invalid source reference");
  // Links must come from retrieved sources, never from generated prose.
  const generatedText = JSON.stringify(answer);
  if (/https?:\/\/|www\./i.test(generatedText)) throw new Error("Unexpected generated link");
  return answer;
}

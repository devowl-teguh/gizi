# NaraRouter integration

Implemented 4 November 2026. The local `.env` is ignored by Git. The NaraRouter API key is supplied through `NARAROUTER_API_KEY`; the model `deepseek-v4-flash` and `https://router.bynara.id/v1` endpoint are fixed in server code. No key is bundled into browser assets. Existing model and base URL environment variables are no longer read.

## Request path

1. Browser shows the exact context fields and requires an unchecked-by-default consent box.
2. It POSTs kind, query, optional age in months, materials/ingredients, optional allergies, and consent to `/api/assistant`. No profile name, birth date, or sex is included automatically. Free text can still contain personal information if a user types it; the form asks users not to do so.
3. Server validates a strict Zod schema; unknown fields are rejected. Request bodies are capped at 8 KiB. Outbound requests identify the application as `Gizi/0.1`; the default client identification was rejected by the provider's Cloudflare protection during local testing.
4. One explicit NaraRouter MCP `web_search` call requests five results. Domain hints favor UNICEF for play and NHS for recipes. Domain filtering is enforced again locally because search responses can include results outside requested domains.
5. At most three unique HTTPS sources with nonempty excerpts are accepted from UNICEF, WHO, Kemenkes/Kemkes, IDAI, NHS, or HealthyChildren. Each excerpt is capped at 2,400 characters. No page fetch or autonomous tool loop is performed.
6. One completion synthesizes an Indonesian JSON answer. It receives only those excerpts and the entered context, with a 2,200-token output request. Invalid output, truncated answers, generated URLs, or source IDs outside the retrieved set are rejected. Links rendered in the browser are taken only from retrieved sources.
7. Empty or irrelevant evidence produces a no-result state; search/provider failures produce sanitized errors. No raw provider payloads are logged.

Sources are retrieved references, not proof of clinical review. Snippet-based generation can miss context, and a model can still misinterpret a valid source. The UI tells users to inspect the sources. Clinical calculations, vaccination schedules, and diagnoses are outside this agent's scope.

Recipes require an entered age; product support begins at six months. The model is instructed to consider age, texture, allergies, adult supervision, and choking risks, and not to invent nutritional values. This is not an allergy-safety certification.

## Lifetime and cancellation

- Search form, consent, loading state, errors, and answers are component memory only.
- Closing a panel aborts its browser request. Explicit session reset also unmounts the panel and clears profile/query state.
- A request-generation counter discards late responses after cancel/reset/unmount.
- The server combines the request abort signal with a 45-second deadline for search plus completion. Cancellation is best-effort upstream; work already performed may still be charged.
- Requests and responses use no-store. No database, cookies, or browser persistence are added.

## Cost and public hosting

- One search plus at most one completion per submitted request; no automatic retries.
- Up to two concurrent requests and twelve attempts per hour per process, counted without user data or IP storage. Attempts, including failures, count toward this local limit.
- Counters reset on process restart and do not coordinate across instances. They are not sufficient public-hosting abuse protection.
- **Production AI is disabled by default.** Configure shared edge/platform rate limits, a hard account budget, appropriate hosting log exclusions, and trusted proxy/Host handling before explicitly setting `AI_PUBLIC_ENABLED=true`.
- The endpoint rejects cross-origin browser requests and cross-site fetches. Same-origin checking is not authentication and does not stop direct scripted abuse.
- Model and gateway pricing/quotas remain operator-controlled. A timeout/token setting is not a guaranteed monetary spending cap.

## Privacy review

Reviewed https://router.bynara.id/privacy (policy dated 6 June 2026) and https://router.bynara.id/docs on 4 November 2026.

NaraRouter states that prompt/output content is not retained by default; operational metadata is retained and underlying model providers/publisher accounts apply their own retention/use policies. The exact underlying provider terms for the selected alias have not been independently established. The UI discloses third-party processing and does not promise third-party deletion when a local session ends. The product is for adult caregivers; do not submit child identity information.

## Validation

`npm test` uses mocked fetches and no live key. Covers consent/identity rejection, URL filtering, fabricated citations, empty search without generation, bounded search/completion flow, sanitized upstream failure, abort propagation, recipe age guard, and concurrency/hourly limits.

Live tests used synthetic context only: authenticated model discovery, explicit MCP search, a stimulation answer with UNICEF links, and browser recipe search. Same-origin/no-consent and cross-origin requests were checked for rejection. Environment files and actual secrets must never be committed.

Final checks: lint, TypeScript, eight automated tests, and production build passed. Browser test confirmed that ending a session during an active request closes the panel and restores an empty session. Production-mode endpoint returned 503 with public AI disabled. Same-origin missing-consent returned 400; cross-origin returned 403. Exact configured secret was scanned against Git-visible files and built browser assets and was absent.

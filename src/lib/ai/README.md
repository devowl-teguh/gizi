# Server-side AI boundary

`nararouter.ts` is server-only. It performs one explicit search and at most one synthesis request. `contracts.ts` contains shared schemas and source validation; `limits.ts` stores operational counters only.

See docs/AI_INTEGRATION.md for privacy, limits, production gating, and testing. Never add API keys or personal payload logging here.

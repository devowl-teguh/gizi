<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gizi project conventions

Read FEATURE_SUMMARY.md, docs/TECH_STACK.md, and docs/DESIGN.md before implementation.

- Use Next.js App Router, TypeScript, Tailwind, Zod, and Recharts.
- Keep child data and conversations in React memory only; no persistent browser or server storage.
- Keep NaraRouter secrets and calls server-side. Never log personal payloads.
- Use verified deterministic rules for growth and vaccination; AI handles sourced search and explanations.
- Keep AI disabled until validation, request/cost limits, timeout handling, and provider privacy review are in place.
- Playful Growth homepage design was approved on 4 November 2026. See docs/DESIGN.md for implementation status.
- Update documentation when changing architecture or scope.
- Run npm run lint, npm run typecheck, and npm run build after substantive code changes.

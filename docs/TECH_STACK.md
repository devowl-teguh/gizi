# Tech stack and architecture

Agreed: 4 November 2026. Product scope: ../FEATURE_SUMMARY.md.

## Decisions

- Next.js App Router and TypeScript: one application for UI and server Route Handlers. Requires a server runtime; static export is insufficient for AI endpoints.
- Tailwind CSS: responsive styling.
- React Context and useReducer: in-memory session state, with no persistence middleware.
- Zod: validation at browser and server boundaries.
- Server-side fetch: NaraRouter integration. No separate agent server or SDK required initially.
- Recharts: growth charts. Clinical reference data and calculations must be independently verified.
- Vercel Web Analytics: homepage page views only, with URL query strings and fragments removed. See [Analytics](ANALYTICS.md).
- No database or authentication.

## AI connection

Browser → POST /api/assistant → server-side validation and bounded agent orchestration → NaraRouter → answer and supporting sources.

Base URL: https://router.bynara.id/v1
Documentation: https://router.bynara.id/docs

Use NARAROUTER_API_KEY as a server-only secret. Never expose it through NEXT_PUBLIC_, browser code, logs, or source control. Choose NARAROUTER_MODEL after checking models available to the key and web-search support. An ordinary model completion must not be presented as verified web search.

Agent work: recipe search, stimulation activities, parenting references, and sourced explanations. Deterministic code owns growth calculations and vaccine rules. The model must not invent clinical reference values or citations.

Before enabling the public endpoint: validate and limit input, bound tool rounds and output size, apply timeouts, enforce cost/rate controls, and handle failures. Deployment-level rate controls may use short-lived operational counters without storing child data; in-process counters alone are unreliable across server instances.

## Session and privacy

Child profiles, forms, chat, and results remain in React memory. Do not use localStorage, sessionStorage, IndexedDB, cookies, service-worker caches, or a database for this information. Public assets may be cached.

Requests and sensitive responses use no-store. Do not put personal context in URLs. Exclude payloads from application, hosting, analytics, and error-reporting logs. Send only necessary age/context to AI; omit names and full dates of birth.

Reload creates a new session. Background tabs may retain data, and browser restoration means closing a tab is not an absolute deletion guarantee. Provide an explicit “Hapus data & selesai” action that resets all state, aborts pending requests, and ignores late responses.

Downloads are intentional user-owned copies and survive the website session. Context sent to NaraRouter/model providers is governed by their policies; gateway retention policy has been reviewed, while underlying-provider terms are not independently established. This limitation is disclosed before AI use; see docs/AI_INTEGRATION.md.

## Structure

- src/app: pages, layouts, and API Route Handlers.
- src/components/ui: shared UI primitives.
- src/components/layout: navigation and page layout.
- src/features/session: temporary profile and session state.
- src/features/growth: measurements and verified calculations.
- src/features/development: milestone checklist.
- src/features/stimulation: activity search.
- src/features/vaccines: referenced schedule logic.
- src/features/recipes: recipe search.
- src/features/assistant: AI-facing UI.
- src/features/export: explicit summary download.
- src/lib/ai: server-only NaraRouter adapter and agent orchestration.
- src/lib/validation: shared input schemas.
- src/lib/reference-data: reviewed reference datasets and provenance.
- docs: durable architecture and product decisions.

## Status

Responsive Playful Growth homepage, in-memory session provider, validated temporary child profile, navigation, accessible modal dialogs, privacy explanation, and explicit session reset are implemented. Native uncontrolled profile fields stay in the DOM only while their dialog is mounted; reset remounts the screen to discard every draft. Profile and query state live in React Context/useReducer.

NaraRouter recipe, stimulation, and general parenting searches are implemented with explicit consent, trusted source filtering, cancellation, timeouts, and local process limits. Production AI stays disabled until shared hosting protections are configured. See [AI integration](AI_INTEGRATION.md).

Weight-for-age uses WHO daily LMS parameters for ages 0–1,856 days, an in-memory measurement, a Recharts reference graph, and restricted LMS beyond ±3 SD. Optional length/height-for-age also uses WHO daily LMS values. It uses recumbent length through day 730, standing height from day 731, and adjusts by 0.7 cm if the recorded position differs. It does not assess weight-for-height or diagnose. Source and limitations are recorded in `src/lib/reference-data/README.md`; clinical review remains outstanding.

Development monitoring uses four selected CDC milestones per age stage for ages 2–71 months, with the younger checklist between ages and the 5-year examples for 60–71 months. The original CDC guidance calls for corrected age when born more than three weeks early; users are instructed to seek professional help choosing age. This translated subset is neither the full CDC checklist nor validated screening. Responses are stored only in session and cleared on profile changes, reset and refresh. Translation has not been clinically reviewed.

The vaccine panel presents the 2025 Kemenkes routine program for infancy through 18 months, including region-specific JE, and allows optional in-session status notes. It is not an eligibility or catch-up algorithm; other vaccines and school schedules are omitted, and the source must be periodically rechecked. Clinical review remains outstanding.

The user can print the current profile, latest growth and development results, vaccine notes and latest successful AI result or save them as PDF through the browser print dialog. Results remain in React memory until reset or refresh. The downloaded file remains on the device. A full vaccine eligibility and catch-up tool remains pending.

## Installed scaffold versions

- next: `16.4.5` (exact resolved versions in package-lock.json).
- react: `19.3.0` (exact resolved versions in package-lock.json).
- react-dom: `19.3.0` (exact resolved versions in package-lock.json).
- recharts: `^3.10.1` (exact resolved versions in package-lock.json).
- server-only: `^0.0.1` (exact resolved versions in package-lock.json).
- zod: `^4.6.7` (exact resolved versions in package-lock.json).

## Initial validation

Lint, TypeScript checking, and production build passed on 4 November 2026. npm audit reported 16 moderate advisories in the ESLint development-tool dependency chain; no forced downgrade was applied. Review compatible tooling updates before release.

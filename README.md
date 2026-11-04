# Gizi

A session-only parenting and child nutrition web app. The approved Playful Growth homepage and temporary profile flow are implemented; clinical tools and live AI are still pending.

## Development

Requires Node.js 22 LTS and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Environment values remain blank until configured; the assistant endpoint intentionally returns 503.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

## Project documentation

- [Feature summary](FEATURE_SUMMARY.md)
- [Tech stack and architecture](docs/TECH_STACK.md)
- [Approved design reference](docs/DESIGN.md)
- [Contributor rules](AGENTS.md)

The session feature contains the working homepage and profile flow. Other feature directories remain placeholders. Child data stays in browser memory only and is cleared by explicit reset or page reload. Deploy with a Next.js server runtime when enabling AI; static-only hosting cannot run Route Handlers.

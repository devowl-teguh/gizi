# Gizi

A session-only parenting and child nutrition web app. Initial scaffold; product features and live AI are not implemented.

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
- [Design reference — pending review](docs/DESIGN.md)
- [Contributor rules](AGENTS.md)

Feature directories are placeholders, not working modules. No child data is collected by the initial page. Deploy with a Next.js server runtime when enabling AI; static-only hosting cannot run Route Handlers.

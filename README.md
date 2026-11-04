# Gizi

A session-only parenting and child nutrition web app. The approved Playful Growth homepage and temporary profile flow are implemented; sourced NaraRouter search is available locally. Clinical tools are still pending.

## Development

Requires Node.js 22 LTS and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Set NARAROUTER_API_KEY and NARAROUTER_MODEL in the ignored environment file. Search requires explicit consent; profile identity is not sent automatically. Production AI is disabled by default pending shared hosting safeguards. See docs/AI_INTEGRATION.md.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Project documentation

- [Fitur tertunda dan prioritas berikutnya](docs/ROADMAP.md)
- [Feature summary](FEATURE_SUMMARY.md)
- [Tech stack and architecture](docs/TECH_STACK.md)
- [Approved design reference](docs/DESIGN.md)
- [AI integration and privacy](docs/AI_INTEGRATION.md)
- [Contributor rules](AGENTS.md)

The session feature contains the working homepage and profile flow. Other feature directories remain placeholders. Child data stays in browser memory only and is cleared by explicit reset or page reload. Deploy with a Next.js server runtime when enabling AI; static-only hosting cannot run Route Handlers.

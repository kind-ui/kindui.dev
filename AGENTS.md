# AGENTS.md

kindui.dev: the Kind UI homepage at `/` and the docs at `/docs`, one Next.js static export served by Cloudflare Workers static assets. Each library (kind-ui/agent-ui, kind-ui/charts) owns its own docs content and registry; this repo owns the homepage, the `/docs` overview, the docs shell and hosting. Read the spec first: [`docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md`](docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md).

## Workflow

- **Code:** write with [`write-code`](.agents/skills/write-code/SKILL.md), finish with [`unslop`](.agents/skills/unslop/SKILL.md), then run [`expert-review`](.agents/skills/expert-review/SKILL.md).
- **Docs:** write with [`write-docs`](.agents/skills/write-docs/SKILL.md) and [`fumadocs`](.agents/skills/fumadocs/SKILL.md). Plan a new kind of page with [`documentation-writer`](.agents/skills/documentation-writer/SKILL.md).
- **Before every push:** run `unslop` and `expert-review` on the diff.

The skills and experts are listed in [`.agents/skills/README.md`](.agents/skills/README.md) and [`.agents/experts/README.md`](.agents/experts/README.md).

## Stay close to the source

- **Fumadocs:** scaffold with `create-fumadocs-app` and add features and components with `npx @fumadocs/cli`. Look every API up first in the Fumadocs MCP server (`.mcp.json`, `.vscode/mcp.json`) or `https://www.fumadocs.dev/llms.txt`. When the code differs from the docs, cite the page in the commit.
- **Next.js:** the pinned version's docs are in `node_modules/next/dist/docs/`.
- **Registry components:** install with `npx shadcn add`; don't copy source by hand.
- Prefer an existing OSS package or framework feature over writing your own.
- Never name design or reference projects in code, docs, commits or PRs. Name only what we build on (Next.js, Fumadocs, Tailwind, shadcn, UI SDK, Cloudflare). Required attribution goes in `THIRD_PARTY_NOTICES.md` only.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Serves the site with hot reload (webpack). |
| `npm run build` | Builds the static export to `out/`. |
| `npm run lint` | Biome: lint, format and import order. `npm run format` fixes what it can. |
| `npm run typecheck` | Generates route and MDX types, then `tsc --noEmit`. |
| `node scripts/expert-scope.mjs` | Which experts a change needs (see `expert-review`). |

Run `lint` and `typecheck` while you work, and `build` when you touch pages, config or content. Check exit codes.

## Rules

- Static only: no server code, middleware or runtime env. Every route must export to a file in `out/`.
- Links inside the site are root-relative (`/docs/...`). Use `https://kindui.dev` only in metadata and in text users paste elsewhere.
- The homepage (`app/(home)/`) and the docs (`app/(docs)/`) are separate root layouts. Neither imports the other's CSS or components.
- Versions are exact for Next and Fumadocs, and match agent-ui's docs app.

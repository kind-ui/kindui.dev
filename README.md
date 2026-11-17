# kindui.dev

The Kind UI site: the homepage at [kindui.dev](https://kindui.dev) and the docs at [kindui.dev/docs](https://kindui.dev/docs). It's a Next.js static export with Fumadocs, served by Cloudflare Workers static assets.

Each library keeps its own docs and registry in its repo ([agent-ui](https://github.com/kind-ui/agent-ui), [charts](https://github.com/kind-ui/charts)). This repo owns the homepage, the `/docs` overview, the docs shell and hosting. See the [design spec](docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md).

## Develop

Requires Node 22.22 or newer and npm 11.9.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static export to out/
```

`npx wrangler dev` serves `out/` the way production does.

## Library docs and registries

`libraries.json` pins each library's release. Before `dev`, `build` and `typecheck`, `npm run libraries` checks out the library's docs at that tag into `.libraries/`, downloads the release's registry, and assembles `public/r/`. `components/ui/` holds the pinned registry's React components, installed with `npm run components`; run it and commit the result after a library bump. Renovate opens the bump PRs, and CI fails until `components/ui/` matches.

To preview a library's unreleased docs, build its registry in its checkout and point at it: `KINDUI_LIBRARY_AGENT_UI=../agent-ui npm run dev`.

## Deploy

Every push to `main` builds the site and deploys it with Wrangler (`.github/workflows/deploy.yml`). The `production` environment holds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. To roll back, revert the commit, or run `npx wrangler rollback`.

## Contribute

Read [AGENTS.md](AGENTS.md) for the workflow and the agent skills this repo uses.

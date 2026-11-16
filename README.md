# kindui.dev

The Kind UI site: the homepage at [kindui.dev](https://kindui.dev) and the docs at [kindui.dev/docs](https://kindui.dev/docs). It's a Next.js static export with Fumadocs, served by Cloudflare Workers static assets.

Each library keeps its own docs and registry in its repo ([agent-ui](https://github.com/kind-ui/agent-ui), [charts](https://github.com/kind-ui/charts)). This repo owns the homepage, the `/docs` overview, the docs shell and hosting. See the [design spec](docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md).

## Develop

Requires Node 22.18 or newer and npm 11.9.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # static export to out/
```

`npx wrangler dev` serves `out/` the way production does.

## Deploy

Every push to `main` builds the site and deploys it with Wrangler (`.github/workflows/deploy.yml`). The `production` environment holds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. To roll back, revert the commit, or run `npx wrangler rollback`.

## Contribute

Read [AGENTS.md](AGENTS.md) for the workflow and the agent skills this repo uses.

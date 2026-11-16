# kindui.dev site

## Goal

`kind-ui/kindui.dev` builds and hosts kindui.dev: the homepage, the docs root and shared docs shell, and (in phase 2) every library's docs and one merged registry. Each library keeps its docs content and registry next to its code and publishes them with each release.

| Path | Owner |
| --- | --- |
| `/` | homepage, this repo |
| `/docs` | Kind UI overview, shared setup, layout, navigation, search: this repo |
| `/docs/agent-ui/**` | kind-ui/agent-ui content, pulled at a pinned release (phase 2) |
| `/docs/charts/**` | kind-ui/charts content, pulled at a pinned release (phase 2) |
| `/r/` | every library's registry, merged (phase 2) |

No one uses the libraries yet, so URLs move in one cut with no redirects or shims. Every breaking change is listed below.

## Decisions

- **One Next.js app**, static export, matching agent-ui's docs stack: Next 16.4.6, `fumadocs-core` 16.19.3, `fumadocs-ui` as `npm:@fumadocs/base-ui@16.19.3`, `fumadocs-mdx` 15.6.2. It builds with webpack, which the homepage needs.
- **Hosting:** Cloudflare Workers static assets (no Worker script) on the free plan. kindui.dev's DNS moves from Spaceship to a free Cloudflare zone; the registration stays at Spaceship.
- **Deploys:** every push to main deploys from GitHub Actions.
- **No per-library landing pages.** `/docs/<lib>` is each library's home. charts' showcase app retires.
- **Homepage:** imported as it is today, with its links updated to the new URLs. Its copied Agent UI components, stage and examples are replaced with registry installs once agent-ui publishes them; that change isn't tied to either phase.

## Phase 1: homepage and `/docs`, live on kindui.dev

### Layout

```
app/(home)/layout.tsx, page.tsx, globals.css   homepage (own <html>, nav, theme)
app/(docs)/layout.tsx, global.css              docs root layout and theme (own <html>)
app/(docs)/docs/layout.tsx                     Fumadocs Spacious DocsLayout with library tabs
app/(docs)/docs/[[...slug]]/page.tsx           renders content/docs
app/api/search/route.ts                        static search index
app/llms.txt, llms-full.txt, llms.mdx/         llms.txt and per-page Markdown
app/og/docs/                                   Open Graph images
components/ examples/ lib/ public/ vendor/     homepage, as imported
components/docs-*.tsx, mdx.tsx                 docs provider, search dialog, section body, MDX components
content/docs/                                  docs content (below)
lib/source.ts, shared.ts, sections.ts          loader, site constants, library sections
wrangler.jsonc
.github/workflows/ci.yml, deploy.yml
```

The docs app comes from `create-fumadocs-app` (`+next+fuma-docs-mdx+static`). The homepage and the docs use separate root layouts (Next route groups), so their CSS and theme handling stay independent.

### `/docs` content and shell

The docs follow fumadocs.dev's own setup: each part of the docs is a root folder (`"root": true` in its `meta.json`), shown as a dropdown of tabs at the top of the sidebar, and only the open root's pages appear in the sidebar.

```
content/docs/meta.json                 ["(overview)", "agent-ui", "charts"]
content/docs/(overview)/               root "Kind UI": index.mdx at /docs
content/docs/agent-ui/                 root "Agent UI": /docs/agent-ui/**
content/docs/charts/                   root "Charts": /docs/charts/**
```

- `/docs` covers what Kind UI is, one card per library, shared setup (the `@kind-ui` registry entry in `components.json`, the Tailwind 4 requirement) and where each library's `llms.txt` lives.
- In phase 1, each library root holds one page: the library's own description and links to its repository and npm package. Phase 2 replaces each folder with the library's published docs, including its `meta.json`.

**Theme:** the same as fumadocs.dev: the `neutral` color preset with the Spacious layout (`fumadocs-ui/layouts/spacious`, `fumadocs-ui/css/generated/spacious.css`), Geist fonts, and a primary color per library. A client body component reads the first slug segment and sets a class (`agent-ui` or `charts`) that sets `--color-fd-primary`: Agent UI purple (`#9a63f6`, dark `#c29aff`) and Charts blue (`#1686ff`, dark `#7ec5ff`), the homepage's colors. Each tab's Lucide icon (`lucideIconsPlugin`) takes its library's color.

Search is static (`createFromSource(...).staticGET` with `useStaticSearch`). `/llms.txt` is generated with Fumadocs' `llms()` helper, with absolute `https://kindui.dev` URLs.

### Homepage import

Copy the approved homepage (app, components, examples, lib, public, vendor, package.json deps, next config) into the layout above. Change only:

- `lib/links.ts`, `components/agent/data.ts`, `components/copy-prompt.tsx`: `/charts`, `/charts/docs/` and `/agent-ui/docs/…` become `/docs/charts`, `/docs/charts/…` and `/docs/agent-ui/…`. llms.txt links become `/docs/agent-ui/llms.txt` and `/docs/charts/llms.txt`.
- Next config: merge the homepage's `extensionAlias` webpack rule into the Fumadocs `createMDX` config.

### Hosting and deploys

- `wrangler.jsonc` serves `./out` as static assets with `html_handling: "auto-trailing-slash"` and `not_found_handling: "404-page"`.
- **`ci.yml` (pull requests):** `npm ci`, `npm run lint`, `npm run typecheck` (`next typegen && tsc --noEmit`), `npm run build`, then `lycheeverse/lychee-action` in offline mode over `out/` to check internal links. `.lycheeignore` lists `/r/`, the phase 2 path; phase 2 deletes it.
- **`deploy.yml` (push to main):** the same build, then `cloudflare/wrangler-action` deploy. It runs in a `production` environment holding `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, with a concurrency group so deploys don't overlap.
- **Rollback:** revert the commit, which redeploys, or `wrangler rollback`.

### Domain switch (owner)

1. Create a free Cloudflare account and deploy once to the Worker's `*.workers.dev` URL. Check `/` and `/docs` there.
2. Add kindui.dev as a zone. Keep the Google verification TXT record; drop the two A records that point to Sites.
3. At Spaceship, replace the nameservers with Cloudflare's.
4. Once the zone is active, attach kindui.dev to the Worker as a Custom Domain.
5. Remove the domain from the ChatGPT Site, then delete the Site.

kindui.dev may be down for a short while during the switch.

### charts cleanup (its own session, in kind-ui/charts)

Once kindui.dev is on Cloudflare, charts no longer hosts anything:

- Remove the `/` → `/charts` redirect, domain-root mode (`KIND_UI_DOMAIN_ROOT`, `apps/showcase/scripts/domain-root.mjs`, `apps/showcase/scripts/prepare-hosting.mjs`) and the root `/r` and `llms.txt` redirects from `apps/showcase`.
- Remove the "Prepare the root registry…", "Build the existing domain-root host" and "Verify root registry, Docs mounts and homepage assets" steps from `.github/workflows/docs.yml`, and `apps/showcase/tests/registry-hosting.spec.ts`.
- Keep the registry build and the docs build; phase 2 uses both.

Retiring `apps/showcase` itself belongs to the charts docs rewrite in phase 2.

### Breaking changes in phase 1

- `/` serves the homepage instead of redirecting to `/charts`.
- `/charts`, `/charts/docs/**` and `/agent-ui/**` stop existing, permanently.
- `/r/**` returns 404 until phase 2, so `npx shadcn add https://kindui.dev/r/<item>.json` fails for charts items until then.
- `/docs/agent-ui` and `/docs/charts` hold one page each until phase 2, so the homepage's links to component pages under them return 404 until then.
- `/llms.txt` covers only this repo's pages until phase 2.
- agent-ui's release-time namespace check (`scripts/check-registry-namespace.mjs`) needs `/r/registry.json`. It only runs when `KINDUI_HOSTING` is `true`, which stays unset until phase 2.

## Phase 2: library docs and the merged registry (outline)

Phase 2 gets its own spec revision and plan. Its shape:

1. **Prerequisite:** rewrite the charts docs onto agent-ui's stack (Fumadocs 16.19.3 Base UI, Next 16.4.6) and retire `apps/showcase`.
2. **`@kind-ui/docs-kit`:** move the shared MDX components (preview, install tabs, type tables) from this repo into a small package published from here. Each library's local docs preview installs it instead of copying.
3. **Per-release asset:** each library's release attaches `<lib>-site-<version>.tar.gz` and its `.sha256`, gated by `KINDUI_HOSTING`, containing:
   - `docs/`: self-contained content (MDX, `meta.json`, examples, generated pages). Anything a library generates from its own source, such as agent-ui's `fumadocs-typescript` type tables and charts' `npm run generate` pages, is resolved before packing, so this repo needs no library source.
   - `r/`: the library's registry, at the same version.
4. **Links:** library content uses links relative to its own root, not absolute `/docs/...`. Agent UI's current Get Started page becomes the `/docs/agent-ui` root page.
5. **This repo:** `libraries.json` pins each library's release version. The build downloads and verifies each asset, extracts `docs/` to `content/docs/<lib>/`, installs the registry items so examples' `@/components/ui/...` imports resolve, and merges every `r/` into `/r/` (one flat `@kind-ui` namespace; the build fails on a duplicate item name). Renovate opens one PR per library release, and nothing auto-merges.
6. Turn on immutable releases in both library repos, then set `KINDUI_HOSTING=true`.

## Out of scope

Per-library landing pages, PR preview deploys, and browser tests in this repo.

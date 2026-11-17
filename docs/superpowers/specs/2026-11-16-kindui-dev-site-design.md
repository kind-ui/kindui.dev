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

- The Kind UI root covers only what spans the libraries, and links to a library's pages instead of repeating them. **Overview:** Get Started (`/docs`: a setup prompt per library and cards into each library), Introduction, Installation (the `@kind-ui` registry entry in `components.json`, Tailwind 4, shadcn CLI or npm), Theming (what both libraries share: `color-scheme` for dark mode) and Changelog (each library's `CHANGELOG.md` at its pinned tag, pulled in with `<include>`). **Agents** (`/docs/agents/**`): Built for Agents, Set Up With an Agent, Docs for Agents (`llms.txt` and per-page Markdown), Skills and MCP. **Guides:** only guides that use more than one library.
- In phase 1, each library root holds one page: the library's own description and links to its repository and npm package. Phase 2 replaces each folder with the library's published docs, including its `meta.json`.

**Theme:** the same as fumadocs.dev: the `neutral` color preset with the Spacious layout (`fumadocs-ui/layouts/spacious`, `fumadocs-ui/css/generated/spacious.css`), Geist fonts, and a primary color per library. A client body component reads the first slug segment and sets a class (`agent-ui` or `charts`) that sets `--color-fd-primary`: Agent UI purple (`#9a63f6`, dark `#c29aff`) and Charts blue (`#1686ff`, dark `#7ec5ff`), the homepage's colors. Each tab's Lucide icon (`lucideIconsPlugin`) takes its library's color.

Search is static (`createFromSource(...).staticGET` with `useStaticSearch`). `/llms.txt` is generated with Fumadocs' `llms()` helper, with absolute `https://kindui.dev` URLs.

### Homepage import

Copy the approved homepage (app, components, examples, lib, public, vendor, package.json deps, next config) into the layout above. Change only:

- `lib/links.ts`, `components/agent/data.ts`, `components/copy-prompt.tsx`: `/charts`, `/charts/docs/` and `/agent-ui/docs/…` become `/docs/charts`, `/docs/charts/…` and `/docs/agent-ui/…`. llms.txt links become `/docs/agent-ui/llms.txt` and `/docs/charts/llms.txt`.
- Next config: merge the homepage's `extensionAlias` webpack rule into the Fumadocs `createMDX` config.

### Hosting and deploys

- `wrangler.jsonc` serves `./out` as static assets with `html_handling: "auto-trailing-slash"` and `not_found_handling: "404-page"`.
- **`ci.yml` (pull requests):** `npm ci`, `npm run lint`, `npm run typecheck` (`next typegen && tsc --noEmit`), `npm run build`, then `lycheeverse/lychee-action` in offline mode over `out/` to check internal links. `.lycheeignore` lists `/r/` and the library sub-pages under `/docs/agent-ui/` and `/docs/charts/`, which arrive in phase 2; phase 2 deletes those lines.
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

## Phase 2: library docs and the merged registry

Each library's docs render in this repo's Fumadocs shell, from the library's own repository at its pinned release tag, and its registry is served from `/r/`. Agent UI goes first (phase 2a); Charts follows once its docs are rewritten onto the same stack (phase 2b).

### How a library is pulled in

- **Pin:** `libraries.json` maps each library to its repo, tag format, version and the paths the docs need:

  ```json
  {
    "agent-ui": {
      "repo": "kind-ui/agent-ui",
      "tag": "v{version}",
      "version": "0.3.1",
      "docs": "apps/docs",
      "paths": ["apps/docs/content", "apps/docs/examples", "apps/docs/source.config.ts", "packages/agent-ui/src"]
    }
  }
  ```

- **Fetch:** `scripts/fetch-libraries.mjs` runs before `dev`, `build` and `typecheck`. For each library it:
  - sparse-checks out `paths` at the tag into `.libraries/<lib>/source/`, keeping the repo's layout, so every path relative to an MDX file (type tables, includes) resolves unchanged;
  - downloads `<lib>-site-<version>.tar.gz` and its `.sha256` from the release, checks the hash, and extracts only `r/` to `.libraries/<lib>/r/`;
  - fails, naming the library and version, when the tag or asset is missing, the hash differs, or the installed `@kind-ui/<lib>` npm version differs from the pin.

  `.libraries/` is gitignored. `KINDUI_LIBRARY_<NAME>=<checkout>` copies a local checkout and its built registry instead, so a library author can preview unreleased docs.
- **Render:** each library's docs folder (`.libraries/<lib>/source/<docs>`) is a [Fumadocs MDX workspace](https://www.fumadocs.dev/docs/mdx/workspace) with its own collection and the library's own `source.config.ts` options (Agent UI's `fumadocs-typescript` type tables). `lib/source.ts` combines the root collection and each workspace with a multi-source `loader()`, mounting each library under `/docs/<lib>/`. The root collection is defined in `source.config.ts` too, because the generated workspace types come from the root config's collection of the same name. The library's `meta.json` gives the sidebar order; this repo sets the root-folder title, description and icon, so the library needs no kindui.dev-specific metadata.
- **Components:** examples import `@/components/ui/<name>`, as a shadcn user's code does. `npm run components` installs every React item from the pinned `r/` with `npx shadcn add` into `components/ui/`, then restores the exact `@kind-ui/<lib>` and `@ui-sdk/*` pins that shadcn loosens. `components/ui/` is committed: shadcn edits `package.json` as it installs, so it can't run in every build. CI reinstalls and fails when the result differs, so a bump PR stays red until someone runs `npm run components` and commits. The homepage uses the same installed components, which replaces its copied `components/ui/` and `vendor/`.
- **MDX components:** this repo provides the components the library pages use (`Example`, `Caption`, `Tab`, `Tabs`, `TypeTable`) in `components/mdx.tsx`. When a second library needs the same components, they move into a hidden `docs-kit` item in this site's `@kind-ui` registry (phase 2b).
- **Edit on GitHub** links point at the library's repo and tag, not this repo.

### The registry

`scripts/assemble-registry.mjs` (part of `npm run libraries`) copies every library's `r/*.json` into `public/r/` (gitignored) and writes `public/r/registry.json` with `name: "kind-ui"`, `homepage: "https://kindui.dev"` and every library's items, in `libraries.json` order. It fails on a duplicate item name or file. `_redirects` sends `/r` and `/r/` to `/r/registry.json`; `_headers` serves `/r/*` as JSON with `Access-Control-Allow-Origin: *`.

### Updates

Renovate watches each library's GitHub releases through a regex manager on `libraries.json`, grouped with the library's npm packages, so one PR bumps the tag and the packages together. CI builds the PR; nothing auto-merges. Merging deploys.

### Phase 2a: Agent UI

**In kind-ui/agent-ui** (one PR, released as 0.3.1):

- MDX imports of examples become relative (`../../../examples/step/basic`, not `@/examples/step/basic`), since `@/` is the host app's root.
- Links between pages become relative file links (`./step.mdx`), which `createRelativeLink` resolves in both apps.
- The "not published yet" callout on Get Started goes; 0.3.0 is on npm.
- `scripts/check-registry-namespace.mjs` treats a 404 from `https://kindui.dev/r/registry.json` as an empty registry.
- Settings, then release: immutable releases on, `KINDUI_HOSTING=true`, a patch changeset.

**In this repo:**

- `libraries.json`, the fetch, workspace, loader and registry steps above.
- `content/docs/agent-ui/` goes; Agent UI's Get Started page becomes `/docs/agent-ui`.
- `.lycheeignore` drops `/r/` and the Agent UI paths.
- The homepage moves to `@kind-ui/agent-ui` 0.3.1 and the installed `components/ui/`; its links into the Agent UI docs now resolve.

### Phase 2b: Charts (outline)

1. Rewrite the charts docs onto Agent UI's stack (Fumadocs 16.19.3 Base UI, Next 16.4.6) and retire `apps/showcase`.
2. Give charts a `charts-site-<version>` asset with its `r/`, gated by `KINDUI_HOSTING`, and immutable releases.
3. Move the shared MDX components into `docs-kit`, a hidden `registry:block` item in the `@kind-ui` registry with its source in this repo. Every docs app (this site and each library's preview app) installs it with `npx shadcn@latest add @kind-ui/docs-kit`. No npm package.
4. Add charts to `libraries.json`; `content/docs/charts/` goes.

### Breaking changes in phase 2a

- `/docs/agent-ui/**` serves Agent UI's real docs; the placeholder page goes.
- The homepage's Agent UI components come from the 0.3.1 registry instead of the copied pre-release source.

## Out of scope

Per-library landing pages, PR preview deploys, and browser tests in this repo.

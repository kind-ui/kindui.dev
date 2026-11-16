# kindui.dev Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** kindui.dev serves the approved homepage at `/` and the Kind UI docs root at `/docs` from this repo, deployed to Cloudflare Workers on every push to main.

**Architecture:** One Next.js 16 app with static export (`out/`). The homepage and the docs each have their own root layout in a route group. Fumadocs renders `content/docs`, with static search and a generated `llms.txt`. Cloudflare Workers static assets serve `out/`, and GitHub Actions builds, link-checks and deploys.

**Tech Stack:** Next 16.4.6 (webpack), React 19, Tailwind 4, fumadocs-core 16.19.3, fumadocs-ui `npm:@fumadocs/base-ui@16.19.3`, fumadocs-mdx 15.6.2, wrangler, lychee.

**Spec:** `docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md`

## Global Constraints

- Versions exactly: `next` 16.4.6, `fumadocs-core` 16.19.3, `fumadocs-ui` `npm:@fumadocs/base-ui@16.19.3`, `fumadocs-mdx` 15.6.2.
- `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`; build with `next build --webpack`.
- Homepage source: `/Users/bchow/.copilot/chats/2026-11-15/redesigned-telegram-fd6a4ecc/kindui-home`. Import it as is; change only what Task 1 lists.
- Internal links are root-relative (`/docs/...`), never `https://kindui.dev/...`, so they work on `*.workers.dev`. Exception: metadata (`metadataBase`, canonical URLs) and copy that a user pastes elsewhere (registry URL, llms.txt URLs in copy-prompt text) keep `https://kindui.dev`.
- Phase 2 paths that return 404 in phase 1: `/docs/agent-ui`, `/docs/charts`, `/r/`.
- Never name design/reference projects in code, docs, commits or PRs. Name only what we build on (Next.js, Fumadocs, Tailwind, Cloudflare, shadcn).
- Commit trailer: `Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>`.

## Review Focus

1. An unknown URL (e.g. `/nope`) returns the 404 page with status 404, not the homepage with 200. Covered in Task 3, Step 3.
2. `/docs` without a trailing slash reaches the docs page (auto trailing-slash redirect). Covered in Task 3, Step 3.
3. Search works in the static build: the client fetches `/api/search` and it holds the `/docs` page. Covered in Task 2, Step 4.
4. No leftover old URLs (`kindui.dev/charts`, `/agent-ui/docs`, `/charts/docs`) in the built HTML/JS. Covered in Task 1, Step 4.
5. Homepage styles don't leak into `/docs` and vice versa: each root layout imports only its own CSS. Covered in Task 2, Step 4 (docs HTML references no homepage CSS chunk).

---

### Task 1: Import the homepage at `/`

**Files:**
- Create: `package.json`, `package-lock.json`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `.gitignore` (`node_modules/`, `.next/`, `out/`, `.source/`, `*.tsbuildinfo`, `.wrangler/`)
- Create: `app/(home)/layout.tsx`, `app/(home)/page.tsx`, `app/(home)/globals.css` (from the homepage's `app/`)
- Create: `components/`, `examples/`, `lib/`, `public/`, `vendor/` (copied as is)
- Modify after copy: `lib/links.ts`, `components/agent/data.ts`, `components/copy-prompt.tsx`

**Interfaces:**
- Produces: `npm run build` → `out/`; scripts `dev` (`next dev --webpack`), `build` (`next build --webpack`), `typecheck` (`tsc --noEmit` for now; Task 2 prefixes `fumadocs-mdx &&`).

- [ ] **Step 1: Copy the homepage.** Copy everything except `node_modules/`, `out/`, `tsconfig.tsbuildinfo`, `next-env.d.ts`. Move `app/*` into `app/(home)/`. Rename `next.config.ts` to `next.config.mjs` with the same options and webpack `extensionAlias` rule, so Task 2 can wrap it with `createMDX`. Set `next` to exactly `16.4.6`. Name the package `kindui.dev`, `private: true`.
- [ ] **Step 2: Update links.**
  - `lib/links.ts`: `charts` → `/docs/charts`, `chartsDocs` → `/docs/charts/`, `agentUiDocs` → `/docs/agent-ui`, `llms` → `https://kindui.dev/docs/charts/llms.txt`. Keep `shadcn` as is.
  - `components/agent/data.ts`: `charts` → `/docs/charts`, `home` → `/`, `docsHref(slug)` → `` `/docs/agent-ui/components/${slug}` ``.
  - `components/copy-prompt.tsx`: `https://kindui.dev/agent-ui/llms.txt` → `https://kindui.dev/docs/agent-ui/llms.txt`, `https://kindui.dev/charts/docs/llms.txt` → `https://kindui.dev/docs/charts/llms.txt`.
- [ ] **Step 3: Build.** Run `npm install && npm run build`. Expected: succeeds and writes `out/index.html`.
- [ ] **Step 4: Check old URLs are gone.** Run `grep -rlE 'kindui\.dev/charts|kindui\.dev/agent-ui|/charts/docs|/agent-ui/docs' out/ app/ components/ lib/`. Expected: no output.
- [ ] **Step 5: Visual check.** Run `npx serve out -l 4401` and open `/` in the browser canvas. Expected: it matches the approved homepage.
- [ ] **Step 6: Commit.** `feat: import the kindui.dev homepage`

### Task 2: `/docs` with Fumadocs

**Files:**
- Create: `source.config.ts`, `lib/source.ts`, `components/mdx.tsx`
- Create: `app/(docs)/layout.tsx`, `app/(docs)/docs/layout.tsx`, `app/(docs)/docs/[[...slug]]/page.tsx`, `app/(docs)/docs/docs.css`
- Create: `app/api/search/route.ts`, `app/llms.txt/route.ts`
- Create: `content/docs/index.mdx`, `content/docs/meta.json`
- Modify: `next.config.mjs`, `package.json`, `tsconfig.json` (`collections/*` → `.source/*` path alias)

**Interfaces:**
- Consumes: Task 1's `next.config.mjs` and scripts.
- Produces: `source` (Fumadocs `loader` with `baseUrl: "/docs"`) exported from `lib/source.ts`; `getMDXComponents(components?)` from `components/mdx.tsx`. Phase 2 adds content under `content/docs/<lib>/`.

- [ ] **Step 1: Install and wire Fumadocs.** Add the exact versions from Global Constraints. Add `"postinstall": "fumadocs-mdx"` and set `typecheck` to `fumadocs-mdx && tsc --noEmit`. Wrap the config with `createMDX()` from `fumadocs-mdx/next`. In `source.config.ts`, use `defineDocs({ dir: "content/docs" })` and an empty `defineConfig()`.
- [ ] **Step 2: Layouts and page.**
  - `app/(docs)/layout.tsx` is its own `<html>` root with `RootProvider` and `search: { options: { type: "static" } }`. It imports only `docs.css` (`@import "tailwindcss"; @import "fumadocs-ui/css/neutral.css"; @import "fumadocs-ui/css/preset.css";`) and uses the homepage's Geist fonts.
  - `DocsLayout` has `nav.title` "Kind UI" linking to `/`, plus `links` for Docs (`/docs`) and GitHub (`https://github.com/kind-ui`).
  - The page follows the standard Fumadocs `[[...slug]]` page with `generateStaticParams` and `generateMetadata` (`metadataBase: https://kindui.dev`).
- [ ] **Step 3: Content, search, llms.txt.**
  - `content/docs/index.mdx`, title "Kind UI", has three parts:
    - a one-paragraph intro: Kind UI is a set of React component libraries for agent and data interfaces, built on shadcn and Tailwind;
    - `<Cards>` for Agent UI (`/docs/agent-ui`) and Charts (`/docs/charts`);
    - a "Setup" section with the `components.json` snippet `"registries": { "@kind-ui": "https://kindui.dev/r/{name}.json" }`, a line that Tailwind 4 is required, and a line that each library publishes an `llms.txt` under its docs.
  - `meta.json`: `{ "pages": ["index"] }`.
  - `app/api/search/route.ts`: `export const revalidate = false; export const { staticGET: GET } = createFromSource(source);`
  - `app/llms.txt/route.ts`: `revalidate = false`, returns `llms(source).index()` as `text/plain`.
- [ ] **Step 4: Build and check.** Run `npm run typecheck && npm run build`, then check each:
  - `grep -q 'Kind UI' out/docs/index.html`
  - `grep -q '/docs' out/llms.txt`
  - `test -s out/api/search`
  - the docs HTML loads no CSS file that the homepage's HTML loads: `comm -12 <(grep -o '_next/static/css/[^"]*' out/index.html | sort -u) <(grep -o '_next/static/css/[^"]*' out/docs/index.html | sort -u)` prints nothing

  Expected: all pass. Then open `/docs` in the browser canvas, search for "Setup", and toggle dark mode.
- [ ] **Step 5: 404 page.** Add a top-level not-found page that works with multiple root layouts: `app/global-not-found.tsx` with its own `<html>`, plus the Next flag it needs if the build asks for one. Rebuild. Expected: `out/404.html` exists.
- [ ] **Step 6: Commit.** `feat: add the /docs root with Fumadocs`

### Task 3: Cloudflare hosting, CI and deploys

**Files:**
- Create: `wrangler.jsonc`, `.lycheeignore`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `README.md` (replace: what the repo is, `npm run dev`/`build`, how deploys work)
- Modify: `package.json` (add `wrangler` devDependency)

**Interfaces:**
- Consumes: `npm run typecheck`, `npm run build` → `out/`.
- Produces: Worker named `kindui-dev`; repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` in a `production` environment (owner creates them).

- [ ] **Step 1: wrangler config.**

```jsonc
{
  "name": "kindui-dev",
  "compatibility_date": "2026-11-16",
  "assets": { "directory": "./out", "html_handling": "auto-trailing-slash", "not_found_handling": "404-page" }
}
```

- [ ] **Step 2: Workflows.**
  - Both workflows: Node 22, `npm ci`, `npm run typecheck`, `npm run build`, actions pinned by SHA, `permissions: contents: read`, `persist-credentials: false` on checkout.
  - `ci.yml` (pull_request): after the build, run `lycheeverse/lychee-action` with `args: --offline --root-dir ${{ github.workspace }}/out --no-progress 'out/**/*.html'`.
  - `deploy.yml` (push to main and `workflow_dispatch`): `environment: production`, `concurrency: { group: deploy, cancel-in-progress: false }`, then `cloudflare/wrangler-action` with `command: deploy`.
  - `.lycheeignore`: one regex per phase 2 path (`/docs/agent-ui`, `/docs/charts`, `/r/`), with a comment that phase 2 removes them.
- [ ] **Step 3: Local serve check.** Run `npx wrangler dev`, then:
  - `curl -s -o /dev/null -w '%{http_code}' localhost:8787/` → `200`
  - `curl -sL -o /dev/null -w '%{http_code}' localhost:8787/docs` → `200`
  - `curl -s -o /dev/null -w '%{http_code}' localhost:8787/nope` → `404`
  - `curl -s localhost:8787/nope | grep -q -i 'not found'`
- [ ] **Step 4: Local link check.** Run `lychee --offline --root-dir "$PWD/out" 'out/**/*.html'` if lychee is installed; otherwise rely on CI. Expected: 0 errors.
- [ ] **Step 5: Commit, push, open a PR.** `ci: deploy kindui.dev to Cloudflare Workers`. Expected: `ci.yml` passes on the PR.

### Task 4: Domain switch (owner, with agent checks)

No code. The owner does steps 1–5; the agent verifies.

- [ ] **Step 1:** Create a Cloudflare account. Create an API token with the "Edit Cloudflare Workers" template. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to the repo's `production` environment.
- [ ] **Step 2:** Merge the PR. Expected: `deploy.yml` succeeds; `https://kindui-dev.<subdomain>.workers.dev/` and `/docs/` return 200.
- [ ] **Step 3:** Add kindui.dev as a zone (free plan). Keep the `google-site-verification` TXT record and delete the two A records. At Spaceship, set the nameservers to the two Cloudflare gives.
- [ ] **Step 4:** Once the zone is active, go to Workers → `kindui-dev` → Settings → Domains → add Custom Domain `kindui.dev`.
- [ ] **Step 5:** Remove the domain from the ChatGPT Site, then delete the Site.
- [ ] **Step 6: Verify.**
  - `dig +short NS kindui.dev` shows Cloudflare nameservers.
  - `curl -s -o /dev/null -w '%{http_code}' https://kindui.dev/` → `200`, with no `location` header.
  - `curl -sL -o /dev/null -w '%{http_code}' https://kindui.dev/docs` → `200`.
  - `curl -s -o /dev/null -w '%{http_code}' https://kindui.dev/charts` → `404`.

### Task 5: charts hosting cleanup (new session in kind-ui/charts)

Start a child session in kind-ui/charts after Task 4 Step 6 passes, with the spec's "charts cleanup" section as its brief:

- Remove the `/` → `/charts` redirect, domain-root mode (`KIND_UI_DOMAIN_ROOT`, `apps/showcase/scripts/domain-root.mjs`, `apps/showcase/scripts/prepare-hosting.mjs`) and the root `/r` and `llms.txt` redirects from `apps/showcase/next.config.ts`.
- Remove the "Prepare the root registry…", "Build the existing domain-root host" and "Verify root registry, Docs mounts and homepage assets" steps from `.github/workflows/docs.yml`, and `apps/showcase/tests/registry-hosting.spec.ts`.
- Keep the registry and docs builds.

Done when charts' `docs.yml` passes and `grep -rn 'KIND_UI_DOMAIN_ROOT\|prepare-hosting\|domain-root' apps .github` finds nothing.

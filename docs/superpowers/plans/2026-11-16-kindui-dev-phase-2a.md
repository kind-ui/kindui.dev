# kindui.dev Phase 2a (Agent UI docs and registry) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/docs/agent-ui/**` renders Agent UI's own docs at a pinned release, and `/r/` serves its registry.

**Architecture:** A fetch script sparse-checks out kind-ui/agent-ui at the pinned tag into `.libraries/agent-ui/` and extracts the release's `r/`. That checkout's `apps/docs` is a Fumadocs MDX workspace combined with the root docs by a multi-source `loader()`. shadcn installs the pinned registry items into `components/ui/` for both the docs examples and the homepage.

**Tech Stack:** Next 16.4.6, fumadocs-core/ui 16.19.3, fumadocs-mdx 15.6.2, fumadocs-typescript 5.6.1, shadcn 4.23.0, `@kind-ui/agent-ui` 0.3.1, `@ui-sdk/*` 0.1.0-beta.1, Renovate.

**Spec:** `docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md`, "Phase 2" and "Phase 2a".

## Global Constraints

- Pins are exact, and the Fumadocs versions match agent-ui's `apps/docs/package.json` at the pinned tag.
- `.libraries/`, `components/ui/` and `public/r/` are generated and gitignored.
- The fetch fails, naming the library and version, on a missing tag or asset, a hash mismatch, or an installed `@kind-ui/agent-ui` version that differs from the pin.
- Look up Fumadocs APIs (workspaces, multi-source `loader`, `update`) in the Fumadocs docs or MCP server before writing them, and cite the page when the code differs.
- Run `write-code`, `unslop` and `expert-review` as AGENTS.md says. Never name reference projects.

## Review Focus

1. A fresh clone with no `.libraries/` builds with one `npm ci && npm run build`. Covered in Task 6.
2. Every Agent UI page renders its live example and its type tables. A wrong `path` fails the build. Covered in Task 3, Step 4.
3. Links between Agent UI pages resolve under `/docs/agent-ui/`. The lychee check covers them once the ignore entries are gone. Covered in Task 5.
4. `npx shadcn add https://kindui.dev/r/step.json` works against the deployed site. Covered in Task 6.
5. The homepage still renders after moving to the 0.3.1 components. Covered in Task 4, Step 3.

---

### Task 1: agent-ui 0.3.1 (child session in kind-ui/agent-ui)

Brief for a new session; the spec's "Phase 2a / In kind-ui/agent-ui" list is the scope:

- [ ] MDX example imports become relative (`../../../examples/<name>/basic`). Page links become relative `.mdx` links. Remove the "not published yet" callout.
- [ ] `check-registry-namespace.mjs` treats a 404 as an empty live registry, with a unit test.
- [ ] Add a patch changeset and open a PR. After merge: the user turns on immutable releases; set `KINDUI_HOSTING=true`; merge the version PR; the user approves the npm publish. Done when release `v0.3.1` has `agent-ui-site-0.3.1.tar.gz` and its `.sha256`.

Tasks 2–5 run in parallel with Task 1, against a local agent-ui checkout (Task 2's override).

### Task 2: Fetch libraries

**Files:** create `libraries.json`, `scripts/fetch-libraries.mjs`, `scripts/fetch-libraries.test.mjs`. Modify `package.json` and `.gitignore`.

**Interfaces:** produces `.libraries/<lib>/<paths…>` and `.libraries/<lib>/r/*.json`. Scripts: `"libraries": "node scripts/fetch-libraries.mjs"`, plus `predev`, `prebuild` and `pretypecheck` hooks that run it.

- [ ] **Step 1: Tests** (`node --test`) for the pure parts:
  - `tagFor({tag: "v{version}", version: "0.3.1"}) === "v0.3.1"`;
  - `parseSha256("abc  agent-ui-site-0.3.1.tar.gz\n") === "abc"`;
  - `checkInstalled("agent-ui", "0.3.1", "0.3.0")` throws a message naming both versions.
- [ ] **Step 2: Implement.**
  - Checkout: `git clone --depth 1 --filter=blob:none --sparse --branch <tag>`, then `git sparse-checkout set --no-cone <paths>`. Skip the clone when `.libraries/<lib>/.tag` already matches.
  - Asset: download with `fetch` from `https://github.com/<repo>/releases/download/<tag>/<lib>-site-<version>.tar.gz` and its `.sha256`, check the hash with `node:crypto`, and extract `r/` with `tar`.
  - Local override: `KINDUI_LIBRARY_<LIB>=<path>` (e.g. `KINDUI_LIBRARY_AGENT_UI`) symlinks a local checkout instead, takes `r/` from `<path>/artifacts/registry/r`, and skips the version check. That lets a library author preview unreleased docs.
- [ ] **Step 3:** `node --test scripts/` passes. With the override set to `/Users/bchow/.copilot/repos/agent-ui` (after `npm run build:registry` there), `npm run libraries` fills `.libraries/agent-ui/`.
- [ ] **Step 4: Commit** `feat: fetch pinned library docs and registries`.

### Task 3: Render Agent UI docs

**Files:**
- Modify: `source.config.ts` (create it if missing), `lib/source.ts`, `components/mdx.tsx`, `app/(docs)/global.css`, `app/(docs)/docs/[[...slug]]/page.tsx`, `content/docs/meta.json`, `package.json`.
- Create: `components/example.tsx`, `components/caption.tsx`, `libraries/agent-ui.source.config.ts` (the workspace config: re-exports agent-ui's default config and defines its `docs` collection).
- Delete: `content/docs/agent-ui/`.

- [ ] **Step 1:** Add `fumadocs-typescript@5.6.1`. Register the workspace in `source.config.ts` (`workspaces: { "agent-ui": { dir: ".libraries/agent-ui/apps/docs", config: … } }`), following https://www.fumadocs.dev/docs/mdx/workspace.
- [ ] **Step 2:** In `lib/source.ts`, build `loader({ root, "agent-ui": … }, { baseUrl: "/docs" })`. Mount the workspace pages under `agent-ui/` and give its root folder `root: true`, the "Agent UI" title, its description and the `MessagesSquare` icon. Use the multi-source and `update` APIs from https://www.fumadocs.dev/docs/headless/source-api/source.md.
- [ ] **Step 3:**
  - MDX components: `Example`, `Caption`, `Tab`, `Tabs`, `TypeTable`. `Example` and `Caption` match agent-ui's `apps/docs/components` at the tag.
  - `global.css` imports `@kind-ui/agent-ui/styles/agent-ui.css` and adds `@source` for the workspace examples and `components/ui`.
  - Page: `githubUrl` points at the page's library repo and tag for workspace pages.
- [ ] **Step 4:** Check:
  - `npm run build` passes.
  - `out/docs/agent-ui/index.html` (Get Started) and `out/docs/agent-ui/components/step/index.html` exist.
  - The step page has a "Preview" tab and a props table row for `autoOpen`.
  - Visually check `/docs/agent-ui/components/step` (example works, Agent UI purple) and the tab switcher.
- [ ] **Step 5: Commit** `feat(docs): render Agent UI docs from its release`.

### Task 4: Installed components for docs and homepage

**Files:** create `components.json`. Modify `scripts/fetch-libraries.mjs`, `package.json`, `.gitignore`, and homepage files as the build requires. Delete `vendor/` and the copied `components/ui/`.

- [ ] **Step 1:**
  - Add `components.json` (aliases: `@/components`, `ui: @/components/ui`).
  - After extraction, the fetch runs `npx shadcn@4.23.0 add --yes --overwrite` with every React item's local JSON path: every item in `r/registry.json` except `*-web` and `internal-*`, since their dependencies pull internals in.
  - Set `@kind-ui/agent-ui` to the pinned version and `@ui-sdk/*` to the docs app's pins at the tag.
- [ ] **Step 2:** Remove `vendor/` and the `@ui-sdk/core` workaround pin. Run `npm run build` and fix the homepage call sites that the 0.3.1 component APIs changed. Changes go in our `components/agent/` and `examples/` code, never in `components/ui/`.
- [ ] **Step 3:** Check:
  - The homepage renders: open `/` in the browser canvas and check the hero, the Agent UI grid and the stage.
  - No console errors.
  - No horizontal scroll at 390px.
- [ ] **Step 4: Commit** `feat: install Agent UI components from its registry`.

### Task 5: Registry at /r/ and link checks

**Files:** create `scripts/assemble-registry.mjs` and `scripts/assemble-registry.test.mjs`. Modify `public/_headers`, `public/_redirects`, `.lycheeignore`, `package.json` and `.gitignore`.

- [ ] **Step 1: Tests:**
  - `mergeRegistries([{name: "a", items: [{name: "x"}]}, {items: [{name: "y"}]}])` gives two items, with `name: "kind-ui"` and `homepage: "https://kindui.dev"`;
  - a duplicate item name throws, naming the item and both libraries.
- [ ] **Step 2: Implement.**
  - The script copies `.libraries/*/r/*.json` to `public/r/` and writes the merged `registry.json`; it runs from `fetch-libraries.mjs` after extraction.
  - `_headers`: `/r/*` gets `Content-Type: application/json` and `Access-Control-Allow-Origin: *`.
  - `_redirects`: `/r` and `/r/` go to `/r/registry.json` (302).
- [ ] **Step 3:** Remove `/r/` and the agent-ui line from `.lycheeignore`, and remove `/docs/agent-ui` from `lib/links.ts` comments if any. `lychee --offline --index-files index.html` gives 0 errors.
- [ ] **Step 4: Commit** `feat: serve the merged registry at /r/`.

### Task 6: Pin 0.3.1, Renovate, review, ship

**Files:** create `renovate.json`. Modify `libraries.json`, `package.json`, `.github/workflows/*.yml` and README.

- [ ] **Step 1:** `renovate.json`:
  - a regex manager on `libraries.json` (`"version": "(?<currentValue>…)"` in each entry, `datasource: github-releases`, `depName` from `repo`, `extractVersion: ^v(?<version>.*)$` for agent-ui);
  - a `packageRules` group named `agent-ui`, matching `kind-ui/agent-ui`, `@kind-ui/agent-ui` and `@ui-sdk/*`.

  Install the Renovate app on the repo, or ask the user to.
- [ ] **Step 2:** Once Task 1 is done, pin 0.3.1 with no override. `rm -rf .libraries node_modules && npm ci && npm run lint && npm run typecheck && npm run build` passes, and CI's workflows need no extra step beyond the `prebuild` hook (confirm `actions/checkout` doesn't block `git clone`).
- [ ] **Step 3:** Run `unslop` and `expert-review` (docs, hosting, home), then fix or record the findings.
- [ ] **Step 4:** Open the PR. After merge and deploy, check:
  - `curl https://kindui.dev/docs/agent-ui/components/step/` returns 200;
  - `curl https://kindui.dev/r/registry.json` lists agent-ui items;
  - in a temp Next app, `npx shadcn@latest add https://kindui.dev/r/step.json` succeeds.

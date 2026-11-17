---
name: fumadocs
description: Edits the kindui.dev docs app (Fumadocs on Next.js, static export), including adding or updating a page, wiring Fumadocs features with its CLIs, and upgrading Fumadocs. Use whenever you touch app/(docs), content/docs or the docs config. For the words, use the write-docs skill.
---

# Fumadocs

The `/docs` app is Fumadocs on Next.js with `output: "export"`, scaffolded with `create-fumadocs-app` (`+next+fuma-docs-mdx+static`, Orama search) and merged with the homepage as a second root layout. Fumadocs changes often, so check its docs before you write anything from memory:

- `https://www.fumadocs.dev/llms.txt` lists every page; `https://www.fumadocs.dev/docs/next/llms.txt` the Next.js ones. Add `.md` to any docs URL for its Markdown.
- The Fumadocs MCP server (`.mcp.json`, `.vscode/mcp.json`): `list_pages`, `get_page`, `search`.

When the code differs from what the docs show, cite the docs page in the commit message and say why.

## Layout

| Path | Holds |
| --- | --- |
| `content/docs/**/*.mdx`, `meta.json` | Pages and the sidebar order |
| `app/(docs)/` | The docs root layout, `DocsLayout` and the page route |
| `lib/source.ts` | The `fumadocs-mdx` collection, the loader and `llms()` |
| `source.config.ts` | Global MDX options |
| `components/mdx.tsx` | MDX components |
| `cli.json` | `@fumadocs/cli` config |

The homepage is a separate root layout in `app/(home)/` with its own CSS and theme. Nothing in `app/(docs)/` imports from it.

The shell follows fumadocs.dev's own setup: the Spacious layout (`fumadocs-ui/layouts/spacious`, and `layouts/spacious/page` for the page parts) on the `neutral` preset, with each part of the docs as a root folder (`"root": true`) shown as tabs at the top of the sidebar. `content/docs/(overview)/` is the Kind UI root at `/docs`. Each library's docs app, checked out at its pinned tag into `.libraries/<lib>/source/`, is a Fumadocs MDX workspace (`source.config.ts`), mounted under `/docs/<lib>/` by the multi-source loader in `lib/source.ts`. `content/docs/charts/` is a placeholder until charts joins (spec phase 2b). A library's pages take its color as `--color-fd-primary` (`app/(docs)/global.css`, `lib/sections.ts`).

## Use the CLIs, not hand-written code

Run them with `npx @fumadocs/cli@<pinned>`:

- `feature <id>` wires a feature (`llms`, `search`, `og`, `feedback`, …).
- `add <component>` installs a Fumadocs UI component's source into `components/fumadocs/`.
- `customise` swaps a layout part for an editable copy.

Prefer Fumadocs UI's own components (`fumadocs-ui/components/*`) and MDX features (`<include>`, `tab=` code blocks, `Callout`, `Cards`) over custom ones.

## Static export

A static build has no server. The search index is exported from `app/api/search/route.ts` and searched in the browser. `/llms.txt` is a static route. There's no MCP server, Ask AI or `proxy.ts`.

## Check it

`npm run typecheck` and `npm run build` (Next.js type-checks it too). `npm run dev` serves it with hot reload.

## Upgrade

Bump `fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx` and `@fumadocs/cli` together, to the versions agent-ui's docs pin, and read `https://www.fumadocs.dev/docs/next/upgrade.md` first. Pins are exact.

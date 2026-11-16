---
name: write-code
description: Writes and edits kindui.dev code (the homepage, the Fumadocs docs app, build config, Wrangler and workflows) by starting from the file that already does the same job, then checks it with the repo's checks and a cold read. Use whenever you write or change code in this repo, before you call the change done.
---

# Write kindui.dev code

The bar: an expert in the area reads the file and says "this is how I'd write it", and anyone else reads it top to bottom without stopping. Readable first, then fast, never clever.

## 1. Find the twin

Every piece of code here has a twin that already does it. Open it before you write a line, and copy its shape, names and order.

| You're writing | Start from |
| --- | --- |
| A homepage section | `components/features.tsx`, laid out by `components/sections.tsx` |
| A homepage link | `lib/links.ts`; never a URL inline in a component |
| A docs page | `content/docs/index.mdx`, ordered in `content/docs/meta.json` |
| Docs shell, layout or route | The Fumadocs CLI output or the Fumadocs docs page for it (see [`fumadocs`](../fumadocs/SKILL.md)), not memory |
| A script | `scripts/expert-scope.mjs` |
| A workflow | `.github/workflows/ci.yml` |

If two twins disagree, one of them has the wrong shape. Say so instead of picking one. Copy a twin's shape, not its comments.

## 2. Load the area

Read [AGENTS.md](../../../AGENTS.md), the spec in `docs/superpowers/specs/`, and the expert notes for every area you touch: `.agents/experts/<area>/expert.md` and its `decisions.md`. For anything Fumadocs, look the API up first: the Fumadocs MCP server or `https://www.fumadocs.dev/llms.txt`. Next.js docs ship in `node_modules/next/dist/docs/`; they describe the pinned version, so trust them over memory.

## 3. Write it

- **Prefer OSS and the framework.** Use Next.js, Fumadocs, Tailwind and the installed packages before writing your own. A new runtime dependency needs a reason in the PR.
- **Use the CLIs.** Fumadocs features and components come from `create-fumadocs-app` and `@fumadocs/cli`; registry components come from `npx shadcn add`. Don't hand-write what a CLI generates.
- **Static only.** The site is a static export served by Cloudflare Workers static assets. No server code, middleware or runtime env.
- **Root-relative links** (`/docs/...`) inside the site, so it works on any host. Absolute `https://kindui.dev` only in metadata and in text users paste elsewhere.
- **Names in full words** that say what a thing is. Booleans read as questions.
- **No comment by default.** Write one only when a reader would get the code wrong without it: a browser bug, a framework quirk, a trade-off. One to three lines.
- **No defensive code for cases that can't happen.** The types rule them out.
- **No helper for one caller,** and no wrapper that only renames.

## 4. Check it

Run the quick checks while you work and check exit codes, not output:

```sh
npm run lint
npm run typecheck
npm run build      # when you touched pages, config or content
```

When a check is slow, hand it to a subagent with only the command and the files it covers, and keep writing.

## 5. Read it cold

Read the whole diff as the area's expert would, using the checklist in each `expert.md` you loaded, and as a teammate who has never seen it:

- Would an expert in this area write it this way? If you can name a more idiomatic version, write that one.
- Is every name clear without its comment?
- Is anything duplicated that exists elsewhere, in this repo or in a framework we use?
- Does any function do two things, or any file hold two ideas?

## 6. Unslop, then review

Run [`unslop`](../unslop/SKILL.md) on your diff, then [`expert-review`](../expert-review/SKILL.md). The change isn't ready to push until both have run.

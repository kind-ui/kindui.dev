---
name: write-docs
description: Writes or reviews the kindui.dev docs in content/docs (the Kind UI overview and shared setup) in the site's voice. Use for new pages, prose edits and docs reviews. Pair it with the fumadocs skill, which covers the site's mechanics.
---

# Write kindui.dev Docs

Write like you're explaining Kind UI to a friend who hasn't used it yet. Say what it does, show it, then explain what happens. The [`fumadocs`](../fumadocs/SKILL.md) skill covers where files go and how the site is wired; this one covers the words.

Size the work to the request. For a sentence, read this guide and the section you're changing, check any claim you touch, and reread the section. For a new page or a rewrite, follow the steps below. A review produces findings, a draft stays in chat, and an edit changes files. Treat existing wording as intentional unless the request calls for revising it.

This repo writes only the pages that aren't about one library: `/docs` and shared setup. A library's pages live in its own repo and follow its own `write-docs` skill.

## 1. Read the Page and Its Neighbors

Read the page you're changing and the library docs it links to, so it continues what the reader already knows. Link to what a library page already teaches instead of repeating it.

## 2. Check Every Claim

For every command, URL, version or behavior you describe, check its source: the library's README, its docs, its registry JSON at `https://kindui.dev/r/`, or its package on npm. Don't describe planned behavior as shipped.

## 3. Write the Page

**Open with the point.** The frontmatter `description` says what the reader gets. The first paragraph adds when to use it, without repeating the description.

**Explain one thing at a time.**

- Use familiar words, contractions and short paragraphs. Address the reader: "Use X to…", "Add Y when…".
- Skip marketing claims, rhetorical openings and invented scenarios.
- Explain the action before the code, and the result or a limit after it.
- Use Title Case for titles and headings. Keep identifiers exact (`components.json`, `@kind-ui`).
- Prefer periods, commas or parentheses to em dashes.

**Keep examples small.** One command or one config snippet per idea. Explain code in the prose rather than in comments.

Never name other component libraries or reference projects. UI SDK, shadcn, Fumadocs, Next.js, Tailwind and the AI SDK are fine.

## 4. Read and Verify

Read the page in order and ask: can someone understand what Kind UI is, pick a library and set it up, without an unexplained name or repeated setup? Then check the rendered page and run `npm run build`. Report what changed and what you checked, including anything you couldn't.

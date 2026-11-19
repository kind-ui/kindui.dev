# Docs expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `d0fdaf55e66164fcd2dc88c8a4f1e0ff9e29011b` (Agent UI 0.5.0)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- `/llms.txt` starts with `# Docs`, as fumadocs.dev's does.
- **Agent UI previews sit at a message's width** (`components/example.tsx`), so a narrow control like a Picker button starts at that box's left edge rather than the preview's centre.

## Known and open (don't report again, check whether fixed)

- **Relative `.mdx` links in the `/llms.mdx/**.md` output don't resolve there.** Library pages link `./components/line.mdx`; the processed Markdown keeps it. Affects Agent UI and Charts alike.

## Resolved

- **"Edit on GitHub" pointed at this repo.** `sourceUrl` (`lib/shared.ts`) links library pages to the library's repo at its pinned tag.

## Revisit

Nothing yet.

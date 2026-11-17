# Docs expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `a1608d04db73c3d7603e3c1beb325be826f4c114` (error pages)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- `/llms.txt` starts with `# Docs`, as fumadocs.dev's does.

## Known and open (don't report again, check whether fixed)

- **Relative `.mdx` links in the `/llms.mdx/**.md` output don't resolve there.** Library pages link `./components/line.mdx`; the processed Markdown keeps it. Affects Agent UI and Charts alike.

## Resolved

- **"Edit on GitHub" pointed at this repo.** `sourceUrl` (`lib/shared.ts`) links library pages to the library's repo at its pinned tag.

## Revisit

Nothing yet.

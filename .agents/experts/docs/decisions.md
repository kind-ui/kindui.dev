# Docs expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `3620073425867a8342134c07fe4ca08dbc5f5ee8` (phase 1 docs and hosting)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- `/llms.txt` starts with `# Docs`, as fumadocs.dev's does.

## Known and open (don't report again, check whether fixed)

- **Phase 2: "Edit on GitHub" points at this repo.** `ViewOptionsPopover`'s `githubUrl` uses `kind-ui/kindui.dev/content/docs/...`; library pages are extracted at build, so it must point at each library's repo once they arrive.

## Resolved

Nothing yet.

## Revisit

Nothing yet.

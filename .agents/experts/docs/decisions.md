# Docs expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `3d484ed6450ba74db5b0c831a09eeb4a577b880f` (phase 2a)

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

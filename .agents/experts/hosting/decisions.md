# Hosting expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `3620073425867a8342134c07fe4ca08dbc5f5ee8` (phase 1 docs and hosting)

## Settled

- Everything in the spec's "Decisions" section.
- `/404` serves `404.html` with status 200: a direct request for Next's 404 export, not a missing page. Not worth a rule.

## Known and open (don't report again, check whether fixed)

- **The registry hash comes from the same release as the archive,** and the docs are cloned by tag. That catches a corrupt download, not a replaced asset or a moved tag; immutable releases on agent-ui cover both. Pinning a hash and commit in `libraries.json` would stop Renovate from bumping it.
- **The Renovate regex only matches `v{version}` tags.** Charts' `@kind-ui/charts@{version}` needs a second matcher in phase 2b.
- **`npx shadcn@4.23.0` pins shadcn but not its dependencies,** so the components check could drift if one of them changes.

## Resolved

Nothing yet.

## Revisit

Nothing yet.

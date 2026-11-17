# Hosting expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `a1608d04db73c3d7603e3c1beb325be826f4c114` (error pages)

## Settled

- Everything in the spec's "Decisions" section.
- `/404` serves `404.html` with status 200: a direct request for Next's 404 export, not a missing page. Not worth a rule.

## Known and open (don't report again, check whether fixed)

- **The registry hash comes from the same release as the archive,** and the docs are cloned by tag. That catches a corrupt download, not a replaced asset or a moved tag; immutable releases on agent-ui cover both. Pinning a hash and commit in `libraries.json` would stop Renovate from bumping it.
- **`npx shadcn@4.23.0` pins shadcn but not its dependencies,** so the components check could drift if one of them changes.

## Resolved

- **The Renovate regex only matched `v{version}` tags.** It now matches any tag, and each library's `extractVersion` rule strips its tag prefix (phase 2b).

## Revisit

Nothing yet.

# Hosting expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `5836dedbc9e58cde9e2408084c6ed59a249f2207` (Agent UI 0.6.0)

## Settled

- Everything in the spec's "Decisions" section.
- `/404` serves `404.html` with status 200: a direct request for Next's 404 export, not a missing page. Not worth a rule.
- **Write the lockfile with the npm in `packageManager` (11.9.0),** e.g. `npx npm@11.9.0 install --package-lock-only`; other npm versions flip unrelated `dev` and bundled entries.

## Known and open (don't report again, check whether fixed)

- **The registry hash comes from the same release as the archive,** and the docs are cloned by tag. That catches a corrupt download, not a replaced asset or a moved tag; immutable releases on agent-ui cover both (`v0.5.0` and `v0.6.0` are immutable). Charts' releases must be immutable too; `@kind-ui/charts@0.5.0` isn't. Pinning a hash and commit in `libraries.json` would stop Renovate from bumping it.
- **`npx shadcn@4.23.0` pins shadcn but not its dependencies,** so the components check could drift if one of them changes.

## Resolved

- **The Renovate regex only matched `v{version}` tags.** It now matches any `repo` … `version` entry whatever fields sit between (checked by `scripts/renovate.test.mjs`), and each library's `extractVersion` rule strips its tag prefix (phase 2b).

## Revisit

Nothing yet.

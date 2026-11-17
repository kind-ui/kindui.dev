# Home expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `a1608d04db73c3d7603e3c1beb325be826f4c114` (error pages)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- **The install picker lists items in registry order**, which is the library's docs sidebar order, so the first command shown is `step`. It follows the source rather than a hand-picked order.

## Known and open (don't report again, check whether fixed)

- **Charts' install items are a copy of kind-ui/charts' `registry/catalog.mjs`** (`lib/registry-items.ts`) until Charts is pinned in `libraries.json`; then they're read from its registry.
- **The ⌘K search in `components/search.tsx` is a hand-written list,** not the Fumadocs static index: it misses most docs pages and some Charts results 404. The error pages don't advertise it for that reason.
- **Agent UI's stylesheet covers all 31 components** (about 22 KB gzip) though the homepage shows about 7. `@kind-ui/agent-ui` exports one `styles.css`; per-component entries would have to come from agent-ui.
- **Replay does nothing visible under reduced motion**, the same as the stage's Replay, since both already show the finished state.

## Resolved

Nothing yet.

## Revisit

Nothing yet.

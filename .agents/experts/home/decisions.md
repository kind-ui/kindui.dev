# Home expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `d0fdaf55e66164fcd2dc88c8a4f1e0ff9e29011b` (Agent UI 0.5.0)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- **The install picker lists items in registry order**, which is the library's docs sidebar order, so the first command shown is `step`. It follows the source rather than a hand-picked order.

## Known and open (don't report again, check whether fixed)

- **The install picker reads both libraries' items from their pinned registries** (`lib/registry-items.ts`): Agent UI's `react` layer and Charts' `registry:component` items.
- **The ⌘K search in `components/search.tsx` is a hand-written list,** not the Fumadocs static index: it misses most docs pages and some Charts results 404. The error pages don't advertise it for that reason.
- **Agent UI's stylesheet covers all 49 components** (the homepage's CSS is about 44 KB gzip at 0.5.0, up from about 39 KB at 0.4.0) though the homepage shows 17. `@kind-ui/agent-ui` exports one `styles.css`; per-component entries would have to come from agent-ui.
- **Replay does nothing visible under reduced motion**, the same as the stage's Replay, since both already show the finished state.

## Resolved

- **Every grid tile's example loaded up front.** Each tile now loads its example with `next/dynamic` once it nears the viewport (`components/agent/components-grid.tsx`), so the grid's examples aren't in `/`'s HTML or first-load JavaScript: about 659 KB gzip at 0.5.0, down from about 721 KB at 0.4.0.

## Revisit

Nothing yet.

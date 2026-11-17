# Home expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `ad578ce591f5386c78c5fd8e6247b0baa1f1b79b` (Agent UI 0.4.0)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- **The install picker lists items in registry order**, which is the library's docs sidebar order, so the first command shown is `step`. It follows the source rather than a hand-picked order.

## Known and open (don't report again, check whether fixed)

- **The install picker reads both libraries' items from their pinned registries** (`lib/registry-items.ts`): Agent UI's `react` layer and Charts' `registry:component` items.
- **The ⌘K search in `components/search.tsx` is a hand-written list,** not the Fumadocs static index: it misses most docs pages and some Charts results 404. The error pages don't advertise it for that reason.
- **Agent UI's stylesheet covers all 42 components** (about 22 KB gzip, up from about 14 KB at 0.3.1; the homepage's CSS is about 39 KB gzip) though the homepage shows 17. `@kind-ui/agent-ui` exports one `styles.css`; per-component entries would have to come from agent-ui.
- **Every grid tile's example loads up front.** The four 0.4.0 tiles added about 30 KB gzip of JavaScript to `/`. Load below-the-fold tiles lazily before adding more.
- **Replay does nothing visible under reduced motion**, the same as the stage's Replay, since both already show the finished state.

## Resolved

Nothing yet.

## Revisit

Nothing yet.

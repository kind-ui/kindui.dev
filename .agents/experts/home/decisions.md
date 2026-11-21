# Home expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `5836dedbc9e58cde9e2408084c6ed59a249f2207` (Agent UI 0.6.0)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.
- **The install picker lists items in registry order**, which is the library's docs sidebar order, so the first command shown is `step`. It follows the source rather than a hand-picked order.
- **The header GitHub icon (homepage and docs nav) links to `kind-ui/agent-ui`; the footer's links to the org** (user's request). The footer lists the org on purpose.
- **No Conversation Search tile.** Its upstream example opens the bar with `defaultOpen` and no `shortcut`, so once closed it can't reopen; the Sidebar tile shows Wave 6 instead. Revisit when the example can reopen its bar.

## Known and open (don't report again, check whether fixed)

- **The install picker reads both libraries' items from their pinned registries** (`lib/registry-items.ts`): Agent UI's `react` layer and Charts' `registry:component` items.
- **The ⌘K search in `components/search.tsx` is a hand-written list,** not the Fumadocs static index: it misses most docs pages and some Charts results 404. The error pages don't advertise it for that reason.
- **Agent UI's stylesheet covers all 56 components** (the homepage's CSS is about 50 KB gzip at 0.6.0, up from about 44 KB at 0.5.0) though the homepage shows 19. `@kind-ui/agent-ui` exports one `styles.css`; per-component entries would have to come from agent-ui.
- **Replay does nothing visible under reduced motion**, the same as the stage's Replay, since both already show the finished state.

## Resolved

- **Every grid tile's example loaded up front.** Each tile now loads its example with `next/dynamic` once it nears the viewport (`components/agent/components-grid.tsx`), so the grid's examples aren't in `/`'s HTML or first-load JavaScript: about 669 KB gzip at 0.6.0 with 19 tiles, down from about 721 KB at 0.4.0 with 17.

## Revisit

Nothing yet.

# Home expert: decisions

What is already decided, and what is known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: `8694d78e9e2aaa7b279bdd08a0333889e40c22e5` (phase 1 homepage)

## Settled

- The wordmark lives in `components/brand/` and both layouts import it, so the docs logo matches the homepage's exactly (user's request). Neither imports anything else of the other's.
- Everything in the spec's "Decisions" section.

## Known and open (don't report again, check whether fixed)

- **Agent UI's stylesheet covers all 31 components** (about 22 KB gzip) though the homepage shows about 7. `@kind-ui/agent-ui` exports one `styles.css`; per-component entries would have to come from agent-ui.
- **Replay does nothing visible under reduced motion**, the same as the stage's Replay, since both already show the finished state.

## Resolved

Nothing yet.

## Revisit

Nothing yet.

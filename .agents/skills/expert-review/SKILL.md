---
name: expert-review
description: Reviews a kindui.dev change with its area experts (home, docs, hosting), only the ones the diff reaches. Use before every push, or when asked for an expert review. Pass a base ref, expert names, or nothing.
---

# Expert review

Run the area experts on what changed. Each expert lives in `.agents/experts/<area>/`: who it is, what it knows and its review checklist in `expert.md`, what's decided in `decisions.md`. You orchestrate; the experts review.

| Expert | Owns |
| --- | --- |
| `home` | The homepage: `app/(home)/`, `components/` (except the docs ones), `examples/`, `lib/links.ts`, `public/` |
| `docs` | The `/docs` app: `app/(docs)/`, `app/api/`, `app/llms*/`, `content/`, `source.config.ts`, `lib/source.ts`, the docs components |
| `hosting` | Build and deploy: `next.config.mjs`, `package.json`, `wrangler.jsonc`, `.github/`, `scripts/` |

`next.config.mjs` and `package.json` are shared: the home and docs experts read them for what their area meets.

## 1. Find the scope

```sh
node scripts/expert-scope.mjs --base origin/main          # a branch before pushing
node scripts/expert-scope.mjs --base <parent-branch>      # a stacked PR: only this layer's commits
node scripts/expert-scope.mjs --json                      # each expert from its "Last reviewed" commit
```

Arguments narrow it: a ref becomes `--base`; expert names keep only those experts. An empty plan means no expert is needed: say so and stop.

Run `npm run lint` first, so the experts spend their review on what the linter can't catch.

## 2. Ask the experts

Spawn one background agent per expert in the plan, all at once (in Claude Code, the named `<area>-expert` agents in `.claude/agents/`; elsewhere, a general-purpose agent told to read `.agents/experts/<area>/expert.md` first and act as it). Prompt:

```
Review mode. Scope: git diff <base>...HEAD.
Your files: <own>. Shared files: <shared>.
Review your files, and the shared ones only for what your area meets.
Don't report anything decisions.md lists, or these lint findings: <findings, or none>.
```

Give each expert only this. Experts that start a server use their own port and stop it before they finish.

## 3. Collect

1. One table: expert, verdict, proven findings by rank, suspected, revisit.
2. Dedupe: a finding several experts report is one item, listed once, with every area it reaches.
3. Hand the table to the user. Don't fix anything unless asked.

## 4. After triage

Each finding goes one of three ways, in the same turn:

- **Fix now**: fix it, with its proof as a check when it changes behavior.
- **Later**: one line under "Known and open" in that expert's `decisions.md`.
- **Won't do / decided otherwise**: one line under "Settled" in `decisions.md`, with the reason, so no expert raises it again.

Then move `Last reviewed:` in each expert's `decisions.md` to the reviewed `HEAD`.

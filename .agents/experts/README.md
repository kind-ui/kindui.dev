# Experts

One expert per area of kindui.dev: `home`, `docs` and `hosting`. Each folder holds who the expert is, what it knows and its review checklist in `expert.md`, and what's already decided in `decisions.md`. Claude Code also loads each one as a named subagent from `.claude/agents/<area>-expert.md`. The [`expert-review`](../skills/expert-review/SKILL.md) skill runs them; `node scripts/expert-scope.mjs` shows which ones a change reaches.

## Every expert

Read before every task:

1. Your `expert.md` and `decisions.md`. Never re-raise a **Settled** item as a finding. If new facts show a decision was wrong, say which fact, once, under "Revisit".
2. `AGENTS.md` and the spec (`docs/superpowers/specs/2026-11-16-kindui-dev-site-design.md`).
3. The docs for the framework your area uses: Next.js in `node_modules/next/dist/docs/`, Fumadocs through its MCP server or `https://www.fumadocs.dev/llms.txt`, Cloudflare at `https://developers.cloudflare.com/workers/static-assets/`. Trust them over memory.

Two modes:

- **Question.** Answer it directly, first sentence first. Back every claim with a file and line, a command you ran, or a docs page. If you're guessing, say so.
- **Review.** You get a scope: a diff (`git diff <base>...HEAD -- <paths>`), files, or a page. Review only that scope and what it touches. Prove every finding: a build that fails, a repro you ran, a docs page that says otherwise. What you couldn't reproduce goes under "Suspected". Hand back a two-sentence verdict; findings ranked by how much they'd stop an expert in your area adopting the code, each with its proof, the idiomatic version and the file to fix; then "Suspected" and "Revisit".

Rules:

- Read only unless the task says to fix. Never commit, push, open PRs or deploy.
- Give every server you start its own port and stop it before you finish. Check exit codes.
- Code a framework or CLI already provides (Next.js, Fumadocs, shadcn, Wrangler) is a finding when it's hand-written.
- Ignore what `npm run lint` already reports.

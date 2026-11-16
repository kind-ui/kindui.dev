# Skills

Skills for working on kindui.dev. Each one is a folder with a `SKILL.md` in plain Markdown, so it works in any agent harness. Adapted from Apache-2.0 and MIT work; see `THIRD_PARTY_NOTICES.md` at the repo root.

| Skill | Use it when | What it does |
| --- | --- | --- |
| [`write-code`](write-code/SKILL.md) | You write or change code anywhere in the repo. | Starts from the file that already does the same job, writes the code, runs the checks the change reaches and rereads the diff cold. |
| [`unslop`](unslop/SKILL.md) | You're finishing a change, or a file reads as generated. | Removes comments that restate the code, filler JSDoc, checks for impossible cases, one-caller helpers and vague names. Behavior stays the same. |
| [`fumadocs`](fumadocs/SKILL.md) | You change the `/docs` app. | Where pages and the docs shell live, which Fumadocs CLIs to use, static export limits and upgrades. |
| [`write-docs`](write-docs/SKILL.md) | You write or review a docs page. | The site's voice: open with the point, explain one thing at a time, check every claim against its source. |
| [`documentation-writer`](documentation-writer/SKILL.md) | You plan a new kind of page. | Installed from github/awesome-copilot (`skills-lock.json`). Picks the Diátaxis type (tutorial, how-to, reference, explanation) and outlines the page. |
| [`expert-review`](expert-review/SKILL.md) | Before every push. | Picks the experts the diff reaches (`node scripts/expert-scope.mjs`), runs them in parallel and hands back one table of findings. |

The chain: write with `write-code`, finish with `unslop`, then run `expert-review` before you push. For docs, write with `write-docs` and `fumadocs`.

The skills live in `.agents/skills/`, where Codex, Cursor, Gemini CLI and GitHub Copilot find them; `.claude/skills` links to the same folder for Claude Code. In a harness that doesn't load skills, ask your agent to read the skill's `SKILL.md` and follow it.

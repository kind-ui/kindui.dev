import type { Highlight, Token } from "@kind-ui/agent-ui/core";

const languages = { ts: "typescript", tsx: "tsx", vue: "vue", svelte: "svelte" } as const;

let highlighter: Promise<import("shiki/core").HighlighterCore> | undefined;

async function load() {
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
  ]);
  return createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [import("@shikijs/themes/github-light"), import("@shikijs/themes/github-dark")],
    langs: [
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/vue"),
      import("@shikijs/langs/svelte"),
    ],
  });
}

/** Shiki's GitHub themes as `light-dark()` colors, so tokens follow the page's color scheme. */
export const highlight: Highlight = async (code, language) => {
  const lang = languages[language as keyof typeof languages];
  if (!lang) return [{ content: code }];
  highlighter ??= load();
  const lines = (await highlighter).codeToTokensWithThemes(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
  });
  return lines.flatMap((line, index): Token[] => [
    ...(index > 0 ? [{ content: "\n" }] : []),
    ...line.map(({ content, variants }) => ({
      content,
      color: `light-dark(${variants.light?.color}, ${variants.dark?.color})`,
    })),
  ]);
};

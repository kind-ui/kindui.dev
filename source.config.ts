import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import rehypeRaw from "rehype-raw";
import libraries from "./libraries.json" with { type: "json" };

export const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: metaSchema },
});

// Each library's docs app is a workspace with its own MDX options; its `docs` collection has the same
// shape as ours, which the generated workspace types assume (https://www.fumadocs.dev/docs/mdx/workspace).
export default defineConfig({
  // An included Markdown file, like a library's CHANGELOG.md, can hold inline HTML, which MDX can't compile
  // without rehype-raw (https://www.fumadocs.dev/docs/mdx/include).
  mdxOptions: {
    rehypePlugins: (plugins) => [
      [
        rehypeRaw,
        {
          passThrough: [
            "mdxFlowExpression",
            "mdxJsxFlowElement",
            "mdxJsxTextElement",
            "mdxTextExpression",
            "mdxjsEsm",
          ],
        },
      ],
      ...plugins,
    ],
  },
  workspaces: {
    "agent-ui": {
      dir: `.libraries/agent-ui/source/${libraries["agent-ui"].docs}`,
      config: await import("./libraries/agent-ui.source.config"),
    },
  },
});

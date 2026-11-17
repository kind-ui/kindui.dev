import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: metaSchema },
});

// Each library's docs app is a workspace with its own MDX options; its `docs` collection has the same
// shape as ours, which the generated workspace types assume (https://www.fumadocs.dev/docs/mdx/workspace).
export default defineConfig({
  workspaces: {
    "agent-ui": {
      dir: ".libraries/agent-ui/source/apps/docs",
      config: await import("./libraries/agent-ui.source.config"),
    },
  },
});

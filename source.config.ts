import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import libraries from "./libraries.json" with { type: "json" };

export const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: metaSchema },
});

// For Markdown files brought in with `<include>`, like a library's CHANGELOG.md: drop their `#` heading, since the
// page title is the page's h1, and show text like `<name>`, which Markdown reads as HTML that MDX can't compile, as
// written (https://www.fumadocs.dev/docs/mdx/include).
function remarkIncludedMarkdown() {
  type Node = { type: string; depth?: number; children?: Node[] };
  const visit = (node: Node) => {
    if (node.type === "html") node.type = "text";
    if (!node.children) return;
    node.children = node.children.filter((child) => !(child.type === "heading" && child.depth === 1));
    node.children.forEach(visit);
  };
  return visit;
}

// Each library's docs app is a workspace with its own MDX options; its `docs` collection has the same
// shape as ours, which the generated workspace types assume (https://www.fumadocs.dev/docs/mdx/workspace).
export default defineConfig({
  mdxOptions: {
    // Before the preset, so the dropped heading stays out of the table of contents.
    remarkPlugins: (plugins) => [remarkIncludedMarkdown, ...plugins],
  },
  workspaces: {
    "agent-ui": {
      dir: `.libraries/agent-ui/source/${libraries["agent-ui"].docs}`,
      config: await import("./libraries/agent-ui.source.config"),
    },
  },
});

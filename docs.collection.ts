import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/config";

// The root and every library workspace share this collection. A workspace can't import it from `source.config.ts`,
// which awaits the workspace's config, so the bundled config would never settle.
export const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: metaSchema },
});

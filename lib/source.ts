import { llms, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { docsRoute, origin } from "./shared";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  // Each library gets its own `llms.txt`; the overview root shares `/docs` with the site's.
  section: (folder) => (folder.root && folder.index?.url !== "/docs" ? { collapse: true } : false),
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
  // Absolute, because llms.txt is read outside the site; Markdown lives under `/llms.mdx`.
  renderUrl: (item) => `${origin}${/^\/.*\.(md|txt)$/.test(item.url) ? `/llms.mdx${item.url}` : item.url}`,
});

import * as AgentUi from "collections/agent-ui/server";
import * as Charts from "collections/charts/server";
import { docs } from "collections/server";
import { llms, loader, update } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { docsRoute, origin } from "./shared";

// A library's docs mount under `/docs/<library>/` as a root folder with this site's sidebar description and icon.
function mountLibrary(name: string, collection: typeof AgentUi.docs, description: string, icon: string) {
  return update(collection.toFumadocsSource({ baseDir: name }))
    .meta((file) =>
      file.path === `${name}/meta.json`
        ? { ...file, data: { ...file.data, description, icon, root: true } }
        : file,
    )
    .build();
}

export const source = loader(
  {
    root: docs.toFumadocsSource(),
    "agent-ui": mountLibrary("agent-ui", AgentUi.docs, "AI interface components", "MessagesSquare"),
    charts: mountLibrary("charts", Charts.docs, "Interactive charts", "ChartColumn"),
  },
  { baseUrl: docsRoute, plugins: [lucideIconsPlugin()] },
);

export const docsLlms = llms(source, {
  // Each library gets its own `llms.txt`; the overview root shares `/docs` with the site's.
  section: (folder) => (folder.root && folder.index?.url !== "/docs" ? { collapse: true } : false),
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
  // Absolute, because llms.txt is read outside the site; Markdown lives under `/llms.mdx`.
  renderUrl: (item) => `${origin}${/^\/.*\.(md|txt)$/.test(item.url) ? `/llms.mdx${item.url}` : item.url}`,
});

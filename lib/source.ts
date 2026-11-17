import * as AgentUi from "collections/agent-ui/server";
import { docs } from "collections/server";
import { llms, loader, update } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { docsRoute, origin } from "./shared";

// A library's docs mount under `/docs/<library>/` as a root folder with this site's sidebar title and icon.
const agentUi = update(AgentUi.docs.toFumadocsSource({ baseDir: "agent-ui" }))
  .meta((file) =>
    file.path === "agent-ui/meta.json"
      ? {
          ...file,
          data: { ...file.data, description: "AI interface components", icon: "MessagesSquare", root: true },
        }
      : file,
  )
  .build();

export const source = loader(
  { root: docs.toFumadocsSource(), "agent-ui": agentUi },
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

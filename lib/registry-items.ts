import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type RegistryItem = { name: string; meta?: { layer?: string } };

// Until Charts is pinned in libraries.json: the items in kind-ui/charts' registry/catalog.mjs.
const unpinnedChartsItems = [
  "area-chart",
  "bar-chart",
  "box-plot-chart",
  "combo-chart",
  "heatmap-chart",
  "histogram-chart",
  "line-chart",
  "pie-chart",
  "radar-chart",
  "radial-chart",
  "sankey-chart",
  "scatter-chart",
  "waterfall-chart",
  "activity-rings",
];

const registryFile = (library: string) =>
  path.join(process.cwd(), ".libraries", library, "r", "registry.json");

function registryItems(library: string) {
  const { items }: { items: RegistryItem[] } = JSON.parse(readFileSync(registryFile(library), "utf8"));
  return items
    .filter((item) => item.meta?.layer === "react" && !item.name.startsWith("internal-"))
    .map((item) => item.name);
}

export function installItems() {
  return {
    agent: registryItems("agent-ui"),
    charts: existsSync(registryFile("charts")) ? registryItems("charts") : unpinnedChartsItems,
  };
}

export type InstallItems = ReturnType<typeof installItems>;

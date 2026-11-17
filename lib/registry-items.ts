import { readFileSync } from "node:fs";
import path from "node:path";

type RegistryItem = { name: string; type: string; meta?: { layer?: string } };

// Agent UI's React components are its `react` layer; Charts' are its `registry:component` items.
const isReactComponent = (item: RegistryItem) =>
  (item.meta?.layer === "react" || item.type === "registry:component") && !item.name.startsWith("internal-");

function registryItems(library: string) {
  const file = path.join(process.cwd(), ".libraries", library, "r", "registry.json");
  const { items }: { items: RegistryItem[] } = JSON.parse(readFileSync(file, "utf8"));
  return items.filter(isReactComponent).map((item) => item.name);
}

export function installItems() {
  return { agent: registryItems("agent-ui"), charts: registryItems("charts") };
}

export type InstallItems = ReturnType<typeof installItems>;

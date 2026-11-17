#!/usr/bin/env node
// Serves every pinned library's registry from /r/: copies their item files and writes one merged catalog.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { librariesDir } from "./fetch-libraries.mjs";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/r");

/** One `kind-ui` catalog with every library's items, in `libraries.json` order. */
export function mergeRegistries(registries) {
  const owners = new Map();
  for (const [library, registry] of Object.entries(registries)) {
    for (const item of registry.items) {
      if (owners.has(item.name)) {
        throw new Error(`registry item "${item.name}" is in both ${owners.get(item.name)} and ${library}`);
      }
      owners.set(item.name, library);
    }
  }
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "kind-ui",
    homepage: "https://kindui.dev",
    items: Object.values(registries).flatMap((registry) => registry.items),
  };
}

export function assembleRegistry() {
  const libraries = Object.keys(JSON.parse(readFileSync(path.join(root, "libraries.json"), "utf8")));
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const registries = {};
  for (const library of libraries) {
    const registryDir = path.join(librariesDir, library, "r");
    registries[library] = JSON.parse(readFileSync(path.join(registryDir, "registry.json"), "utf8"));
    for (const file of readdirSync(registryDir)) {
      if (file !== "registry.json") cpSync(path.join(registryDir, file), path.join(outDir, file));
    }
  }
  writeFileSync(
    path.join(outDir, "registry.json"),
    `${JSON.stringify(mergeRegistries(registries), null, 2)}\n`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) assembleRegistry();

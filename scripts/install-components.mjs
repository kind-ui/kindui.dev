#!/usr/bin/env node
// Installs every React item of each pinned library's registry into components/ui with the shadcn CLI, the way a
// user would. shadcn also installs the items' npm dependencies with caret ranges, so the exact pins are restored.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { librariesDir } from "./fetch-libraries.mjs";

const root = path.resolve(import.meta.dirname, "..");
const SHADCN = "shadcn@4.23.0";

const reactItems = (registry) =>
  registry.items
    .filter((item) => item.meta?.layer === "react" && !item.name.startsWith("internal-"))
    .map((item) => item.name);

const libraries = JSON.parse(readFileSync(path.join(root, "libraries.json"), "utf8"));
const files = Object.keys(libraries).flatMap((name) => {
  const registryDir = path.join(librariesDir, name, "r");
  const registry = JSON.parse(readFileSync(path.join(registryDir, "registry.json"), "utf8"));
  return reactItems(registry).map((item) => path.relative(root, path.join(registryDir, `${item}.json`)));
});

const pinned = ["package.json", "package-lock.json"].map((file) => [
  file,
  readFileSync(path.join(root, file)),
]);
execFileSync("npx", ["--yes", SHADCN, "add", "--yes", "--overwrite", "--silent", ...files], {
  cwd: root,
  stdio: "inherit",
});
for (const [file, contents] of pinned) writeFileSync(path.join(root, file), contents);
// shadcn rewrites the stylesheet named in components.json without its trailing newline.
execFileSync("npx", ["biome", "format", "--write", "app/(docs)/global.css"], { cwd: root, stdio: "inherit" });
execFileSync("npm", ["install", "--no-audit", "--no-fund"], { cwd: root, stdio: "inherit" });

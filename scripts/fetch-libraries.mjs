#!/usr/bin/env node
// Checks out each library's docs at its pinned release tag and extracts that release's registry (spec "Phase 2").
// KINDUI_LIBRARY_<NAME>=<checkout> copies an unreleased local checkout instead, with its built registry.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
export const librariesDir = path.join(root, ".libraries");

export const tagFor = ({ tag, version }) => tag.replace("{version}", version);

export const parseSha256 = (line) => line.trim().split(/\s+/)[0];

export const overrideFor = (name, env = process.env) =>
  env[`KINDUI_LIBRARY_${name.toUpperCase().replaceAll("-", "_")}`];

export function checkInstalled(name, packageName, pinned, installed) {
  if (installed !== pinned) {
    throw new Error(
      `${name} is pinned to ${pinned} but ${packageName} ${installed} is installed; run npm install ${packageName}@${pinned}`,
    );
  }
}

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

function checkout(library, target) {
  const git = (args, cwd) => execFileSync("git", args, { cwd, stdio: ["ignore", "ignore", "inherit"] });
  const url = `https://github.com/${library.repo}.git`;
  git(
    [
      "clone",
      "--quiet",
      "--depth",
      "1",
      "--filter=blob:none",
      "--sparse",
      "--branch",
      tagFor(library),
      url,
      target,
    ],
    root,
  );
  git(["sparse-checkout", "set", "--no-cone", ...library.paths], target);
}

async function extractRegistry(name, library, target) {
  const asset = `${name}-site-${library.version}.tar.gz`;
  const url = `https://github.com/${library.repo}/releases/download/${encodeURIComponent(tagFor(library))}/${asset}`;
  const [archive, sum] = await Promise.all([download(url), download(`${url}.sha256`)]);
  const expected = parseSha256(sum.toString());
  const actual = createHash("sha256").update(archive).digest("hex");
  if (actual !== expected) throw new Error(`${asset}: sha256 is ${actual}, the release says ${expected}`);
  const file = path.join(tmpdir(), asset);
  writeFileSync(file, archive);
  execFileSync("tar", ["-xzf", file, "-C", target, "r"]);
  rmSync(file);
}

function copyLocal(library, local, dir) {
  for (const entry of library.paths) {
    cpSync(path.join(local, entry), path.join(dir, "source", entry), { recursive: true });
  }
  cpSync(path.join(local, "artifacts/registry/r"), path.join(dir, "r"), { recursive: true });
}

export async function fetchLibraries() {
  const libraries = JSON.parse(readFileSync(path.join(root, "libraries.json"), "utf8"));
  for (const [name, library] of Object.entries(libraries)) {
    const dir = path.join(librariesDir, name);
    const local = overrideFor(name);
    if (local) {
      rmSync(dir, { recursive: true, force: true });
      copyLocal(library, path.resolve(local), dir);
      console.log(`${name}: copied ${local}`);
      continue;
    }
    const installed = JSON.parse(
      readFileSync(path.join(root, "node_modules", library.package, "package.json"), "utf8"),
    ).version;
    checkInstalled(name, library.package, library.version, installed);
    const stamp = path.join(dir, ".tag");
    const tag = tagFor(library);
    if (existsSync(stamp) && readFileSync(stamp, "utf8") === tag) continue;
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    checkout(library, path.join(dir, "source"));
    await extractRegistry(name, library, dir);
    writeFileSync(stamp, tag);
    console.log(`${name}: ${tag}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await fetchLibraries();

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("Renovate's libraries.json matcher finds every library's repo and version", () => {
  const [matchString] = JSON.parse(read("renovate.json")).customManagers[0].matchStrings;
  const libraries = JSON.parse(read("libraries.json"));
  const matches = [...read("libraries.json").matchAll(new RegExp(matchString, "g"))].map(({ groups }) => ({
    ...groups,
  }));
  assert.deepEqual(
    matches,
    Object.values(libraries).map(({ repo, version }) => ({ depName: repo, currentValue: version })),
  );
});

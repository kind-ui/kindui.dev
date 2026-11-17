import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeRegistries } from "./assemble-registry.mjs";

test("mergeRegistries lists every library's items under the kind-ui registry", () => {
  const merged = mergeRegistries({
    "agent-ui": { name: "agent-ui", homepage: "https://kindui.dev/docs/agent-ui", items: [{ name: "step" }] },
    charts: { name: "charts", items: [{ name: "bar-chart" }] },
  });
  assert.equal(merged.name, "kind-ui");
  assert.equal(merged.homepage, "https://kindui.dev");
  assert.deepEqual(
    merged.items.map((item) => item.name),
    ["step", "bar-chart"],
  );
});

test("mergeRegistries names the item and both libraries on a duplicate", () => {
  assert.throws(
    () =>
      mergeRegistries({ "agent-ui": { items: [{ name: "chart" }] }, charts: { items: [{ name: "chart" }] } }),
    /"chart" is in both agent-ui and charts/,
  );
});

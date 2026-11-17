import assert from "node:assert/strict";
import { test } from "node:test";
import { checkInstalled, overrideFor, parseSha256, tagFor } from "./fetch-libraries.mjs";

test("tagFor fills the version into the tag format", () => {
  assert.equal(tagFor({ tag: "v{version}", version: "0.3.1" }), "v0.3.1");
  assert.equal(tagFor({ tag: "@kind-ui/charts@{version}", version: "0.6.0" }), "@kind-ui/charts@0.6.0");
});

test("parseSha256 reads the hash from a sha256sum line", () => {
  assert.equal(parseSha256("abc123  agent-ui-site-0.3.1.tar.gz\n"), "abc123");
});

test("checkInstalled names both versions when the package differs from the pin", () => {
  assert.doesNotThrow(() => checkInstalled("agent-ui", "@kind-ui/agent-ui", "0.3.1", "0.3.1"));
  assert.throws(
    () => checkInstalled("agent-ui", "@kind-ui/agent-ui", "0.3.1", "0.3.0"),
    /agent-ui is pinned to 0\.3\.1 but @kind-ui\/agent-ui 0\.3\.0 is installed/,
  );
});

test("overrideFor reads KINDUI_LIBRARY_<NAME>", () => {
  assert.equal(overrideFor("agent-ui", { KINDUI_LIBRARY_AGENT_UI: "/src/agent-ui" }), "/src/agent-ui");
  assert.equal(overrideFor("agent-ui", {}), undefined);
});

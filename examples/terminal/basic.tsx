"use client";
import { Terminal } from "@/components/ui/terminal";

const ESC = "\x1b";

const output = [
  `${ESC}[1m> app@1.0.0 test${ESC}[0m`,
  `${ESC}[32m✓${ESC}[0m format.test.ts ${ESC}[90m(12 tests)${ESC}[0m`,
  `${ESC}[32m✓${ESC}[0m parse.test.ts ${ESC}[90m(9 tests)${ESC}[0m`,
  `${ESC}[31m✗${ESC}[0m cache.test.ts ${ESC}[90m(1 failed)${ESC}[0m`,
  `  ${ESC}[31mExpected${ESC}[0m ${ESC}[33m"hit"${ESC}[0m, received ${ESC}[36m"miss"${ESC}[0m`,
  "",
  `${ESC}[1;31mTests: 1 failed${ESC}[0m, ${ESC}[1;32m21 passed${ESC}[0m, 22 total`,
].join("\n");

export default function TerminalExample() {
  return (
    <Terminal
      command="npm test"
      output={output}
      exitCode={1}
      durationSeconds={4.2}
      defaultOpen
      className="w-full max-w-xl"
    />
  );
}

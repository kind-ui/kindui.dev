"use client";
import type { TestSuite } from "@kind-ui/agent-ui";
import { TestResults } from "@/components/ui/test-results";

const suites: TestSuite[] = [
  {
    id: "auth",
    name: "auth.test.ts",
    tests: [
      { id: "login", name: "logs in with a password", status: "pass", durationMs: 42 },
      {
        id: "lockout",
        name: "locks the account after five attempts",
        status: "fail",
        durationMs: 18,
        error: {
          message: "AssertionError: expected 423, got 401",
          stack: `AssertionError: expected 423, got 401
    at Context.<anonymous> (/app/test/auth.test.ts:58:31)
    at callFn (/app/node_modules/mocha/lib/runnable.js:366:21)
    at processImmediate (node:internal/timers:483:21)`,
        },
      },
      { id: "sso", name: "signs in with SSO", status: "skip" },
    ],
  },
  {
    id: "cart",
    name: "cart.test.ts",
    tests: [
      { id: "add", name: "adds an item", status: "pass", durationMs: 7 },
      { id: "total", name: "totals the items", status: "pass", durationMs: 3 },
    ],
  },
];

export default function TestResultsExample() {
  return <TestResults suites={suites} defaultOpen className="w-full max-w-xl" />;
}

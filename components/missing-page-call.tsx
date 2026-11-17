"use client";
import type { ToolCall } from "@kind-ui/agent-ui";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Tool } from "@/components/ui/tool";

const error = { message: "404: nothing lives here. It may have moved, or never existed." };

/** A tool call that looks for the page the visitor asked for, and comes back empty. */
export function MissingPageCall() {
  const reduced = useReducedMotion();
  const [path, setPath] = useState<string>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
    const t = window.setTimeout(() => setFailed(true), reduced ? 0 : 1400);
    return () => window.clearTimeout(t);
  }, [reduced]);

  // Tool re-syncs whenever `call` is a new object, so a fresh one each render never settles.
  const call = useMemo(
    () =>
      ({
        toolCallId: "fetch-page",
        name: "fetch_page",
        dynamic: false,
        input: { state: path ? "ready" : "streaming", value: path ? { path } : {} },
        outcome: failed ? "error" : undefined,
      }) satisfies ToolCall,
    [path, failed],
  );

  return <Tool defaultOpen autoOpen="never" call={call} error={error} />;
}

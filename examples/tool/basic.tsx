"use client";

import { fromUIMessagePart } from "@kind-ui/agent-ui/adapters/ai-sdk";
import { useState } from "react";
import { Tool } from "@/components/ui/tool";

const parts = [
  {
    type: "tool-search_docs",
    toolCallId: "call_1",
    state: "output-available",
    input: { query: "retry with backoff" },
    output: { hits: 3, top: "guides/retries.md" },
  },
  {
    type: "tool-run_tests",
    toolCallId: "call_2",
    state: "input-available",
    input: { filter: "client" },
  },
  {
    type: "tool-delete_branch",
    toolCallId: "call_3",
    state: "approval-requested",
    input: { branch: "old-retry" },
    approval: { id: "approval_1" },
  },
  {
    type: "tool-fetch_url",
    toolCallId: "call_4",
    state: "output-error",
    input: { url: "https://example.com/status" },
    errorText: "Request timed out after 30 s.",
  },
] as const;

// How long each finished call took, which the host knows from its own timing.
const durations: Record<string, number> = { call_1: 1.2, call_4: 30 };

export default function ToolExample() {
  const [approved, setApproved] = useState<boolean>();
  return (
    <div className="flex flex-col gap-1">
      {parts.map((part, index) => {
        const answered =
          part.state === "approval-requested" && approved !== undefined
            ? { ...part, state: "approval-responded" as const, approval: { id: part.approval.id, approved } }
            : part;
        const mapped = fromUIMessagePart(answered, { messageId: "message_1", index });
        if (mapped?.type !== "step" || mapped.step.kind !== "tool") return null;
        const { step } = mapped;
        return (
          <Tool
            key={step.id}
            call={step.call}
            error={step.error}
            durationSeconds={durations[part.toolCallId]}
            onApprove={() => setApproved(true)}
            onDeny={() => setApproved(false)}
          />
        );
      })}
    </div>
  );
}

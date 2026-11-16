"use client";
import { useState } from "react";
import { KindToolbar, KindToolbarButton } from "@/components/ui/internal/toolbar";
import {
  Message,
  MessageBranch,
  MessageBranchLabel,
  MessageBranchNext,
  MessageBranchPrevious,
  MessageContent,
  MessageCopy,
  MessageEdit,
  MessageEditor,
  MessageRegenerate,
  MessageToolbar,
} from "@/components/ui/message";

const replies = [
  "Retry with exponential backoff, and cap the number of attempts.",
  "Queue the request and retry it from a background job.",
  "Fail fast and let the caller decide whether to retry.",
];

export default function MessageExample() {
  const [question, setQuestion] = useState("How should the client handle a flaky upstream?");
  const [branches, setBranches] = useState({ index: 0, count: 2 });
  const reply = replies[branches.index] as string;

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Message
        aria-label="User message"
        messageRole="user"
        text={question}
        onEdit={(text) => setQuestion(text)}
      >
        <MessageContent>{question}</MessageContent>
        <MessageEditor />
        <MessageToolbar>
          <KindToolbar aria-label="Message actions">
            <MessageCopy>
              <KindToolbarButton aria-label="Copy" />
            </MessageCopy>
            <MessageEdit>
              <KindToolbarButton aria-label="Edit" />
            </MessageEdit>
          </KindToolbar>
        </MessageToolbar>
      </Message>
      <Message
        aria-label="Assistant message"
        messageRole="assistant"
        text={reply}
        branchIndex={branches.index}
        branchCount={branches.count}
        onBranchChange={(index) => setBranches({ ...branches, index })}
        onRegenerate={() => {
          const count = Math.min(branches.count + 1, replies.length);
          setBranches({ index: count - 1, count });
        }}
      >
        <MessageContent>{reply}</MessageContent>
        <MessageToolbar>
          <MessageBranch>
            <MessageBranchPrevious />
            <MessageBranchLabel />
            <MessageBranchNext />
          </MessageBranch>
          <KindToolbar aria-label="Message actions">
            <MessageCopy>
              <KindToolbarButton aria-label="Copy" />
            </MessageCopy>
            <MessageRegenerate>
              <KindToolbarButton aria-label="Regenerate" />
            </MessageRegenerate>
          </KindToolbar>
        </MessageToolbar>
      </Message>
    </div>
  );
}

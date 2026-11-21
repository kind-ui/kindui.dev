"use client";

import { createConversationController } from "@kind-ui/agent-ui/core";
import { memo, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationMarks,
  ConversationRow,
  ConversationViewport,
} from "@/components/ui/conversation";
import { ConversationSearch } from "@/components/ui/conversation-search";
import { Markdown } from "@/components/ui/markdown";

const messages = [
  { id: "m1", role: "user", text: "The nightly **billing** export failed again. Can you take a look?" },
  { id: "m2", role: "assistant", text: "Sure. Which job is it, and when did it last succeed?" },
  { id: "m3", role: "user", text: "`billing-export`. It last succeeded on Tuesday." },
  {
    id: "m4",
    role: "assistant",
    text: "Since Wednesday, every run has stopped after 30 seconds waiting on the reports service:\n\n- its median response time went from 4 to 41 seconds\n- it was slow, not down",
  },
  { id: "m5", role: "user", text: "So we just raise the timeout?" },
  {
    id: "m6",
    role: "assistant",
    text: "That gets tonight's run through, but the next slow night fails again. I'd **retry** each page with backoff and alert when a run takes longer than an hour.",
  },
  { id: "m7", role: "user", text: "Do that, and open a pull request against the billing service." },
  {
    id: "m8",
    role: "assistant",
    text: "Done. The pull request adds the retry and the alert, with a test that replays Wednesday's slow responses.",
  },
];

type ChatMessage = (typeof messages)[number];

const Row = memo(function Row({ message, index }: { message: ChatMessage; index: number }) {
  return (
    <ConversationRow value={message.id} index={index}>
      <div
        className={
          message.role === "user"
            ? "ms-auto w-fit max-w-[80%] rounded-2xl bg-[var(--kind-color-hover)] px-3.5 py-2"
            : undefined
        }
      >
        <Markdown source={message.text} />
      </div>
    </ConversationRow>
  );
});

export default function ConversationSearchExample() {
  const [controller] = useState(createConversationController);
  const [marks, setMarks] = useState<readonly number[]>([]);

  return (
    <div className="relative h-[360px] w-full max-w-xl">
      <ConversationSearch
        messages={messages}
        conversation={controller}
        defaultOpen
        defaultQuery="billing"
        onMarksChange={setMarks}
      />
      <Conversation
        aria-label="Conversation"
        messageCount={messages.length}
        controller={controller}
        marks={marks}
        className="h-full rounded-xl border border-[var(--kind-color-border)]"
      >
        <ConversationViewport>
          <ConversationContent>
            {messages.map((message, index) => (
              <Row key={message.id} message={message} index={index} />
            ))}
          </ConversationContent>
        </ConversationViewport>
        <ConversationMarks />
      </Conversation>
    </div>
  );
}

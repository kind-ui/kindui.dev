"use client";
import {
  Conversation,
  ConversationContent,
  ConversationJump,
  ConversationRow,
  ConversationViewport,
} from "@/components/ui/conversation";

const messages = [
  { id: "m1", role: "user", text: "The nightly export failed again. Can you take a look?" },
  { id: "m2", role: "assistant", text: "Sure. Which job is it, and when did it last succeed?" },
  { id: "m3", role: "user", text: "billing-export. It last succeeded on Tuesday." },
  {
    id: "m4",
    role: "assistant",
    text: "Since Wednesday, every run has stopped after 30 seconds waiting on the reports service. The service was slow, not down: its median response time went from 4 to 41 seconds.",
  },
  { id: "m5", role: "user", text: "So we just raise the timeout?" },
  {
    id: "m6",
    role: "assistant",
    text: "Raising it would get tonight's run through, but the job would still fail on the next slow night. I'd retry each page with backoff, cap the attempts at five, and alert when a run takes longer than an hour.",
  },
  { id: "m7", role: "user", text: "Do that, and open a pull request." },
  {
    id: "m8",
    role: "assistant",
    text: "Done. The pull request adds the retry and the alert, with a test that replays Wednesday's responses.",
  },
];

export default function ConversationExample() {
  return (
    <Conversation
      aria-label="Conversation"
      messageCount={messages.length}
      className="h-80 w-full max-w-xl rounded-xl border border-[var(--kind-color-border)]"
    >
      <ConversationViewport>
        <ConversationContent>
          {messages.map((message, index) => (
            <ConversationRow key={message.id} value={message.id} index={index}>
              <p
                className={
                  message.role === "user"
                    ? "ms-auto w-fit max-w-[80%] rounded-2xl bg-[var(--kind-color-bubble)] px-3.5 py-2"
                    : undefined
                }
              >
                {message.text}
              </p>
            </ConversationRow>
          ))}
        </ConversationContent>
      </ConversationViewport>
      <ConversationJump />
    </Conversation>
  );
}

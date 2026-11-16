"use client";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationRow,
  ConversationViewport,
} from "@/components/ui/conversation";
import { Markdown } from "@/components/ui/markdown";
import { Message, MessageContent } from "@/components/ui/message";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";
import { OrdersBarChart } from "./charts";
import { Reveal } from "./reveal";

const question = "How did orders do this week?";
const answer = "Orders peaked on **Friday at 121**, then eased off over the weekend.";

export function Together() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setThinking(false);
      setCount(answer.length);
      return;
    }
    if (thinking) {
      const t = setTimeout(() => setThinking(false), 1200);
      return () => clearTimeout(t);
    }
    if (count < answer.length) {
      const t = setTimeout(() => setCount((c) => c + 2), 24);
      return () => clearTimeout(t);
    }
  }, [inView, reduced, thinking, count]);

  const done = !thinking && count >= answer.length;
  return (
    <section aria-labelledby="together-title" className="mx-auto max-w-[1260px] px-5 pt-32 sm:px-9">
      <Reveal>
        <h2
          id="together-title"
          className="text-center text-[clamp(32px,4vw,52px)] leading-[1.1] font-medium tracking-[-0.055em]"
        >
          Use them together.
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-center text-lg leading-snug text-muted-foreground">
          Ask a question, get a chart back. Both libraries share the same colors and type, so they match with no extra styling.
        </p>
      </Reveal>
      <div ref={ref} className="mx-auto mt-14 max-w-[720px] rounded-[32px] border border-border bg-stage p-3 sm:p-4">
        <div className="overflow-hidden rounded-[22px] border border-border bg-background shadow-[var(--home-tile-shadow)]">
          <Conversation aria-label="Conversation" messageCount={2}>
            <ConversationViewport>
              <ConversationContent className="px-4 py-5 sm:px-6">
                <ConversationRow value="question" index={0}>
                  <Message aria-label="User message" messageRole="user" text={question}>
                    <MessageContent>{question}</MessageContent>
                  </Message>
                </ConversationRow>
                <ConversationRow value="answer" index={1}>
                  <Message
                    aria-label="Assistant message"
                    messageRole="assistant"
                    text={answer.slice(0, count)}
                    status={done ? "complete" : "streaming"}
                  >
                    <MessageContent>
                      {thinking ? (
                        <ThinkingIndicator />
                      ) : (
                        <Markdown source={answer.slice(0, count)} streaming={!done} />
                      )}
                      {done && (
                        <motion.div
                          initial={reduced ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-3 rounded-2xl border border-border p-3"
                        >
                          <OrdersBarChart />
                        </motion.div>
                      )}
                    </MessageContent>
                  </Message>
                </ConversationRow>
              </ConversationContent>
            </ConversationViewport>
          </Conversation>
        </div>
      </div>
    </section>
  );
}

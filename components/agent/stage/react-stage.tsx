"use client";
import { Attachments } from "@/components/ui/attachments";
import {
  Composer,
  ComposerAttach,
  ComposerAttachments,
  ComposerInput,
  ComposerSubmit,
} from "@/components/ui/composer";
import {
  Conversation,
  ConversationContent,
  ConversationRow,
  ConversationViewport,
} from "@/components/ui/conversation";
import { Markdown } from "@/components/ui/markdown";
import { Message, MessageContent } from "@/components/ui/message";
import {
  Step,
  StepContent,
  StepIcon,
  StepList,
  StepListItem,
  StepMeta,
  StepTitle,
  StepTrigger,
} from "@/components/ui/step";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";
import { highlight } from "./highlight";
import { attachment, type Frame, question } from "./script";

export function ReactStage({ frame }: { frame: Frame }) {
  return (
    <div className="flex h-full flex-col">
      <Conversation aria-label="Conversation" messageCount={2} className="min-h-0 flex-1">
        <ConversationViewport>
          <ConversationContent className="px-4 py-5 sm:px-6">
            <ConversationRow value="question" index={0}>
              <Message aria-label="User message" messageRole="user" text={question}>
                <Attachments aria-label="Attachments" items={[attachment]} className="ms-auto mb-2 w-fit" />
                <MessageContent>{question}</MessageContent>
              </Message>
            </ConversationRow>
            <ConversationRow value="answer" index={1}>
              <Message
                aria-label="Assistant message"
                messageRole="assistant"
                text={frame.text}
                status={frame.streaming ? "streaming" : "complete"}
              >
                <MessageContent>
                  {frame.thinking && <ThinkingIndicator />}
                  {frame.steps.length > 0 && (
                    <StepList aria-label="Agent steps" className="mb-3">
                      {frame.steps.map((step) => (
                        <Step key={step.id} status={step.status} kind="tool">
                          <StepListItem value={step.id} render={<StepTrigger />}>
                            <StepIcon />
                            <StepTitle>{step.title}</StepTitle>
                            {step.meta && <StepMeta>{step.meta}</StepMeta>}
                          </StepListItem>
                          <StepContent>
                            <p>{step.body}</p>
                          </StepContent>
                        </Step>
                      ))}
                    </StepList>
                  )}
                  {frame.text && (
                    <Markdown source={frame.text} streaming={frame.streaming} highlight={highlight} />
                  )}
                </MessageContent>
              </Message>
            </ConversationRow>
          </ConversationContent>
        </ConversationViewport>
      </Conversation>
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <Composer aria-label="Follow-up message" onSubmit={() => {}}>
          <ComposerAttachments />
          <ComposerInput aria-label="Prompt" placeholder="Ask a follow-up" />
          <ComposerAttach />
          <ComposerSubmit />
        </Composer>
      </div>
    </div>
  );
}

"use client";

import { reasoningPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { Markdown } from "./markdown.js";

const parts = createParts(reasoningPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  content: "div",
});

export type ReasoningProps = ComponentProps<typeof parts.Root>;

/**
 * The model's thinking as a step: "Thinking" while it runs, "Thought for N s" once done, and its `text` as streamed
 * markdown. Any `children` replace the default trigger and content.
 */
export function Reasoning({ children, ...props }: ReasoningProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const ReasoningTrigger = parts.Trigger;
export const ReasoningIcon = parts.Icon;

export type ReasoningTitleProps = ComponentProps<typeof parts.Title>;

/** "Thinking", "Thought for N s" or the `label`, unless you pass children. */
export function ReasoningTitle({ children = ({ title }) => title, ...props }: ReasoningTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type ReasoningContentProps = ComponentProps<typeof parts.Content>;

/** The `text` as markdown, streaming while the step runs, unless you pass children. */
export function ReasoningContent({
  children = ({ text, streaming }) => <Markdown source={text} streaming={streaming} />,
  ...props
}: ReasoningContentProps) {
  return <parts.Content {...props}>{children}</parts.Content>;
}

// Shared, so a streamed chunk doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ReasoningTrigger>
      <ReasoningIcon />
      <ReasoningTitle />
    </ReasoningTrigger>
    <ReasoningContent />
  </>
);

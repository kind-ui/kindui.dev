"use client";

import { actionPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { Markdown } from "./markdown.js";

const parts = createParts(actionPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  content: "div",
  quote: "blockquote",
  result: "div",
});

export type ActionProps = ComponentProps<typeof parts.Root>;

/**
 * An action run on selected text, as a step: its `label`, the `quote` it ran on and its `result` as streamed markdown.
 * Any `children` replace the default trigger and content.
 */
export function Action({ children, ...props }: ActionProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const ActionTrigger = parts.Trigger;
export const ActionIcon = parts.Icon;

export type ActionTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else "Action", unless you pass children. */
export function ActionTitle({ children = ({ title }) => title, ...props }: ActionTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export const ActionContent = parts.Content;

export type ActionQuoteProps = ComponentProps<typeof parts.Quote>;

/** The `quote`, unless you pass children. */
export function ActionQuote({ children = ({ quote }) => quote, ...props }: ActionQuoteProps) {
  return <parts.Quote {...props}>{children}</parts.Quote>;
}

export type ActionResultProps = ComponentProps<typeof parts.Result>;

/** The `result` as markdown, streaming while the action runs, unless you pass children. */
export function ActionResult({
  children = ({ result, streaming }) => <Markdown source={result} streaming={streaming} />,
  ...props
}: ActionResultProps) {
  return <parts.Result {...props}>{children}</parts.Result>;
}

// Shared, so a streamed chunk doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ActionTrigger>
      <ActionIcon />
      <ActionTitle />
    </ActionTrigger>
    <ActionContent>
      <ActionQuote />
      <ActionResult />
    </ActionContent>
  </>
);

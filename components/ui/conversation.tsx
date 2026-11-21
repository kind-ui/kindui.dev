"use client";

import { conversationPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, memo } from "react";

const conversation = createParts(conversationPrimitive, {
  root: "div",
  viewport: "div",
  content: "div",
  row: "div",
  jump: "button",
  empty: "div",
  "empty-title": "div",
  "empty-description": "div",
  skeleton: "div",
  loading: "div",
  error: "div",
  "error-icon": "span",
  "error-text": "div",
  retry: "button",
  marks: "div",
  mark: "span",
});

/** Pass `controller={createConversationController()}` (from `@kind-ui/agent-ui/core`) to scroll it from outside. */
export const Conversation = conversation.Root;
export const ConversationViewport = conversation.Viewport;
/**
 * With `virtualize`, render rows from its state, keyed by index so each measurement stays with its row:
 * `{({ rows }) => rows.map((row) => <ConversationRow key={row.index} value={row.key} index={row.index} …/>)}`.
 */
export const ConversationContent = conversation.Content;
export const ConversationRow = conversation.Row;
/** Its text is the new-message count, written by the primitive; render it without children. */
export const ConversationJump = conversation.Jump;
export const ConversationEmpty = conversation.Empty;
export const ConversationEmptyTitle = conversation.EmptyTitle;
export const ConversationEmptyDescription = conversation.EmptyDescription;

export type ConversationSkeletonProps = ComponentProps<typeof conversation.Skeleton>;

/** Three placeholder rows while `status` is `"loading"`, unless you pass children. Hidden from assistive technology. */
export function ConversationSkeleton({ children = SKELETON_ROWS, ...props }: ConversationSkeletonProps) {
  return <conversation.Skeleton {...props}>{children}</conversation.Skeleton>;
}

export type ConversationLoadingProps = ComponentProps<typeof conversation.Loading>;

/** The visually hidden status read while `status` is `"loading"`: "Loading conversation", unless you pass children. */
export function ConversationLoading({
  children = "Loading conversation",
  ...props
}: ConversationLoadingProps) {
  return <conversation.Loading {...props}>{children}</conversation.Loading>;
}

export type ConversationErrorProps = ComponentProps<typeof conversation.Error>;

/** Shown while `status` is `"error"`: its mark, its words and Retry, unless you pass children. */
export function ConversationError({ children = ERROR_PARTS, ...props }: ConversationErrorProps) {
  return <conversation.Error {...props}>{children}</conversation.Error>;
}

/** The error's status mark. Hidden from assistive technology: the words say it. */
export const ConversationErrorIcon = conversation.ErrorIcon;

export type ConversationErrorTextProps = ComponentProps<typeof conversation.ErrorText>;

/** The `error` option's words, unless you pass children. */
export function ConversationErrorText({
  children = ({ error }) => error,
  ...props
}: ConversationErrorTextProps) {
  return <conversation.ErrorText {...props}>{children}</conversation.ErrorText>;
}

export type ConversationRetryProps = ComponentProps<typeof conversation.Retry>;

/** Calls `onRetry`, shown only while it's set. "Retry", unless you pass children. */
export function ConversationRetry({ children = "Retry", ...props }: ConversationRetryProps) {
  return <conversation.Retry {...props}>{children}</conversation.Retry>;
}

export type ConversationMarksProps = ComponentProps<typeof conversation.Marks>;

/**
 * The track beside the scrollbar that shows each message in `marks`, one `ConversationMark` per 4px step that holds
 * one, unless you pass children. Hidden from assistive technology.
 */
export function ConversationMarks({
  children = ({ marks }) => marks.map((step) => <ConversationMark key={step} value={String(step)} />),
  ...props
}: ConversationMarksProps) {
  return <conversation.Marks {...props}>{children}</conversation.Marks>;
}

/**
 * One mark on the track, at `--kind-conversation-mark` (0 to 1) down it. `value` is its step. Memoized, so a host
 * render that keeps the marks renders none of them.
 */
export const ConversationMark = memo(conversation.Mark);

const SKELETON_ROWS = (
  <>
    <span />
    <span />
    <span />
  </>
);

const ERROR_PARTS = (
  <>
    <ConversationErrorIcon />
    <ConversationErrorText />
    <ConversationRetry />
  </>
);

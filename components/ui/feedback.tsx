"use client";

import { feedbackPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle";
import type { ComponentProps, ReactNode } from "react";
import { KindTextarea } from "./internal/textarea.js";

const parts = createParts(feedbackPrimitive, {
  root: "div",
  thumbs: "div",
  comment: "button",
  thanks: "span",
  content: "div",
  title: "h2",
  "comment-text": "div",
  "comment-send": "button",
  "comment-status": "span",
  "comment-status-icon": "span",
  "comment-error": "span",
});

export type FeedbackProps = ComponentProps<typeof parts.Root>;

/**
 * Thumbs up and down for a response, then "Add a comment" while `onComment` is set, which opens a box to write one.
 * Any `children` replace the default parts.
 */
export function Feedback({ children = DEFAULT_PARTS, ...props }: FeedbackProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export type FeedbackThumbsProps = Omit<ComponentProps<typeof parts.Thumbs>, "children"> & {
  children?: ReactNode;
};

/** UI SDK's Toggle group, holding the thumbs unless you pass children. One Tab stop, with arrow keys between. */
export function FeedbackThumbs({ children = DEFAULT_THUMBS, ...props }: FeedbackThumbsProps) {
  return (
    <parts.Thumbs {...props}>
      {(group) => (
        // Hidden from agents, which use the Feedback's own `rate`.
        <ToggleGroup {...group} data-agent-hidden="">
          {children}
        </ToggleGroup>
      )}
    </parts.Thumbs>
  );
}

export type FeedbackThumbProps = Omit<ComponentProps<typeof Toggle>, "value">;

/** "Good response": a Toggle whose value is `"up"`. */
export function FeedbackUp({
  children = <ToggleIcon data-feedback-icon="up" />,
  ...props
}: FeedbackThumbProps) {
  return (
    <Toggle value="up" aria-label="Good response" {...props}>
      {children}
    </Toggle>
  );
}

/** "Bad response": a Toggle whose value is `"down"`. */
export function FeedbackDown({
  children = <ToggleIcon data-feedback-icon="down" />,
  ...props
}: FeedbackThumbProps) {
  return (
    <Toggle value="down" aria-label="Bad response" {...props}>
      {children}
    </Toggle>
  );
}

export type FeedbackCommentProps = ComponentProps<typeof parts.Comment>;

/** "Add a comment", unless you pass children. Opens the comment box. Rendered once there's a rating and `onComment`. */
export function FeedbackComment({ children = "Add a comment", ...props }: FeedbackCommentProps) {
  return <parts.Comment {...props}>{children}</parts.Comment>;
}

export type FeedbackThanksProps = ComponentProps<typeof parts.Thanks>;

/** "Thanks for your feedback", unless you pass children. Rendered while `commentSent` is set. */
export function FeedbackThanks({ children = "Thanks for your feedback", ...props }: FeedbackThanksProps) {
  return <parts.Thanks {...props}>{children}</parts.Thanks>;
}

export type FeedbackContentProps = ComponentProps<typeof parts.Content>;

/** The comment box: a title, the text, Send and its error, unless you pass children. */
export function FeedbackContent({ children = DEFAULT_CONTENT, ...props }: FeedbackContentProps) {
  return <parts.Content {...props}>{children}</parts.Content>;
}

export type FeedbackTitleProps = ComponentProps<typeof parts.Title>;

/** "Add a comment", unless you pass children. Names the comment box. */
export function FeedbackTitle({ children = "Add a comment", ...props }: FeedbackTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type FeedbackCommentTextProps = ComponentProps<typeof parts.CommentText>;

/** UI SDK's Textarea, unless you pass children, a function that gets its props. */
export function FeedbackCommentText({
  children = (textarea) => (
    <KindTextarea {...textarea} aria-label="Comment" placeholder="What could be better?" rows={3} />
  ),
  ...props
}: FeedbackCommentTextProps) {
  return <parts.CommentText {...props}>{children}</parts.CommentText>;
}

export type FeedbackCommentSendProps = ComponentProps<typeof parts.CommentSend>;

/** Sends the comment through `onComment`. Reads "Send" unless you pass children. */
export function FeedbackCommentSend({ children = "Send", ...props }: FeedbackCommentSendProps) {
  return <parts.CommentSend {...props}>{children}</parts.CommentSend>;
}

export const FeedbackCommentStatusIcon = parts.CommentStatusIcon;

export type FeedbackCommentStatusProps = ComponentProps<typeof parts.CommentStatus>;

/** A running mark and "Sending" while `onComment` is pending, unless you pass children. */
export function FeedbackCommentStatus({ children = DEFAULT_STATUS, ...props }: FeedbackCommentStatusProps) {
  return <parts.CommentStatus {...props}>{children}</parts.CommentStatus>;
}

export type FeedbackCommentErrorProps = ComponentProps<typeof parts.CommentError>;

/** "Comment not sent. Try again." after `onComment` rejects, unless you pass children. */
export function FeedbackCommentError({
  children = "Comment not sent. Try again.",
  ...props
}: FeedbackCommentErrorProps) {
  return <parts.CommentError {...props}>{children}</parts.CommentError>;
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_STATUS = (
  <>
    <FeedbackCommentStatusIcon />
    Sending
  </>
);

const DEFAULT_THUMBS = (
  <>
    <FeedbackUp />
    <FeedbackDown />
  </>
);

const DEFAULT_CONTENT = (
  <>
    <FeedbackTitle />
    <FeedbackCommentText />
    <div data-feedback-actions="">
      <FeedbackCommentStatus />
      <FeedbackCommentError />
      <FeedbackCommentSend />
    </div>
  </>
);

const DEFAULT_PARTS = (
  <>
    <FeedbackThumbs />
    <FeedbackComment />
    <FeedbackThanks />
    <FeedbackContent />
  </>
);

"use client";

import { messagePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const message = createParts(messagePrimitive, {
  root: "div",
  avatar: "div",
  content: "div",
  editor: "textarea",
  toolbar: "div",
  copy: "span",
  regenerate: "span",
  edit: "span",
  branch: "div",
  "branch-previous": "button",
  "branch-label": "span",
  "branch-next": "button",
});

/** Name it with `aria-label`, like "Assistant message". */
export const Message = message.Root;
export const MessageAvatar = message.Avatar;
export const MessageContent = message.Content;
/** Shown in place of the content while a user message is edited. */
export const MessageEditor = message.Editor;
/** Shown once the message settles. Holds the branch switcher and a `KindToolbar` of actions. */
export const MessageToolbar = message.Toolbar;
/** Wrap a `KindToolbarButton` in each action: `<MessageCopy><KindToolbarButton aria-label="Copy" /></MessageCopy>`. */
export const MessageCopy = message.Copy;
export const MessageRegenerate = message.Regenerate;
export const MessageEdit = message.Edit;
export const MessageBranch = message.Branch;
export const MessageBranchPrevious = message.BranchPrevious;
/** Shows the branch, like "2 of 3". */
export function MessageBranchLabel(props: Omit<ComponentProps<typeof message.BranchLabel>, "children">) {
  return <message.BranchLabel {...props}>{({ label }) => label}</message.BranchLabel>;
}
export const MessageBranchNext = message.BranchNext;

"use client";

import { subagentPrimitive } from "@kind-ui/agent-ui/core";
import { Avatar, AvatarImage } from "@ui-sdk/react/avatar";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import { Markdown } from "./markdown.js";

const parts = createParts(subagentPrimitive, {
  root: "div",
  trigger: "button",
  avatar: "span",
  icon: "span",
  title: "span",
  meta: "span",
  content: "div",
  children: "div",
  cancel: "button",
  result: "div",
});

export type SubagentProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  /** The subagent's own steps, like a `StepList` of `Tool`s. */
  children?: ReactNode;
};

/**
 * A subagent's run: its status, name and avatar, then its own steps, a Stop button while `onCancel` is set, and
 * its `result` once complete. Its `children` are the steps; to arrange the parts yourself, use `SubagentRoot`.
 */
export function Subagent({ children, ...props }: SubagentProps) {
  return (
    <parts.Root {...props}>
      {DEFAULT_TRIGGER}
      <SubagentContent>
        <SubagentChildren>{children}</SubagentChildren>
      </SubagentContent>
      {DEFAULT_END}
    </parts.Root>
  );
}

/** The bare root, for arranging the parts yourself. */
export const SubagentRoot = parts.Root;
export const SubagentTrigger = parts.Trigger;
export const SubagentIcon = parts.Icon;
export const SubagentContent = parts.Content;
export const SubagentChildren = parts.Children;

export type SubagentAvatarProps = ComponentProps<typeof parts.Avatar>;

/** A UI SDK Avatar of `avatarSrc`, unless you pass children. Rendered only with an `avatarSrc`. */
export function SubagentAvatar({
  children = ({ src }) => (
    <Avatar>
      <AvatarImage src={src} alt="" />
    </Avatar>
  ),
  ...props
}: SubagentAvatarProps) {
  return <parts.Avatar {...props}>{children}</parts.Avatar>;
}

export type SubagentTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else the `agentName`, unless you pass children. */
export function SubagentTitle({ children = ({ title }) => title, ...props }: SubagentTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type SubagentMetaProps = ComponentProps<typeof parts.Meta>;

/** The status in words, like "Working" or "Done in 12 s", unless you pass children. */
export function SubagentMeta({ children = ({ label }) => label, ...props }: SubagentMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type SubagentCancelProps = ComponentProps<typeof parts.Cancel>;

/** Calls `onCancel`. Reads "Stop" unless you pass children. Rendered only while the subagent can be stopped. */
export function SubagentCancel({ children = DEFAULT_CANCEL, ...props }: SubagentCancelProps) {
  return <parts.Cancel {...props}>{children}</parts.Cancel>;
}

export type SubagentResultProps = ComponentProps<typeof parts.Result>;

/** The `result` as markdown, unless you pass children. Rendered only once the status is `complete`. */
export function SubagentResult({
  children = ({ result }) => (result ? <Markdown source={result} /> : null),
  ...props
}: SubagentResultProps) {
  return <parts.Result {...props}>{children}</parts.Result>;
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_TRIGGER = (
  <SubagentTrigger>
    <SubagentIcon />
    <SubagentAvatar />
    <SubagentTitle />
    <SubagentMeta />
  </SubagentTrigger>
);

const DEFAULT_CANCEL = (
  <>
    <span data-kind-pending-mark="" data-status-mark="" data-status="running" aria-hidden="true" />
    Stop
  </>
);

const DEFAULT_END = (
  <>
    <SubagentCancel />
    <SubagentResult />
  </>
);

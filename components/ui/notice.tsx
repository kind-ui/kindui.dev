"use client";

import { noticePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";

const parts = createParts(noticePrimitive, {
  root: "div",
  icon: "span",
  title: "p",
  description: "div",
  actions: "div",
  dismiss: "button",
});

export type NoticeProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  /** The notice's text. */
  children?: ReactNode;
  /** Buttons that act on the notice, like "Retry". */
  actions?: ReactNode;
};

/**
 * A calm callout: its mark, its `label` as the title, `children` as its text, then `actions` and Dismiss while
 * `onDismiss` is set. To arrange the parts yourself, use `NoticeRoot`.
 */
export function Notice({ children, actions, ...props }: NoticeProps) {
  return (
    <parts.Root {...props}>
      <NoticeIcon />
      <NoticeTitle />
      <NoticeDescription>{children}</NoticeDescription>
      <NoticeActions>{actions}</NoticeActions>
      <NoticeDismiss />
    </parts.Root>
  );
}

/** The bare root, for arranging the parts yourself. */
export const NoticeRoot = parts.Root;
export const NoticeIcon = parts.Icon;
export const NoticeDescription = parts.Description;
export const NoticeActions = parts.Actions;
export const NoticeDismiss = parts.Dismiss;

export type NoticeTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, unless you pass children. Rendered only with a `label`. */
export function NoticeTitle({ children = ({ label }) => label, ...props }: NoticeTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

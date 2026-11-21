"use client";

import { connectionStatusPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(connectionStatusPrimitive, {
  root: "div",
  mark: "span",
  text: "span",
  retry: "button",
});

export type ConnectionStatusProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/**
 * The connection as a pill over the top of a conversation: its mark, its words and Retry while `onRetry` is set.
 * Put it inside the Conversation, beside the viewport. To arrange the parts yourself, use `ConnectionStatusRoot`.
 */
export function ConnectionStatus(props: ConnectionStatusProps) {
  return (
    <parts.Root {...props}>
      <ConnectionStatusMark />
      <ConnectionStatusText />
      <ConnectionStatusRetry />
    </parts.Root>
  );
}

/** The bare root, for arranging the parts yourself. */
export const ConnectionStatusRoot = parts.Root;
export const ConnectionStatusMark = parts.Mark;

export type ConnectionStatusTextProps = ComponentProps<typeof parts.Text>;

/** The state's words, or the countdown while reconnecting, unless you pass children. */
export function ConnectionStatusText({ children = ({ text }) => text, ...props }: ConnectionStatusTextProps) {
  return <parts.Text {...props}>{children}</parts.Text>;
}

export type ConnectionStatusRetryProps = ComponentProps<typeof parts.Retry>;

/** "Retry", unless you pass children. Rendered only with `onRetry`. */
export function ConnectionStatusRetry({
  children = ({ label }) => label,
  ...props
}: ConnectionStatusRetryProps) {
  return <parts.Retry {...props}>{children}</parts.Retry>;
}

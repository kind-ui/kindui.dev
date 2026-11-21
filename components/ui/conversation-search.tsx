"use client";

import { type ConversationSearchInputState, conversationSearchPrimitive } from "@kind-ui/agent-ui/core";
import { Input, InputGroup } from "@ui-sdk/react/input";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(conversationSearchPrimitive, {
  root: "div",
  input: "div",
  count: "span",
  previous: "button",
  next: "button",
  close: "button",
});

export type ConversationSearchProps = ComponentProps<typeof parts.Root>;

/**
 * A find bar over a Conversation's messages: the field with its count, Previous, Next and Close, unless you pass
 * children. Pass `conversation` the Conversation's controller and wire `onMarksChange` to its `marks`.
 */
export function ConversationSearch({ children, ...props }: ConversationSearchProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

const searchField = ({ controller, defaultValue, label, describedBy }: ConversationSearchInputState) => (
  <InputGroup>
    <Input
      type="search"
      controller={controller}
      defaultValue={defaultValue}
      aria-label={label}
      aria-describedby={describedBy}
      placeholder="Find…"
      data-agent-hidden=""
    />
    <ConversationSearchCount />
  </InputGroup>
);

export type ConversationSearchInputProps = ComponentProps<typeof parts.Input>;

/** The search field with its count, unless you pass children. Pass the state to UI SDK Input. */
export function ConversationSearchInput({ children = searchField, ...props }: ConversationSearchInputProps) {
  return <parts.Input {...props}>{children}</parts.Input>;
}

export type ConversationSearchCountProps = ComponentProps<typeof parts.Count>;

/** "3 of 12", or "0 of 0" without a match, while there's a search, unless you pass children. */
export function ConversationSearchCount({
  children = ({ text }) => text,
  ...props
}: ConversationSearchCountProps) {
  return <parts.Count {...props}>{children}</parts.Count>;
}

/** Moves to the previous match. Its icon is drawn in CSS; render it empty. */
export const ConversationSearchPrevious = parts.Previous;
/** Moves to the next match. Its icon is drawn in CSS; render it empty. */
export const ConversationSearchNext = parts.Next;
/** Closes the bar and moves focus back where it was. Its icon is drawn in CSS; render it empty. */
export const ConversationSearchClose = parts.Close;

const DEFAULT_PARTS = (
  <>
    <ConversationSearchInput />
    <ConversationSearchPrevious />
    <ConversationSearchNext />
    <ConversationSearchClose />
  </>
);

"use client";

import { queuePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(queuePrimitive, {
  root: "div",
  section: "div",
  "section-trigger": "button",
  "section-content": "div",
  list: "ul",
  item: "li",
  "item-icon": "span",
  "item-title": "span",
  "item-description": "span",
  "item-remove": "span",
  instructions: "span",
});

export type QueueProps = ComponentProps<typeof parts.Root>;

/**
 * The agent's queue: pending items under Queued, complete ones under Completed, each with a count. Any `children`
 * replace the default sections.
 */
export function Queue({ children, ...props }: QueueProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const QueueSection = parts.Section;
export const QueueSectionContent = parts.SectionContent;
export const QueueItemIcon = parts.ItemIcon;
export const QueueItemRemove = parts.ItemRemove;

export type QueueSectionTriggerProps = ComponentProps<typeof parts.SectionTrigger>;

/** The section's title and count, unless you pass children. */
export function QueueSectionTrigger({
  children = ({ title, count }) => (
    <>
      <span data-title="">{title}</span>
      <span data-count="">{count}</span>
    </>
  ),
  ...props
}: QueueSectionTriggerProps) {
  return <parts.SectionTrigger {...props}>{children}</parts.SectionTrigger>;
}

export type QueueListProps = ComponentProps<typeof parts.List>;

/** An item for each of the section's rows, unless you pass children. */
export function QueueList({
  children = ({ rows }) => rows.map((row) => <QueueItem key={row.item.id} value={row.item.id} />),
  ...props
}: QueueListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type QueueItemProps = ComponentProps<typeof parts.Item>;

/** The item whose `id` is `value`. Without children, it shows the item's mark, title, description and remove button. */
export function QueueItem({ children, ...props }: QueueItemProps) {
  return <parts.Item {...props}>{children !== undefined ? children : DEFAULT_ITEM_PARTS}</parts.Item>;
}

export type QueueItemTitleProps = ComponentProps<typeof parts.ItemTitle>;

/** The item's `title`, unless you pass children. */
export function QueueItemTitle({ children = ({ title }) => title, ...props }: QueueItemTitleProps) {
  return <parts.ItemTitle {...props}>{children}</parts.ItemTitle>;
}

export type QueueItemDescriptionProps = ComponentProps<typeof parts.ItemDescription>;

/** The item's `description`, unless you pass children. Hidden while empty. */
export function QueueItemDescription({
  children = ({ description }) => description,
  ...props
}: QueueItemDescriptionProps) {
  return <parts.ItemDescription {...props}>{children}</parts.ItemDescription>;
}

export type QueueInstructionsProps = ComponentProps<typeof parts.Instructions>;

/** The keys that move and remove items, read with each item and hidden from sight, unless you pass children. */
export function QueueInstructions({ children = ({ text }) => text, ...props }: QueueInstructionsProps) {
  return <parts.Instructions {...props}>{children}</parts.Instructions>;
}

// Shared, so an update to the items doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_PARTS = (
  <>
    <QueueItemIcon />
    <span data-text="">
      <QueueItemTitle />
      <QueueItemDescription />
    </span>
    <QueueItemRemove />
  </>
);

const section = (value: "pending" | "complete") => (
  <QueueSection value={value}>
    <QueueSectionTrigger />
    <QueueSectionContent>
      <QueueList />
    </QueueSectionContent>
  </QueueSection>
);

const DEFAULT_PARTS = (
  <>
    {section("pending")}
    {section("complete")}
    <QueueInstructions />
  </>
);

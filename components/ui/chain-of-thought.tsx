"use client";

import { chainOfThoughtPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(chainOfThoughtPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  meta: "span",
  content: "div",
  list: "ol",
  item: "li",
  "item-trigger": "button",
  "item-icon": "span",
  "item-title": "span",
  "item-meta": "span",
  "item-content": "div",
});

export type ChainOfThoughtProps = ComponentProps<typeof parts.Root>;

/**
 * A summary of the steps an agent took, which expands into them. Any `children` replace the default trigger and
 * content.
 */
export function ChainOfThought({ children, ...props }: ChainOfThoughtProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const ChainOfThoughtTrigger = parts.Trigger;
export const ChainOfThoughtIcon = parts.Icon;
export const ChainOfThoughtContent = parts.Content;
export const ChainOfThoughtItemIcon = parts.ItemIcon;
export const ChainOfThoughtItemContent = parts.ItemContent;

export type ChainOfThoughtTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else "N steps", unless you pass children. */
export function ChainOfThoughtTitle({ children = ({ title }) => title, ...props }: ChainOfThoughtTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type ChainOfThoughtMetaProps = ComponentProps<typeof parts.Meta>;

/** The `durationSeconds`, as "N s", unless you pass children. */
export function ChainOfThoughtMeta({
  children = ({ duration }) => duration,
  ...props
}: ChainOfThoughtMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type ChainOfThoughtListProps = ComponentProps<typeof parts.List>;

/** An item for each step, unless you pass children. */
export function ChainOfThoughtList({
  children = ({ steps }) => steps.map((step) => <ChainOfThoughtItem key={step.id} value={step.id} />),
  ...props
}: ChainOfThoughtListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type ChainOfThoughtItemProps = ComponentProps<typeof parts.Item>;

/** The step whose `id` is `value`. Without children, it shows the step's trigger. */
export function ChainOfThoughtItem({ children, ...props }: ChainOfThoughtItemProps) {
  return <parts.Item {...props}>{children !== undefined ? children : DEFAULT_ITEM_PARTS}</parts.Item>;
}

export type ChainOfThoughtItemTriggerProps = ComponentProps<typeof parts.ItemTrigger>;

/** Opens and closes the step's content. Without children, it shows the step's icon, title and duration. */
export function ChainOfThoughtItemTrigger({
  children = DEFAULT_ITEM_TRIGGER_PARTS,
  ...props
}: ChainOfThoughtItemTriggerProps) {
  return <parts.ItemTrigger {...props}>{children}</parts.ItemTrigger>;
}

export type ChainOfThoughtItemTitleProps = ComponentProps<typeof parts.ItemTitle>;

/** The step's `title`, unless you pass children. */
export function ChainOfThoughtItemTitle({
  children = ({ title }) => title,
  ...props
}: ChainOfThoughtItemTitleProps) {
  return <parts.ItemTitle {...props}>{children}</parts.ItemTitle>;
}

export type ChainOfThoughtItemMetaProps = ComponentProps<typeof parts.ItemMeta>;

/** The step's `durationSeconds`, as "N s", unless you pass children. */
export function ChainOfThoughtItemMeta({
  children = ({ duration }) => duration,
  ...props
}: ChainOfThoughtItemMetaProps) {
  return <parts.ItemMeta {...props}>{children}</parts.ItemMeta>;
}

// Shared, so an update to the steps doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_TRIGGER_PARTS = (
  <>
    <ChainOfThoughtItemIcon />
    <ChainOfThoughtItemTitle />
    <ChainOfThoughtItemMeta />
  </>
);

const DEFAULT_ITEM_PARTS = <ChainOfThoughtItemTrigger />;

const DEFAULT_PARTS = (
  <>
    <ChainOfThoughtTrigger>
      <ChainOfThoughtIcon />
      <ChainOfThoughtTitle />
      <ChainOfThoughtMeta />
    </ChainOfThoughtTrigger>
    <ChainOfThoughtContent>
      <ChainOfThoughtList />
    </ChainOfThoughtContent>
  </>
);

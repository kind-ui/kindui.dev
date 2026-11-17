"use client";

import { taskPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(taskPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  meta: "span",
  content: "div",
  list: "ol",
  item: "li",
  "item-icon": "span",
  "item-title": "span",
  "item-files": "span",
});

export type TaskProps = ComponentProps<typeof parts.Root>;

/**
 * The steps an agent takes for one task, as it takes them, with how many are done. Any `children` replace the
 * default trigger and content.
 */
export function Task({ children, ...props }: TaskProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const TaskTrigger = parts.Trigger;
export const TaskIcon = parts.Icon;
export const TaskContent = parts.Content;
export const TaskItemIcon = parts.ItemIcon;

export type TaskTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else "Task", unless you pass children. */
export function TaskTitle({ children = ({ title }) => title, ...props }: TaskTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type TaskMetaProps = ComponentProps<typeof parts.Meta>;

/** How many items are complete, as "2 of 5", unless you pass children. */
export function TaskMeta({ children = ({ done, total }) => `${done} of ${total}`, ...props }: TaskMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type TaskListProps = ComponentProps<typeof parts.List>;

/** An item for each of the `items`, unless you pass children. */
export function TaskList({
  children = ({ items }) => items.map((item) => <TaskItem key={item.id} value={item.id} />),
  ...props
}: TaskListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type TaskItemProps = ComponentProps<typeof parts.Item>;

/** The item whose `id` is `value`. Without children, it shows the item's mark, title and files. */
export function TaskItem({ children, ...props }: TaskItemProps) {
  return <parts.Item {...props}>{children !== undefined ? children : DEFAULT_ITEM_PARTS}</parts.Item>;
}

export type TaskItemTitleProps = ComponentProps<typeof parts.ItemTitle>;

/** The item's `title`, unless you pass children. */
export function TaskItemTitle({ children = ({ title }) => title, ...props }: TaskItemTitleProps) {
  return <parts.ItemTitle {...props}>{children}</parts.ItemTitle>;
}

export type TaskItemFilesProps = ComponentProps<typeof parts.ItemFiles>;

/** The item's `files`, each as code, unless you pass children. Rendered only while the item has files. */
export function TaskItemFiles({
  // A step can touch one file twice, so files are keyed by place.
  children = ({ files }) => files.map((file, index) => <code key={index}>{file}</code>),
  ...props
}: TaskItemFilesProps) {
  return <parts.ItemFiles {...props}>{children}</parts.ItemFiles>;
}

// Shared, so an update to the items doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_PARTS = (
  <>
    <TaskItemIcon />
    <TaskItemTitle />
    <TaskItemFiles />
  </>
);

const DEFAULT_PARTS = (
  <>
    <TaskTrigger>
      <TaskIcon />
      <TaskTitle />
      <TaskMeta />
    </TaskTrigger>
    <TaskContent>
      <TaskList />
    </TaskContent>
  </>
);

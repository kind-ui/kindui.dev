"use client";

import { selectionPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import { KindToolbar, KindToolbarButton } from "./internal/toolbar.js";

const parts = createParts(selectionPrimitive, {
  root: "div",
  content: "div",
  toolbar: "div",
  item: "span",
});

export type SelectionProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  children?: ReactNode;
};

/**
 * Wraps a reply so selecting text in it shows a toolbar of `actions` above the selection. The `children` are the reply.
 */
export function Selection({ children, ...props }: SelectionProps) {
  return (
    <parts.Root {...props}>
      <SelectionContent>{children}</SelectionContent>
      <SelectionToolbar />
    </parts.Root>
  );
}

/** The bare root, for arranging `SelectionContent` and `SelectionToolbar` yourself. */
export const SelectionRoot = parts.Root;

/** Holds the text a person selects. Put `SelectionToolbar` right after it. */
export const SelectionContent = parts.Content;

export type SelectionToolbarProps = ComponentProps<typeof parts.Toolbar>;

/** Shown above the selection, with one `SelectionItem` per action unless you pass children. */
export function SelectionToolbar({
  children = ({ label, actions }) => (
    <KindToolbar aria-label={label}>
      {actions.map((action) => (
        <SelectionItem key={action.id} value={action.id} />
      ))}
    </KindToolbar>
  ),
  ...props
}: SelectionToolbarProps) {
  return <parts.Toolbar {...props}>{children}</parts.Toolbar>;
}

export type SelectionItemProps = ComponentProps<typeof parts.Item>;

/** An action, whose `value` is its `id`. Wrap a `KindToolbarButton`, or leave it empty for one with the action's label. */
export function SelectionItem({
  children = ({ label, description, canRun }) => (
    <KindToolbarButton disabled={!canRun} title={description}>
      {label}
    </KindToolbarButton>
  ),
  ...props
}: SelectionItemProps) {
  return <parts.Item {...props}>{children}</parts.Item>;
}

"use client";

import { fileTreePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { TreeItemData } from "@ui-sdk/react/tree";
import { type ComponentProps, memo, type ReactNode } from "react";
import {
  KindTree,
  KindTreeGroup,
  KindTreeItem,
  KindTreeItemIndicator,
  KindTreeItemLabel,
} from "./internal/tree.js";

const parts = createParts(fileTreePrimitive, {
  root: "div",
  item: "span",
  counts: "span",
  badge: "span",
});

// Lucide "chevron-right", see THIRD_PARTY_NOTICES.md.
const CHEVRON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type FileTreeProps = Omit<ComponentProps<typeof parts.Root>, "children"> & { children?: ReactNode };

/**
 * Changed files as a folder tree: each file shows its change as a badge and its added and removed lines; a folder
 * shows the most significant change inside it as a dot. The arrow keys, Home and End, and typing a name move
 * between rows, as in UI SDK's Tree. Any `children` replace the rows inside the Tree; `FileTreeRows` draws them.
 */
export function FileTree({ children, ...props }: FileTreeProps) {
  return (
    <parts.Root {...props}>
      {(tree) => <KindTree {...tree}>{children ?? <FileTreeRows items={tree.items} />}</KindTree>}
    </parts.Root>
  );
}

// Every row has an indicator, a file's an empty spacer that lines its name up with a folder's. It's hidden from agents,
// which hides UI SDK's Tree from them (a component with a part under `data-agent-hidden` is off limits) while the rows
// stay the File Tree's.
export type FileTreeRowsProps = { items: TreeItemData[] };

/** A Tree row for each item, with a `FileTreeItem` in its label, and its children in a group. */
export const FileTreeRows = memo(function FileTreeRows({ items }: FileTreeRowsProps) {
  return items.map((item) => (
    <KindTreeItem key={item.value} value={item.value}>
      <KindTreeItemLabel>
        <KindTreeItemIndicator data-agent-hidden="">{item.children ? CHEVRON : null}</KindTreeItemIndicator>
        <FileTreeItem value={item.value} />
      </KindTreeItemLabel>
      {item.children ? (
        <KindTreeGroup>
          <FileTreeRows items={item.children} />
        </KindTreeGroup>
      ) : null}
    </KindTreeItem>
  ));
});

export type FileTreeItemProps = ComponentProps<typeof parts.Item>;

/**
 * A row's icon, name, line counts and badge, unless you pass children. Its `value` is the row's path. Spaces between
 * the parts keep their words apart in the row's accessible name.
 */
export function FileTreeItem({
  children = ({ name }) => (
    <>
      <span data-file-tree-name="">{name}</span> <FileTreeCounts /> <FileTreeBadge />
    </>
  ),
  ...props
}: FileTreeItemProps) {
  return <parts.Item {...props}>{children}</parts.Item>;
}

export type FileTreeCountsProps = ComponentProps<typeof parts.Counts>;

/** A file's added and removed lines, shown as `+N −N` and read as words. */
export function FileTreeCounts(props: FileTreeCountsProps) {
  return <parts.Counts {...props} />;
}

export type FileTreeBadgeProps = ComponentProps<typeof parts.Badge>;

/** A file's change, shown as a letter like `M` and read as the word, like "modified". */
export function FileTreeBadge(props: FileTreeBadgeProps) {
  return <parts.Badge {...props} />;
}

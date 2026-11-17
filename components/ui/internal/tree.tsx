"use client";

import { Tree, TreeItem, TreeItemIndicator, TreeItemLabel } from "@ui-sdk/react/tree";
import { withKindClass } from "./kind-class.js";

// No Kind group: a `display` utility would outrank the `hidden` a closed group gets.
export { TreeGroup as KindTreeGroup } from "@ui-sdk/react/tree";

export const KindTree = withKindClass(Tree, "flex flex-col text-sm text-[var(--kind-color-fg)]", "KindTree");
export const KindTreeItem = withKindClass(
  TreeItem,
  "outline-none [&:focus-visible>[data-slot=tree-label]]:outline-2 [&:focus-visible>[data-slot=tree-label]]:-outline-offset-2 [&:focus-visible>[data-slot=tree-label]]:outline-[var(--kind-color-ring)]",
  "KindTreeItem",
);
export const KindTreeItemLabel = withKindClass(
  TreeItemLabel,
  "flex min-h-7 cursor-default items-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] ps-[calc((var(--tree-level)-1)*1rem+0.25rem)] pe-2 select-none hover:bg-[var(--kind-color-hover)] data-selected:bg-[color-mix(in_oklab,var(--kind-color-accent)_12%,transparent)] data-disabled:opacity-50",
  "KindTreeItemLabel",
);
export const KindTreeItemIndicator = withKindClass(
  TreeItemIndicator,
  "inline-flex size-4 shrink-0 items-center justify-center text-[var(--kind-color-muted)] [&_svg]:size-3.5 rtl:[&_svg]:-scale-x-100 data-expanded:[&_svg]:rotate-90 rtl:data-expanded:[&_svg]:-rotate-90",
  "KindTreeItemIndicator",
);

"use client";

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@ui-sdk/react/toolbar";
import { withKindClass } from "./kind-class.js";

export const KindToolbar = withKindClass(
  Toolbar,
  "flex items-center gap-0.5 data-[orientation=vertical]:flex-col",
  "KindToolbar",
);
export const KindToolbarButton = withKindClass(
  ToolbarButton,
  "inline-flex h-7 min-w-7 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] px-1.5 text-sm text-[var(--kind-toolbar-button-fg,var(--kind-color-muted))] hover:bg-[var(--kind-color-hover)] hover:text-[var(--kind-color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:opacity-50",
  "KindToolbarButton",
);
export const KindToolbarGroup = withKindClass(
  ToolbarGroup,
  "flex items-center gap-1 data-[orientation=vertical]:flex-col",
  "KindToolbarGroup",
);
export const KindToolbarSeparator = withKindClass(
  ToolbarSeparator,
  "bg-[var(--kind-color-border)] data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:self-stretch data-[orientation=vertical]:mx-1 data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
  "KindToolbarSeparator",
);

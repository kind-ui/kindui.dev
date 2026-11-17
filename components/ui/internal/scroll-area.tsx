"use client";

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area";
import { withKindClass } from "./kind-class.js";

export const KindScrollArea = withKindClass(ScrollArea, "relative overflow-hidden", "KindScrollArea");
export const KindScrollAreaViewport = withKindClass(
  ScrollAreaViewport,
  "size-full rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)]",
  "KindScrollAreaViewport",
);
export const KindScrollAreaContent = withKindClass(ScrollAreaContent, "min-w-full", "KindScrollAreaContent");
export const KindScrollAreaScrollbar = withKindClass(
  ScrollAreaScrollbar,
  "flex touch-none select-none p-0.5 opacity-0 data-visible:opacity-100 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5",
  "KindScrollAreaScrollbar",
);
export const KindScrollAreaThumb = withKindClass(
  ScrollAreaThumb,
  "flex-1 rounded-full bg-[color-mix(in_oklab,var(--kind-color-muted)_55%,transparent)]",
  "KindScrollAreaThumb",
);
export const KindScrollAreaScrollToEnd = withKindClass(
  ScrollAreaScrollToEnd,
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 text-sm font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-wait opacity-0 data-visible:opacity-100",
  "KindScrollAreaScrollToEnd",
);

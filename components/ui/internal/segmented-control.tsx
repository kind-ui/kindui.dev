"use client";

import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { withKindClass } from "./kind-class.js";

export const KindSegmentedControl = withKindClass(
  SegmentedControl,
  "relative isolate inline-flex items-center gap-0.5 rounded-[calc(var(--kind-radius)/2)] bg-[var(--kind-color-hover)] p-0.5 data-disabled:opacity-50",
  "KindSegmentedControl",
);
export const KindSegmentedControlIndicator = withKindClass(
  SegmentedControlIndicator,
  "absolute -z-10 top-0 left-0 [translate:var(--segmented-control-indicator-left)_var(--segmented-control-indicator-top)] h-[var(--segmented-control-indicator-height)] w-[var(--segmented-control-indicator-width)] rounded-[calc(var(--kind-radius)/3)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] shadow-sm shadow-[color:var(--kind-color-shadow)]/10",
  "KindSegmentedControlIndicator",
);
export const KindSegmentedControlItem = withKindClass(
  SegmentedControlItem,
  "inline-flex h-7 items-center justify-center rounded-[calc(var(--kind-radius)/3)] px-2.5 text-xs font-medium text-[var(--kind-color-muted)] outline-none hover:text-[var(--kind-color-fg)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--kind-color-ring)] data-checked:text-[var(--kind-color-fg)] data-disabled:cursor-not-allowed",
  "KindSegmentedControlItem",
);

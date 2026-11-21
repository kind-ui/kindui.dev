"use client";

import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { withKindClass } from "./kind-class.js";

export const KindSegmentedControl = withKindClass(
  SegmentedControl,
  "relative isolate inline-flex items-center gap-0.5 rounded-[var(--kind-radius-full)] bg-[var(--kind-color-hover)] p-0.5 data-disabled:opacity-[var(--kind-disabled-opacity)]",
  "KindSegmentedControl",
);
export const KindSegmentedControlIndicator = withKindClass(
  SegmentedControlIndicator,
  "absolute -z-10 top-0 left-0 [translate:var(--segmented-control-indicator-left)_var(--segmented-control-indicator-top)] h-[var(--segmented-control-indicator-height)] w-[var(--segmented-control-indicator-width)] rounded-[var(--kind-radius-full)] bg-[var(--kind-color-surface)] shadow-[0_0_0_1px_var(--kind-color-hairline),var(--kind-shadow-control)]",
  "KindSegmentedControlIndicator",
);
export const KindSegmentedControlItem = withKindClass(
  SegmentedControlItem,
  "inline-flex h-7 items-center justify-center rounded-[var(--kind-radius-full)] px-3 text-[length:var(--kind-text-xs)]/4 font-medium text-[var(--kind-color-muted)] outline-hidden hover:text-[var(--kind-color-fg)] focus-visible:[outline:var(--kind-focus-ring)] focus-visible:[outline-offset:var(--kind-focus-offset)] data-checked:text-[var(--kind-color-fg)] data-disabled:cursor-not-allowed",
  "KindSegmentedControlItem",
);

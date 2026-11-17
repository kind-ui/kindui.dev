"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox";
import { withKindClass } from "./kind-class.js";

export const KindCombobox = Combobox;
export const KindComboboxInput = withKindClass(
  ComboboxInput,
  "h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-[var(--kind-color-fg)] outline-none placeholder:text-[var(--kind-color-muted)] data-disabled:cursor-not-allowed",
  "KindComboboxInput",
);
export const KindComboboxTrigger = withKindClass(
  ComboboxTrigger,
  "inline-flex size-6 shrink-0 items-center justify-center rounded-[calc(var(--kind-radius)/3)] text-[var(--kind-color-muted)] hover:bg-[var(--kind-color-hover)] hover:text-[var(--kind-color-fg)] data-disabled:pointer-events-none",
  "KindComboboxTrigger",
);
export const KindComboboxContent = withKindClass(
  ComboboxContent,
  "z-50 min-w-[var(--anchor-width)] rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] p-1 text-sm text-[var(--kind-color-fg)] shadow-md shadow-[color:var(--kind-color-shadow)]/10 outline-none [--list-height:var(--available-height)] [transform-origin:var(--transform-origin)]",
  "KindComboboxContent",
);
export const KindComboboxList = withKindClass(
  ComboboxList,
  "max-h-[min(20rem,var(--list-height))] overflow-y-auto overscroll-contain outline-none",
  "KindComboboxList",
);
export const KindComboboxGroup = withKindClass(ComboboxGroup, "py-0.5", "KindComboboxGroup");
export const KindComboboxGroupLabel = withKindClass(
  ComboboxGroupLabel,
  "px-2 pt-1.5 pb-1 text-xs font-medium text-[var(--kind-color-muted)]",
  "KindComboboxGroupLabel",
);
export const KindComboboxItem = withKindClass(
  ComboboxItem,
  "flex cursor-default select-none items-center gap-2 rounded-[calc(var(--kind-radius)/3)] px-2 py-1.5 outline-none data-highlighted:bg-[var(--kind-color-hover)] data-disabled:cursor-not-allowed data-disabled:opacity-50",
  "KindComboboxItem",
);
export const KindComboboxItemIndicator = withKindClass(
  ComboboxItemIndicator,
  "ms-auto inline-flex size-4 shrink-0 items-center justify-center text-[var(--kind-color-accent)]",
  "KindComboboxItemIndicator",
);
export const KindComboboxEmpty = withKindClass(
  ComboboxEmpty,
  "px-2 text-center text-sm text-[var(--kind-color-muted)] data-empty:py-6",
  "KindComboboxEmpty",
);

"use client";

import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { withKindClass } from "./kind-class.js";

export const KindCheckboxGroup = withKindClass(CheckboxGroup, "flex flex-col gap-1", "KindCheckboxGroup");
export const KindCheckbox = withKindClass(
  Checkbox,
  "relative inline-flex size-4 shrink-0 items-center justify-center rounded-[calc(var(--kind-radius)/3)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] text-[var(--kind-color-on-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-checked:border-[var(--kind-color-accent)] data-checked:bg-[var(--kind-color-accent)] data-disabled:cursor-not-allowed data-disabled:opacity-50",
  "KindCheckbox",
);
export const KindCheckboxIndicator = withKindClass(
  CheckboxIndicator,
  "flex size-3 items-center justify-center [&_svg]:size-full",
  "KindCheckboxIndicator",
);

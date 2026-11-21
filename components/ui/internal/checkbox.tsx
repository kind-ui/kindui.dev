"use client";

import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { withKindClass } from "./kind-class.js";

export const KindCheckboxGroup = withKindClass(CheckboxGroup, "flex flex-col gap-1", "KindCheckboxGroup");
export const KindCheckbox = withKindClass(
  Checkbox,
  "relative inline-flex size-4 shrink-0 items-center justify-center rounded-[var(--kind-radius-sm)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] text-[var(--kind-color-on-accent)] focus-visible:[outline:var(--kind-focus-ring)] focus-visible:[outline-offset:var(--kind-focus-offset)] data-checked:border-[var(--kind-color-accent)] data-checked:bg-[var(--kind-color-accent)] data-disabled:cursor-not-allowed data-disabled:opacity-[var(--kind-disabled-opacity)]",
  "KindCheckbox",
);
export const KindCheckboxIndicator = withKindClass(
  CheckboxIndicator,
  "flex size-3 items-center justify-center [&_svg]:size-full",
  "KindCheckboxIndicator",
);

"use client";

import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import { withKindClass } from "./kind-class.js";

export const KindRadioGroup = withKindClass(RadioGroup, "flex flex-col gap-1", "KindRadioGroup");
export const KindRadio = withKindClass(
  Radio,
  "relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-checked:border-[var(--kind-color-accent)] data-disabled:cursor-not-allowed data-disabled:opacity-50",
  "KindRadio",
);
export const KindRadioIndicator = withKindClass(
  RadioIndicator,
  "size-2 rounded-full bg-[var(--kind-color-accent)]",
  "KindRadioIndicator",
);

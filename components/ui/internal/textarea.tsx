"use client";

import { Textarea } from "@ui-sdk/react/textarea";
import { withKindClass } from "./kind-class.js";

export const KindTextarea = withKindClass(
  Textarea,
  "block min-h-16 max-h-40 w-full resize-none rounded-[calc(var(--kind-radius)*2/3)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 py-2 text-[length:inherit] leading-[inherit] text-[var(--kind-color-fg)] placeholder:text-[var(--kind-color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-readonly:text-[var(--kind-color-muted)]",
  "KindTextarea",
);

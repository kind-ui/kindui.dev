import { Button } from "@ui-sdk/react/button";
import { withKindClass } from "./kind-class.js";

export const KindButton = withKindClass(
  Button,
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 text-sm font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-wait",
  "KindButton",
);

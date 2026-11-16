import { Toggle, ToggleIcon } from "@ui-sdk/react/toggle";
import { withKindClass } from "./kind-class.js";

export const KindToggle = withKindClass(
  Toggle,
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] px-2 text-sm font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-pressed:bg-[var(--kind-color-fg)] data-pressed:text-[var(--kind-color-surface)] data-disabled:opacity-50",
  "KindToggle",
);
export const KindToggleIcon = withKindClass(ToggleIcon, "inline-flex size-4 shrink-0", "KindToggleIcon");

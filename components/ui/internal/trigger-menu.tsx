import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu";
import { withKindClass } from "./kind-class.js";

export const KindTriggerMenu = TriggerMenu;
export const KindTriggerMenuInput = withKindClass(
  TriggerMenuInput,
  "min-h-16 w-full rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 py-2 text-sm text-[var(--kind-color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:opacity-50",
  "KindTriggerMenuInput",
);
export const KindTriggerMenuContent = withKindClass(
  TriggerMenuContent,
  "z-50 min-w-40 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] p-1 text-sm text-[var(--kind-color-fg)] shadow-md shadow-[color:var(--kind-color-shadow)]/10 outline-none",
  "KindTriggerMenuContent",
);
export const KindTriggerMenuList = withKindClass(TriggerMenuList, "flex flex-col", "KindTriggerMenuList");
export const KindTriggerMenuItem = withKindClass(
  TriggerMenuItem,
  "flex cursor-default select-none items-center gap-2 rounded-[calc(var(--kind-radius)/3)] px-2 py-1.5 outline-none focus-visible:bg-[var(--kind-color-hover)] data-highlighted:bg-[var(--kind-color-hover)] data-disabled:opacity-50",
  "KindTriggerMenuItem",
);
export const KindTriggerMenuEmpty = withKindClass(
  TriggerMenuEmpty,
  "px-2 py-1.5 text-[var(--kind-color-muted)]",
  "KindTriggerMenuEmpty",
);

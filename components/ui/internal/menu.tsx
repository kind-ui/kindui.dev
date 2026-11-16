import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu";
import { withKindClass } from "./kind-class.js";

export const KindMenu = Menu;
export const KindMenuTrigger = withKindClass(
  MenuTrigger,
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 text-sm font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-wait",
  "KindMenuTrigger",
);
export const KindMenuContent = withKindClass(
  MenuContent,
  "z-50 min-w-40 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] p-1 text-sm text-[var(--kind-color-fg)] shadow-md shadow-[color:var(--kind-color-shadow)]/10 outline-none",
  "KindMenuContent",
);
export const KindMenuItem = withKindClass(
  MenuItem,
  "flex cursor-default select-none items-center gap-2 rounded-[calc(var(--kind-radius)/3)] px-2 py-1.5 outline-none focus-visible:bg-[var(--kind-color-hover)] data-highlighted:bg-[var(--kind-color-hover)] data-disabled:opacity-50",
  "KindMenuItem",
);
export const KindMenuSeparator = withKindClass(
  MenuSeparator,
  "-mx-1 my-1 h-px bg-[var(--kind-color-border)]",
  "KindMenuSeparator",
);

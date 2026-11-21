"use client";

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
  "min-h-16 w-full rounded-[var(--kind-radius-md)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 py-2 text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)] outline-hidden data-disabled:opacity-[var(--kind-disabled-opacity)]",
  "KindTriggerMenuInput",
);
export const KindTriggerMenuContent = withKindClass(
  TriggerMenuContent,
  "z-50 min-w-40 rounded-[var(--kind-popup-radius)] bg-[var(--kind-color-raised)] p-[var(--kind-popup-padding)] text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)] shadow-[var(--kind-shadow-popover)] outline-hidden",
  "KindTriggerMenuContent",
);
export const KindTriggerMenuList = withKindClass(TriggerMenuList, "flex flex-col", "KindTriggerMenuList");
export const KindTriggerMenuItem = withKindClass(
  TriggerMenuItem,
  "flex cursor-default select-none items-center gap-2 rounded-[var(--kind-radius-md)] px-2.5 py-1.5 outline-hidden focus-visible:bg-[var(--kind-color-selected)] data-highlighted:bg-[var(--kind-color-selected)] data-disabled:opacity-[var(--kind-disabled-opacity)]",
  "KindTriggerMenuItem",
);
export const KindTriggerMenuEmpty = withKindClass(
  TriggerMenuEmpty,
  "px-2 py-1.5 text-[var(--kind-color-muted)]",
  "KindTriggerMenuEmpty",
);

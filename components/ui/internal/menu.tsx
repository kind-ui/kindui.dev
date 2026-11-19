"use client";

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu";
import type { ReactElement } from "react";
import { withKindClass } from "./kind-class.js";

const content =
  "z-50 min-w-40 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] p-1 text-sm text-[var(--kind-color-fg)] shadow-md shadow-[color:var(--kind-color-shadow)]/10 outline-none data-[presentation=sheet]:w-full data-[presentation=sheet]:max-w-none data-[presentation=sheet]:rounded-b-none data-[presentation=sheet]:pb-[max(0.5rem,env(safe-area-inset-bottom))] data-[presentation=sheet]:[&_:is([data-slot=menu-item],[data-slot=menu-checkbox-item],[data-slot=menu-radio-item],[data-slot=menu-trigger])]:py-2.5";
const item =
  "flex cursor-default select-none items-center gap-2 rounded-[calc(var(--kind-radius)/3)] px-2 py-1.5 outline-none focus-visible:bg-[var(--kind-color-hover)] data-highlighted:bg-[var(--kind-color-hover)] data-disabled:opacity-50 has-[[data-menu-description]]:items-start data-destructive:text-[var(--kind-color-danger)] [&_[data-menu-text]]:flex [&_[data-menu-text]]:min-w-0 [&_[data-menu-text]]:flex-col [&_[data-menu-description]]:text-xs [&_[data-menu-description]]:text-[var(--kind-color-muted)]";

export const KindMenu = Menu;
export const KindMenuTrigger = withKindClass(
  MenuTrigger,
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 text-sm font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-wait",
  "KindMenuTrigger",
);
export const KindMenuContent = withKindClass(MenuContent, content, "KindMenuContent");
export const KindMenuItem = withKindClass(MenuItem, item, "KindMenuItem");
export const KindMenuCheckboxItem = withKindClass(MenuCheckboxItem, item, "KindMenuCheckboxItem");
export const KindMenuRadioGroup = MenuRadioGroup;
export const KindMenuRadioItem = withKindClass(MenuRadioItem, item, "KindMenuRadioItem");
export const KindMenuItemIndicator = withKindClass(
  MenuItemIndicator,
  "inline-flex h-5 w-4 shrink-0 items-center justify-center text-[var(--kind-color-accent)] data-unchecked:invisible",
  "KindMenuItemIndicator",
);
export const KindMenuItemIcon = withKindClass(
  MenuItemIcon,
  "inline-flex h-5 w-4 shrink-0 items-center justify-center text-[var(--kind-color-muted)] [&_svg]:size-4",
  "KindMenuItemIcon",
);
export const KindMenuSub = MenuSub;
export const KindMenuSubTrigger = withKindClass(
  MenuSubTrigger,
  `${item} data-open:bg-[var(--kind-color-hover)]`,
  "KindMenuSubTrigger",
);
export const KindMenuSubContent = withKindClass(MenuSubContent, content, "KindMenuSubContent");
export const KindMenuGroup = withKindClass(MenuGroup, "py-0.5", "KindMenuGroup");
export const KindMenuGroupLabel = withKindClass(
  MenuGroupLabel,
  "px-2 pt-1.5 pb-1 text-xs font-medium text-[var(--kind-color-muted)]",
  "KindMenuGroupLabel",
);
export const KindMenuSeparator = withKindClass(
  MenuSeparator,
  "-mx-1 my-1 h-px bg-[var(--kind-color-border)]",
  "KindMenuSeparator",
);

export type KindMenuItemContentProps = {
  /** An image URL, or an element such as an inline `svg`. */
  icon?: unknown;
  label: string;
  description?: string | undefined;
};

/** A data row's icon and text, the label over an optional description, as menus built on `menuBase` draw them. */
export function KindMenuItemContent({ icon, label, description }: KindMenuItemContentProps) {
  return (
    <>
      {icon !== undefined ? (
        <KindMenuItemIcon>
          {typeof icon === "string" ? <img src={icon} alt="" /> : (icon as ReactElement)}
        </KindMenuItemIcon>
      ) : null}
      <span data-menu-text="">
        <span>{label}</span>
        {description ? <span data-menu-description="">{description}</span> : null}
      </span>
    </>
  );
}

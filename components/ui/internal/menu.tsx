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
  "z-50 min-w-50 rounded-[var(--kind-popup-radius)] bg-[var(--kind-color-raised)] p-[var(--kind-popup-padding)] text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)] shadow-[var(--kind-shadow-popover)] outline-hidden data-[presentation=sheet]:w-full data-[presentation=sheet]:max-w-none data-[presentation=sheet]:rounded-b-none data-[presentation=sheet]:pb-[max(0.5rem,env(safe-area-inset-bottom))] data-[presentation=sheet]:[&_:is([data-slot=menu-item],[data-slot=menu-checkbox-item],[data-slot=menu-radio-item],[data-slot=menu-trigger])]:py-2.5";
const item =
  "flex cursor-default select-none items-center gap-2 rounded-[var(--kind-radius-md)] px-2.5 py-1.5 outline-hidden focus-visible:bg-[var(--kind-color-selected)] data-highlighted:bg-[var(--kind-color-selected)] data-disabled:opacity-[var(--kind-disabled-opacity)] has-[[data-menu-description]]:items-start data-destructive:text-[var(--kind-color-danger)] [&_[data-menu-text]]:flex [&_[data-menu-text]]:min-w-0 [&_[data-menu-text]]:flex-col [&_[data-menu-description]]:text-[length:var(--kind-text-xs)]/4 [&_[data-menu-description]]:text-[var(--kind-color-muted)]";

export const KindMenu = Menu;
export const KindMenuTrigger = withKindClass(
  MenuTrigger,
  "inline-flex h-[var(--kind-trigger-height)] items-center justify-center gap-1.5 rounded-[var(--kind-radius-full)] px-3 text-[length:var(--kind-text-md)]/5 font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] data-open:bg-[var(--kind-color-selected)] focus-visible:[outline:var(--kind-focus-ring)] focus-visible:[outline-offset:var(--kind-focus-offset)] data-disabled:cursor-not-allowed data-disabled:opacity-[var(--kind-disabled-opacity)] data-pending:cursor-wait",
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
  `${item} data-open:bg-[var(--kind-color-selected)]`,
  "KindMenuSubTrigger",
);
export const KindMenuSubContent = withKindClass(MenuSubContent, content, "KindMenuSubContent");
export const KindMenuGroup = withKindClass(MenuGroup, "py-0.5", "KindMenuGroup");
export const KindMenuGroupLabel = withKindClass(
  MenuGroupLabel,
  "px-2.5 pt-1.5 pb-1 text-[length:var(--kind-text-xs)]/4 font-medium text-[var(--kind-color-muted)]",
  "KindMenuGroupLabel",
);
export const KindMenuSeparator = withKindClass(
  MenuSeparator,
  "mx-2.5 my-1 h-px bg-[var(--kind-color-border)]",
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

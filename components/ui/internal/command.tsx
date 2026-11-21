"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
} from "@ui-sdk/react/command";
import { withKindClass } from "./kind-class.js";

export const KindCommand = withKindClass(
  Command,
  "flex min-w-0 flex-col text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)]",
  "KindCommand",
);
export const KindCommandInput = withKindClass(
  CommandInput,
  "h-[var(--kind-command-input-height,2.25rem)] w-full min-w-0 border-b border-[var(--kind-color-border)] bg-transparent px-3 text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)] outline-hidden placeholder:text-[var(--kind-color-muted)]",
  "KindCommandInput",
);
export const KindCommandList = withKindClass(
  CommandList,
  "max-h-[var(--kind-command-list-max-height,18rem)] overflow-y-auto overscroll-contain p-1 outline-hidden",
  "KindCommandList",
);
export const KindCommandGroup = withKindClass(CommandGroup, "py-0.5", "KindCommandGroup");
export const KindCommandGroupLabel = withKindClass(
  CommandGroupLabel,
  "px-2.5 pt-1.5 pb-1 text-[length:var(--kind-text-xs)]/4 font-medium text-[var(--kind-color-muted)]",
  "KindCommandGroupLabel",
);
export const KindCommandItem = withKindClass(
  CommandItem,
  "flex cursor-default select-none items-center gap-2 rounded-[var(--kind-radius-md)] px-2.5 py-[var(--kind-command-item-padding-block,0.375rem)] outline-hidden data-highlighted:bg-[var(--kind-color-selected)] data-disabled:cursor-not-allowed data-disabled:opacity-[var(--kind-command-item-disabled-opacity,var(--kind-disabled-opacity))] data-pending:cursor-wait",
  "KindCommandItem",
);
export const KindCommandItemIcon = withKindClass(
  CommandItemIcon,
  "inline-flex size-4 shrink-0 items-center justify-center text-[var(--kind-command-icon-color,var(--kind-color-muted))] [&_svg]:size-4",
  "KindCommandItemIcon",
);
export const KindCommandItemText = withKindClass(
  CommandItemText,
  "min-w-0 truncate [&_mark]:bg-transparent [&_mark]:[font-weight:var(--kind-command-mark-weight,500)] [&_mark]:text-[var(--kind-command-mark-color,var(--kind-color-fg))]",
  "KindCommandItemText",
);
export const KindCommandShortcut = withKindClass(
  CommandShortcut,
  "ms-auto text-[length:var(--kind-text-xs)]/4 tracking-widest text-[var(--kind-color-muted)]",
  "KindCommandShortcut",
);
export const KindCommandSeparator = withKindClass(
  CommandSeparator,
  "mx-2.5 my-1 h-px bg-[var(--kind-color-border)]",
  "KindCommandSeparator",
);
export const KindCommandEmpty = withKindClass(
  CommandEmpty,
  "px-2 text-center text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-muted)] data-empty:py-6",
  "KindCommandEmpty",
);
export const KindCommandStatus = withKindClass(
  CommandStatus,
  "px-2 text-center text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-muted)] not-empty:py-6",
  "KindCommandStatus",
);
export const KindCommandPage = CommandPage;

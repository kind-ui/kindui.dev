"use client";

import { Drawer, DrawerBackdrop, DrawerContent, DrawerDescription, DrawerTitle } from "@ui-sdk/react/drawer";
import { withKindClass } from "./kind-class.js";

export const KindDrawer = Drawer;
export const KindDrawerBackdrop = withKindClass(
  DrawerBackdrop,
  "fixed inset-0 z-50 bg-[var(--kind-color-scrim)] backdrop-blur-[var(--kind-scrim-blur)]",
  "KindDrawerBackdrop",
);
export const KindDrawerContent = withKindClass(
  DrawerContent,
  "flex h-full max-h-dvh w-[min(20rem,calc(100vw-3rem))] flex-col overflow-hidden border-[var(--kind-color-border)] bg-[var(--kind-color-raised)] text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)] shadow-[var(--kind-shadow-dialog)] outline-hidden data-[side=left]:border-e data-[side=right]:border-s data-[side=top]:h-auto data-[side=top]:w-full data-[side=top]:border-b data-[side=bottom]:h-auto data-[side=bottom]:w-full data-[side=bottom]:border-t",
  "KindDrawerContent",
);
export const KindDrawerTitle = withKindClass(
  DrawerTitle,
  "m-0 text-[length:var(--kind-text-xl)] font-semibold leading-6",
  "KindDrawerTitle",
);
export const KindDrawerDescription = withKindClass(
  DrawerDescription,
  "m-0 text-[var(--kind-color-muted)]",
  "KindDrawerDescription",
);

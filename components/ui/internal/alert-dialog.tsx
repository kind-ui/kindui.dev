"use client";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog";
import { withKindClass } from "./kind-class.js";

export const KindAlertDialog = AlertDialog;
export const KindAlertDialogTrigger = AlertDialogTrigger;
export const KindAlertDialogBackdrop = withKindClass(
  AlertDialogBackdrop,
  "fixed inset-0 z-50 bg-[var(--kind-color-scrim)] backdrop-blur-[var(--kind-scrim-blur)]",
  "KindAlertDialogBackdrop",
);
export const KindAlertDialogContent = withKindClass(
  AlertDialogContent,
  "fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[min(26rem,calc(100%-2rem))] flex-col gap-2 overflow-y-auto rounded-[var(--kind-dialog-radius)] bg-[var(--kind-color-raised)] p-6 text-[length:var(--kind-text-md)]/5 text-[var(--kind-color-fg)] shadow-[var(--kind-shadow-dialog)] outline-hidden",
  "KindAlertDialogContent",
);
export const KindAlertDialogTitle = withKindClass(
  AlertDialogTitle,
  "m-0 text-[length:var(--kind-text-xl)] font-semibold leading-6",
  "KindAlertDialogTitle",
);
export const KindAlertDialogDescription = withKindClass(
  AlertDialogDescription,
  "m-0 text-[var(--kind-color-muted)]",
  "KindAlertDialogDescription",
);

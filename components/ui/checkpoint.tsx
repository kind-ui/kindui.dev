"use client";

import { type CheckpointDialogState, checkpointPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import {
  KindAlertDialog,
  KindAlertDialogBackdrop,
  KindAlertDialogContent,
  KindAlertDialogDescription,
  KindAlertDialogTitle,
  KindAlertDialogTrigger,
} from "./internal/alert-dialog.js";
import { KindTooltip, KindTooltipContent, KindTooltipTrigger } from "./internal/tooltip.js";

const parts = createParts(checkpointPrimitive, {
  root: "div",
  label: "span",
  description: "span",
  line: "span",
  restore: "div",
  restored: "span",
  error: "span",
  cancel: "button",
  confirm: "button",
});

export type CheckpointProps = ComponentProps<typeof parts.Root>;

/**
 * A marker in the conversation that a person can restore. Restore opens a dialog that asks before calling
 * `onRestore`. Any `children` replace the default parts.
 */
export function Checkpoint({ children = DEFAULT_PARTS, ...props }: CheckpointProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export const CheckpointLine = parts.Line;

export type CheckpointLabelProps = ComponentProps<typeof parts.Label>;

/** The `label`, unless you pass children. */
export function CheckpointLabel({ children = ({ label }) => label, ...props }: CheckpointLabelProps) {
  return <parts.Label {...props}>{children}</parts.Label>;
}

export type CheckpointDescriptionProps = ComponentProps<typeof parts.Description>;

/** The `description`, unless you pass children. Rendered only with one. */
export function CheckpointDescription({
  children = ({ description }) => description,
  ...props
}: CheckpointDescriptionProps) {
  return <parts.Description {...props}>{children}</parts.Description>;
}

export type CheckpointRestoreProps = ComponentProps<typeof parts.Restore>;

/**
 * Restore and its dialog, unless you pass children: a function that gets the Alert Dialog's props. Rendered only
 * while `onRestore` is set and the checkpoint isn't `restored`.
 */
export function CheckpointRestore({
  children = ({ controller, dismissible, ...dialog }) => (
    <KindAlertDialog controller={controller} dismissible={dismissible}>
      <KindTooltip type="label">
        <KindTooltipTrigger
          render={<KindAlertDialogTrigger />}
          data-checkpoint-trigger=""
          data-kind-icon-button=""
        />
        <KindTooltipContent>Restore checkpoint</KindTooltipContent>
      </KindTooltip>
      <CheckpointDialog {...dialog} />
    </KindAlertDialog>
  ),
  ...props
}: CheckpointRestoreProps) {
  return <parts.Restore {...props}>{children}</parts.Restore>;
}

export type CheckpointDialogProps = Omit<CheckpointDialogState, "controller" | "dismissible" | "busy"> & {
  busy?: boolean;
  children?: ReactNode;
};

/** The dialog's backdrop and content: its title, description and answers, unless you pass children. */
export function CheckpointDialog({
  title,
  description,
  initialFocus,
  busy,
  children = DEFAULT_ANSWERS,
}: CheckpointDialogProps) {
  return (
    <>
      <KindAlertDialogBackdrop />
      <KindAlertDialogContent initialFocus={initialFocus} aria-busy={busy || undefined}>
        <KindAlertDialogTitle>{title}</KindAlertDialogTitle>
        <KindAlertDialogDescription>{description}</KindAlertDialogDescription>
        {children}
      </KindAlertDialogContent>
    </>
  );
}

export type CheckpointRestoredProps = ComponentProps<typeof parts.Restored>;

/** "Restored" with a check, in Restore's place once the host restores the checkpoint, unless you pass children. */
export function CheckpointRestored({
  children = (
    <>
      <span aria-hidden="true" data-status-mark="" data-status="complete" />
      Restored
    </>
  ),
  ...props
}: CheckpointRestoredProps) {
  return <parts.Restored {...props}>{children}</parts.Restored>;
}

export type CheckpointErrorProps = ComponentProps<typeof parts.Error>;

/** "Couldn't restore. Try again." after a restore fails, unless you pass children. */
export function CheckpointError({
  children = "Couldn't restore. Try again.",
  ...props
}: CheckpointErrorProps) {
  return <parts.Error {...props}>{children}</parts.Error>;
}

export type CheckpointCancelProps = ComponentProps<typeof parts.Cancel>;

/** Closes the dialog. Reads "Cancel" unless you pass children. */
export function CheckpointCancel({ children = "Cancel", ...props }: CheckpointCancelProps) {
  return <parts.Cancel {...props}>{children}</parts.Cancel>;
}

export type CheckpointConfirmProps = ComponentProps<typeof parts.Confirm>;

/** Calls `onRestore`. Reads "Restore", with a running mark while the restore is pending, unless you pass children. */
export function CheckpointConfirm({ children = CONFIRM_LABEL, ...props }: CheckpointConfirmProps) {
  return <parts.Confirm {...props}>{children}</parts.Confirm>;
}

// The mark shows only while the restore is pending (controls.css).
const CONFIRM_LABEL = (
  <>
    <span data-kind-pending-mark="" data-status-mark="" data-status="running" aria-hidden="true" />
    Restore
  </>
);

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_ANSWERS = (
  <div data-checkpoint-answers="">
    <CheckpointError />
    <CheckpointCancel />
    <CheckpointConfirm />
  </div>
);

const DEFAULT_PARTS = (
  <>
    <CheckpointLabel />
    <CheckpointDescription />
    <CheckpointLine />
    <CheckpointRestore />
    <CheckpointRestored />
  </>
);

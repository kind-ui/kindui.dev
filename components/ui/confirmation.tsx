"use client";

import { confirmationPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { KindTextarea } from "./internal/textarea.js";

const parts = createParts(confirmationPrimitive, {
  root: "div",
  title: "div",
  reason: "div",
  choices: "div",
  approve: "button",
  deny: "button",
  cancel: "button",
  error: "span",
  outcome: "div",
  "outcome-icon": "span",
});

export type ConfirmationProps = ComponentProps<typeof parts.Root>;

/**
 * Asks a person to approve or deny a request, then shows what was decided. Only the choices the host supplies
 * (`onApprove`, `onDeny`) render. Any `children` replace the default parts.
 */
export function Confirmation({ children, ...props }: ConfirmationProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const ConfirmationChoices = parts.Choices;
export const ConfirmationOutcomeIcon = parts.OutcomeIcon;

export type ConfirmationTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, unless you pass children. Rendered only while `label` is set, and hidden inside a Tool. */
export function ConfirmationTitle({ children = ({ label }) => label, ...props }: ConfirmationTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type ConfirmationReasonProps = ComponentProps<typeof parts.Reason>;

/**
 * A box for the reason Deny sends, unless you pass children. Rendered with the `reason` option, once a person's Deny
 * opens it.
 */
export function ConfirmationReason({
  children = ({ controller, readOnly }) => (
    <KindTextarea
      controller={controller}
      readOnly={readOnly}
      aria-label="Reason for denying"
      placeholder="Add a reason (optional)"
      rows={2}
    />
  ),
  ...props
}: ConfirmationReasonProps) {
  return <parts.Reason {...props}>{children}</parts.Reason>;
}

export type ConfirmationApproveProps = ComponentProps<typeof parts.Approve>;

/** Calls `onApprove`. Reads the `approveLabel` unless you pass children. Rendered only while `onApprove` is set. */
export function ConfirmationApprove({ children = withPendingMark, ...props }: ConfirmationApproveProps) {
  return <parts.Approve {...props}>{children}</parts.Approve>;
}

export type ConfirmationDenyProps = ComponentProps<typeof parts.Deny>;

/**
 * Calls `onDeny`. With `reason`, a person's first press opens the reason box instead. Reads the `denyLabel` unless
 * you pass children. Rendered only while `onDeny` is set.
 */
export function ConfirmationDeny({ children = withPendingMark, ...props }: ConfirmationDenyProps) {
  return <parts.Deny {...props}>{children}</parts.Deny>;
}

export type ConfirmationCancelProps = ComponentProps<typeof parts.Cancel>;

/** Closes the reason box without deciding. Reads "Cancel" unless you pass children. Rendered while the box is open. */
export function ConfirmationCancel({ children = "Cancel", ...props }: ConfirmationCancelProps) {
  return <parts.Cancel {...props}>{children}</parts.Cancel>;
}

export type ConfirmationErrorProps = ComponentProps<typeof parts.Error>;

/** "Decision not sent. Try again." while the host reports `submit-failed`, unless you pass children. */
export function ConfirmationError({
  children = "Decision not sent. Try again.",
  ...props
}: ConfirmationErrorProps) {
  return <parts.Error {...props}>{children}</parts.Error>;
}

export type ConfirmationOutcomeProps = ComponentProps<typeof parts.Outcome>;

/** Where the request stands, like "Approved", with the denial's reason, unless you pass children. */
export function ConfirmationOutcome({
  children = ({ label, reason }) => (
    <>
      <ConfirmationOutcomeIcon />
      <span data-confirmation-label="">{label}</span>
      {reason ? <span data-confirmation-reason="">{reason}</span> : null}
    </>
  ),
  ...props
}: ConfirmationOutcomeProps) {
  return <parts.Outcome {...props}>{children}</parts.Outcome>;
}

// The mark shows only while the button's call is pending (controls.css).
const withPendingMark = ({ label }: { label: string }) => (
  <>
    <span data-kind-pending-mark="" data-status-mark="" data-status="running" aria-hidden="true" />
    {label}
  </>
);

// Shared, so an update to the request doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ConfirmationTitle />
    <ConfirmationReason />
    <ConfirmationChoices>
      <ConfirmationApprove />
      <ConfirmationDeny />
      <ConfirmationCancel />
      <ConfirmationError />
    </ConfirmationChoices>
    <ConfirmationOutcome />
  </>
);

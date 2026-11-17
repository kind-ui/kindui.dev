"use client";

import { confirmationPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { KindTextarea } from "./internal/textarea.js";

const parts = createParts(confirmationPrimitive, {
  root: "div",
  reason: "div",
  choices: "div",
  approve: "button",
  deny: "button",
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

export type ConfirmationReasonProps = ComponentProps<typeof parts.Reason>;

/** A box for the reason Deny sends, unless you pass children. Rendered only with the `reason` option. */
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
export function ConfirmationApprove({ children = ({ label }) => label, ...props }: ConfirmationApproveProps) {
  return <parts.Approve {...props}>{children}</parts.Approve>;
}

export type ConfirmationDenyProps = ComponentProps<typeof parts.Deny>;

/** Calls `onDeny`. Reads the `denyLabel` unless you pass children. Rendered only while `onDeny` is set. */
export function ConfirmationDeny({ children = ({ label }) => label, ...props }: ConfirmationDenyProps) {
  return <parts.Deny {...props}>{children}</parts.Deny>;
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

// Shared, so an update to the request doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ConfirmationReason />
    <ConfirmationChoices>
      <ConfirmationApprove />
      <ConfirmationDeny />
      <ConfirmationError />
    </ConfirmationChoices>
    <ConfirmationOutcome />
  </>
);

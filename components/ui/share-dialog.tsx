"use client";

import { shareDialogPrimitive } from "@kind-ui/agent-ui/core";
import { Input } from "@ui-sdk/react/input";
import { createParts, renderElement } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import {
  KindSegmentedControl,
  KindSegmentedControlIndicator,
  KindSegmentedControlItem,
} from "./internal/segmented-control.js";

const parts = createParts(shareDialogPrimitive, {
  root: "div",
  trigger: "button",
  backdrop: "div",
  viewport: "div",
  content: "div",
  title: "h2",
  description: "p",
  visibility: "div",
  link: "div",
  create: "button",
  copy: "button",
  revoke: "button",
  error: "p",
  close: "button",
});

export type ShareDialogProps = ComponentProps<typeof parts.Root>;
export type ShareDialogTriggerProps = ComponentProps<typeof parts.Trigger>;
export type ShareDialogContentProps = ComponentProps<typeof parts.Content>;
export type ShareDialogTitleProps = ComponentProps<typeof parts.Title>;
export type ShareDialogDescriptionProps = ComponentProps<typeof parts.Description>;
export type ShareDialogVisibilityProps = ComponentProps<typeof parts.Visibility>;
export type ShareDialogLinkProps = ComponentProps<typeof parts.Link>;
export type ShareDialogCreateProps = ComponentProps<typeof parts.Create>;
export type ShareDialogCopyProps = ComponentProps<typeof parts.Copy>;
export type ShareDialogRevokeProps = ComponentProps<typeof parts.Revoke>;
export type ShareDialogErrorProps = ComponentProps<typeof parts.Error>;
export type ShareDialogCloseProps = ComponentProps<typeof parts.Close>;

/** Opens the dialog. Its `label`, after a share glyph, unless you pass children. */
export function ShareDialogTrigger({ children = ({ label }) => label, ...props }: ShareDialogTriggerProps) {
  return <parts.Trigger {...props}>{children}</parts.Trigger>;
}

/** Dims the page behind the dialog. */
export const ShareDialogBackdrop = parts.Backdrop;

/** The dialog's title, the `dialogLabel`, unless you pass children. */
export function ShareDialogTitle({ children = ({ label }) => label, ...props }: ShareDialogTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

/** Who can open the chat, in words, unless you pass children. Describes the dialog. */
export function ShareDialogDescription({
  children = ({ text }) => text,
  ...props
}: ShareDialogDescriptionProps) {
  return <parts.Description {...props}>{children}</parts.Description>;
}

const VISIBILITY: ShareDialogVisibilityProps["children"] = ({ options, ...control }) => (
  // Hidden from agents, which use the Share Dialog's own `setVisibility`.
  <KindSegmentedControl {...control} data-agent-hidden="">
    <KindSegmentedControlIndicator />
    {options.map((option) => (
      <KindSegmentedControlItem key={option.value} value={option.value}>
        {option.label}
      </KindSegmentedControlItem>
    ))}
  </KindSegmentedControl>
);

/** "Only you" or "Anyone with the link", a UI SDK Segmented Control, unless you pass children. */
export function ShareDialogVisibility({ children = VISIBILITY, ...props }: ShareDialogVisibilityProps) {
  return <parts.Visibility {...props}>{children}</parts.Visibility>;
}

const LINK: ShareDialogLinkProps["children"] = (input) => <Input {...input} data-agent-hidden="" />;

/** The `link`, in a read-only UI SDK Input, unless you pass children. */
export function ShareDialogLink({ children = LINK, ...props }: ShareDialogLinkProps) {
  return <parts.Link {...props}>{children}</parts.Link>;
}

const pendingLabel =
  (label: string, pending: string): ShareDialogCreateProps["children"] =>
  (state) =>
    state.pending ? (
      <>
        <span aria-hidden="true" data-status-mark="" data-status="running" data-motion={state.motion} />
        {pending}
      </>
    ) : (
      label
    );

const CREATE = pendingLabel("Create link", "Creating link");
const REVOKE = pendingLabel("Stop sharing", "Stopping");

/** Calls `onCreateLink`. "Create link", or "Creating link" with a running mark while pending, unless you pass children. */
export function ShareDialogCreate({ children = CREATE, ...props }: ShareDialogCreateProps) {
  return <parts.Create {...props}>{children}</parts.Create>;
}

/** Copies the `link`. "Copy link", then "Copied" for 2 s, unless you pass children. */
export function ShareDialogCopy({
  children = ({ copied }) => (copied ? "Copied" : "Copy link"),
  ...props
}: ShareDialogCopyProps) {
  return <parts.Copy {...props}>{children}</parts.Copy>;
}

/** Calls `onRevoke`. "Stop sharing", or "Stopping" with a running mark while pending, unless you pass children. */
export function ShareDialogRevoke({ children = REVOKE, ...props }: ShareDialogRevokeProps) {
  return <parts.Revoke {...props}>{children}</parts.Revoke>;
}

/** Why the last create or revoke failed, unless you pass children. */
export function ShareDialogError({ children = ({ message }) => message, ...props }: ShareDialogErrorProps) {
  return <parts.Error {...props}>{children}</parts.Error>;
}

/** Closes the dialog and returns focus to the trigger. "Done", unless you pass children. */
export function ShareDialogClose({ children = "Done", ...props }: ShareDialogCloseProps) {
  return <parts.Close {...props}>{children}</parts.Close>;
}

const DEFAULT_PANEL = (
  <>
    <div data-share-dialog-header="">
      <ShareDialogTitle />
      <ShareDialogDescription />
    </div>
    <ShareDialogVisibility />
    <div data-share-dialog-link-row="">
      <ShareDialogCreate />
      <ShareDialogLink />
      <ShareDialogCopy />
    </div>
    <div data-share-dialog-footer="">
      <ShareDialogError />
      <ShareDialogRevoke />
      <ShareDialogClose />
    </div>
  </>
);

/** The dialog: its title, who can open the chat, the link and its actions, unless you pass children. */
export function ShareDialogContent({ children = DEFAULT_PANEL, render, ...props }: ShareDialogContentProps) {
  return (
    <parts.Content
      {...props}
      // A sheet sits in a full-screen viewport, which renders only while the content presents as one.
      render={(content, state) => {
        const element = renderElement("div", content, render, state);
        return state.presentation === "sheet" ? <parts.Viewport>{element}</parts.Viewport> : element;
      }}
    >
      {children}
    </parts.Content>
  );
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ShareDialogTrigger />
    <ShareDialogBackdrop />
    <ShareDialogContent />
  </>
);

/**
 * A Share button whose dialog chooses who can open the chat and shows the link the host makes, with Copy link and
 * Stop sharing. Any `children` replace the trigger and the dialog.
 */
export function ShareDialog({ children = DEFAULT_PARTS, ...props }: ShareDialogProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

"use client";

import { planPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from "@ui-sdk/react/progress";
import type { ComponentProps } from "react";

const parts = createParts(planPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  meta: "span",
  content: "div",
  progress: "div",
  list: "ol",
  item: "li",
  "item-icon": "span",
  "item-title": "span",
  "item-description": "span",
  accept: "button",
  outcome: "div",
  "outcome-icon": "span",
});

export type PlanProps = ComponentProps<typeof parts.Root>;

/**
 * The steps an agent plans to take, with how many are done and, while `onAccept` is set, an Accept button that
 * "Accepted" replaces. Any `children` replace the default parts.
 */
export function Plan({ children, ...props }: PlanProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const PlanTrigger = parts.Trigger;
export const PlanIcon = parts.Icon;
export const PlanContent = parts.Content;
export const PlanItemIcon = parts.ItemIcon;
export const PlanOutcomeIcon = parts.OutcomeIcon;

export type PlanTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else "Plan", unless you pass children. */
export function PlanTitle({ children = ({ title }) => title, ...props }: PlanTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type PlanMetaProps = ComponentProps<typeof parts.Meta>;

/** How many items are done, as "3 of 5", unless you pass children. */
export function PlanMeta({ children = ({ done, total }) => `${done} of ${total}`, ...props }: PlanMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type PlanProgressProps = ComponentProps<typeof parts.Progress>;

/**
 * A UI SDK Progress of the items done, labeled "3 of 5 steps", unless you pass children. Not in the default parts,
 * whose meta says the same.
 */
export function PlanProgress({
  children = ({ value, label }) => (
    <Progress value={value}>
      <ProgressLabel>{label}</ProgressLabel>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
  ...props
}: PlanProgressProps) {
  return <parts.Progress {...props}>{children}</parts.Progress>;
}

export type PlanListProps = ComponentProps<typeof parts.List>;

/** An item for each of the `items`, unless you pass children. */
export function PlanList({
  children = ({ items }) => items.map((item) => <PlanItem key={item.id} value={item.id} />),
  ...props
}: PlanListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type PlanItemProps = ComponentProps<typeof parts.Item>;

/** The item whose `id` is `value`. Without children, it shows the item's mark, title and description. */
export function PlanItem({ children, ...props }: PlanItemProps) {
  return <parts.Item {...props}>{children !== undefined ? children : DEFAULT_ITEM_PARTS}</parts.Item>;
}

export type PlanItemTitleProps = ComponentProps<typeof parts.ItemTitle>;

/** The item's `title`, unless you pass children. */
export function PlanItemTitle({ children = ({ title }) => title, ...props }: PlanItemTitleProps) {
  return <parts.ItemTitle {...props}>{children}</parts.ItemTitle>;
}

export type PlanItemDescriptionProps = ComponentProps<typeof parts.ItemDescription>;

/** The item's `description`, unless you pass children. Rendered only while the item has one. */
export function PlanItemDescription({
  children = ({ description }) => description,
  ...props
}: PlanItemDescriptionProps) {
  return <parts.ItemDescription {...props}>{children}</parts.ItemDescription>;
}

export type PlanAcceptProps = ComponentProps<typeof parts.Accept>;

/**
 * Calls `onAccept`. Reads "Accept plan", with a running mark while pending, unless you pass children. Rendered only
 * while `onAccept` is set and the plan isn't accepted.
 */
export function PlanAccept({ children = ACCEPT, ...props }: PlanAcceptProps) {
  return <parts.Accept {...props}>{children}</parts.Accept>;
}

export type PlanOutcomeProps = ComponentProps<typeof parts.Outcome>;

/** "Accepted" with a complete mark, in Accept's place once the plan is accepted, unless you pass children. */
export function PlanOutcome({ children = OUTCOME, ...props }: PlanOutcomeProps) {
  return <parts.Outcome {...props}>{children}</parts.Outcome>;
}

const ACCEPT = (
  <>
    <span data-kind-pending-mark="" data-status-mark="" data-status="running" aria-hidden="true" />
    Accept plan
  </>
);

const OUTCOME = (
  <>
    <PlanOutcomeIcon />
    Accepted
  </>
);

// Shared, so an update to the items doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_PARTS = (
  <>
    <PlanItemIcon />
    <PlanItemTitle />
    <PlanItemDescription />
  </>
);

const DEFAULT_PARTS = (
  <>
    <PlanTrigger>
      <PlanIcon />
      <PlanTitle />
      <PlanMeta />
    </PlanTrigger>
    <PlanContent>
      <PlanList />
    </PlanContent>
    <PlanAccept />
    <PlanOutcome />
  </>
);

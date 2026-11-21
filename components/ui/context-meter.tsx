"use client";

import { contextMeterPrimitive } from "@kind-ui/agent-ui/core";
import { Meter, MeterTrack, MeterValue } from "@ui-sdk/react/meter";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(contextMeterPrimitive, {
  root: "div",
  trigger: "button",
  value: "span",
  content: "div",
  title: "h2",
  description: "p",
  rows: "dl",
});

export type ContextMeterProps = ComponentProps<typeof parts.Root>;

/**
 * How much of the context window a conversation uses: a ring and its percentage, with details that open on hover,
 * keyboard focus and press. Any `children` replace the default parts.
 */
export function ContextMeter({ children = DEFAULT_PARTS, ...props }: ContextMeterProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export type ContextMeterTriggerProps = ComponentProps<typeof parts.Trigger>;

/** Opens the details. Holds the meter unless you pass children. */
export function ContextMeterTrigger({ children = DEFAULT_VALUE, ...props }: ContextMeterTriggerProps) {
  return <parts.Trigger {...props}>{children}</parts.Trigger>;
}

export type ContextMeterValueProps = ComponentProps<typeof parts.Value>;

/** UI SDK's Meter: a ring and the percentage, unless you pass children, a function that gets the Meter's props. */
export function ContextMeterValue({
  children = ({ label, ...meter }) => (
    <Meter {...meter} aria-label={label} data-agent-hidden="">
      <MeterTrack />
      <MeterValue />
    </Meter>
  ),
  ...props
}: ContextMeterValueProps) {
  return <parts.Value {...props}>{children}</parts.Value>;
}

export type ContextMeterContentProps = ComponentProps<typeof parts.Content>;

/** The details: the title, the value and each count, unless you pass children. Leaves focus on the trigger. */
export function ContextMeterContent({ children = DEFAULT_DETAILS, ...props }: ContextMeterContentProps) {
  return (
    <parts.Content initialFocus="none" {...props}>
      {children}
    </parts.Content>
  );
}

export type ContextMeterTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, unless you pass children. Names the details. */
export function ContextMeterTitle({ children = ({ label }) => label, ...props }: ContextMeterTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type ContextMeterDescriptionProps = ComponentProps<typeof parts.Description>;

/** Used and total tokens, unless you pass children. Describes the details. */
export function ContextMeterDescription({
  children = ({ countText }) => countText,
  ...props
}: ContextMeterDescriptionProps) {
  return <parts.Description {...props}>{children}</parts.Description>;
}

export type ContextMeterRowsProps = ComponentProps<typeof parts.Rows>;

/** Each count and the cost supplied, unless you pass children. Rendered only when there's one. */
export function ContextMeterRows({
  children = ({ rows }) =>
    rows.map(({ label, value }) => (
      <div key={label}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    )),
  ...props
}: ContextMeterRowsProps) {
  return <parts.Rows {...props}>{children}</parts.Rows>;
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_VALUE = <ContextMeterValue />;

const DEFAULT_DETAILS = (
  <>
    <ContextMeterTitle />
    <ContextMeterDescription />
    <ContextMeterRows />
  </>
);

const DEFAULT_PARTS = (
  <>
    <ContextMeterTrigger />
    <ContextMeterContent />
  </>
);

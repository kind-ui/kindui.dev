"use client";

import { daySeparatorPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(daySeparatorPrimitive, { root: "div", label: "time" });

export type DaySeparatorProps = ComponentProps<typeof parts.Root>;

/** A heading between days: the date on the server, and "Today", "Yesterday" or a weekday once in the browser. */
export function DaySeparator({ children = DEFAULT_LABEL, ...props }: DaySeparatorProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export type DaySeparatorLabelProps = ComponentProps<typeof parts.Label>;

/** The day as a `<time datetime>`: its words, unless you pass children. */
export function DaySeparatorLabel({ children = ({ label }) => label, ...props }: DaySeparatorLabelProps) {
  return <parts.Label {...props}>{children}</parts.Label>;
}

const DEFAULT_LABEL = <DaySeparatorLabel />;

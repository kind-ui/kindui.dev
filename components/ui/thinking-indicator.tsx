"use client";

import { thinkingIndicatorPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(thinkingIndicatorPrimitive, {
  root: "span",
  label: "span",
  dots: "span",
  dot: "span",
});

export type ThinkingIndicatorProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/** A polite status: three flowing dots, then its `label`, "Thinking…" by default. */
export function ThinkingIndicator(props: ThinkingIndicatorProps) {
  return (
    <parts.Root {...props}>
      <parts.Dots>
        <parts.Dot />
        <parts.Dot />
        <parts.Dot />
      </parts.Dots>
      <parts.Label>{({ label }) => label}</parts.Label>
    </parts.Root>
  );
}

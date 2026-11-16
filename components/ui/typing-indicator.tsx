import { typingIndicatorPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(typingIndicatorPrimitive, {
  root: "span",
  label: "span",
  dots: "span",
  dot: "span",
});

export type TypingIndicatorProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/** A polite status: three flowing dots in a bubble. Its `label`, "Typing" by default, is for assistive technology. */
export function TypingIndicator(props: TypingIndicatorProps) {
  return (
    <parts.Root {...props}>
      <parts.Label>{({ label }) => label}</parts.Label>
      <parts.Dots>
        <parts.Dot />
        <parts.Dot />
        <parts.Dot />
      </parts.Dots>
    </parts.Root>
  );
}

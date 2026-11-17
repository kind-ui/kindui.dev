"use client";

import { reasoningEffortPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import {
  KindSegmentedControl,
  KindSegmentedControlIndicator,
  KindSegmentedControlItem,
} from "./internal/segmented-control.js";

const parts = createParts(reasoningEffortPrimitive, { root: "div" });

export type ReasoningEffortProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  children?: ReactNode;
};

/**
 * How hard the model thinks, as a row of levels with a mark that slides to the chosen one. Any `children` replace the
 * mark and the levels, inside the Segmented Control.
 */
export function ReasoningEffort({ children, ...props }: ReasoningEffortProps) {
  return (
    <parts.Root {...props}>
      {({ levels, ...control }) => (
        // Hidden from agents, which use the Reasoning Effort's own `setValue`.
        <KindSegmentedControl {...control} data-agent-hidden="">
          {children !== undefined ? (
            children
          ) : (
            <>
              <ReasoningEffortIndicator />
              {levels.map((level) => (
                <ReasoningEffortItem key={level.value} value={level.value}>
                  {level.label}
                </ReasoningEffortItem>
              ))}
            </>
          )}
        </KindSegmentedControl>
      )}
    </parts.Root>
  );
}

/** The mark behind the chosen level. */
export const ReasoningEffortIndicator = KindSegmentedControlIndicator;

/** A level, whose `value` is what the host receives. */
export const ReasoningEffortItem = KindSegmentedControlItem;

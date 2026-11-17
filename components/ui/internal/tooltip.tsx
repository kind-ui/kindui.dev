"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip";
import { withKindClass } from "./kind-class.js";

export const KindTooltip = Tooltip;
export const KindTooltipTrigger = TooltipTrigger;
export const KindTooltipContent = withKindClass(
  TooltipContent,
  "z-50 rounded-[calc(var(--kind-radius)/2)] bg-[var(--kind-color-fg)] px-2 py-1 text-xs font-medium text-[var(--kind-color-surface)] shadow-md shadow-[color:var(--kind-color-shadow)]/10 [transform-origin:var(--transform-origin)]",
  "KindTooltipContent",
);

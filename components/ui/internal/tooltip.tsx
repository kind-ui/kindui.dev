"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip";
import { withKindClass } from "./kind-class.js";

export const KindTooltip = Tooltip;
export const KindTooltipTrigger = TooltipTrigger;
export const KindTooltipContent = withKindClass(
  TooltipContent,
  "z-50 rounded-[var(--kind-radius-md)] bg-[var(--kind-color-raised)] px-2 py-1 text-[length:var(--kind-text-xs)]/4 text-[var(--kind-color-fg)] shadow-[var(--kind-shadow-popover)] [transform-origin:var(--transform-origin)]",
  "KindTooltipContent",
);

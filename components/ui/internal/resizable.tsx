"use client";

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable";
import { withKindClass } from "./kind-class.js";

export const KindResizable = withKindClass(Resizable, "min-h-0 min-w-0", "KindResizable");
export const KindResizablePanel = withKindClass(ResizablePanel, "min-h-0", "KindResizablePanel");
export const KindResizableHandle = withKindClass(
  ResizableHandle,
  "relative w-px shrink-0 bg-[var(--kind-color-border)] outline-hidden transition-colors duration-[var(--kind-duration-fast)] ease-[var(--kind-ease)] data-[hovering]:bg-[var(--kind-color-ring)] data-[dragging]:bg-[var(--kind-color-ring)] focus-visible:bg-[var(--kind-color-ring)] focus-visible:[outline:var(--kind-focus-ring)] focus-visible:[outline-offset:var(--kind-focus-offset)] motion-reduce:transition-none forced-colors:bg-[CanvasText]",
  "KindResizableHandle",
);

"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import { withKindClass } from "./kind-class.js";

const step =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] text-[var(--kind-color-muted)] hover:bg-[var(--kind-color-hover)] hover:text-[var(--kind-color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-default data-disabled:opacity-40 data-disabled:hover:bg-[var(--kind-color-surface)] data-disabled:hover:text-[var(--kind-color-muted)] [&_svg]:size-4 rtl:[&_svg]:-scale-x-100";

export const KindCarousel = withKindClass(Carousel, "flex min-w-0 items-center gap-1", "KindCarousel");
export const KindCarouselViewport = withKindClass(
  CarouselViewport,
  "min-w-0 flex-1 rounded-[calc(var(--kind-radius)/2)] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)]",
  "KindCarouselViewport",
);
export const KindCarouselContent = withKindClass(CarouselContent, "flex gap-2", "KindCarouselContent");
export const KindCarouselItem = withKindClass(CarouselItem, "min-w-0", "KindCarouselItem");
export const KindCarouselPrevious = withKindClass(CarouselPrevious, step, "KindCarouselPrevious");
export const KindCarouselNext = withKindClass(CarouselNext, step, "KindCarouselNext");

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
  "inline-flex size-[var(--kind-control-height)] shrink-0 items-center justify-center rounded-[var(--kind-radius-full)] text-[var(--kind-color-muted)] hover:bg-[var(--kind-color-hover)] hover:text-[var(--kind-color-fg)] focus-visible:[outline:var(--kind-focus-ring)] focus-visible:[outline-offset:var(--kind-focus-offset)] data-disabled:cursor-default data-disabled:opacity-[var(--kind-disabled-opacity)] data-disabled:hover:bg-transparent data-disabled:hover:text-[var(--kind-color-muted)] [&_svg]:size-4 rtl:[&_svg]:-scale-x-100";

export const KindCarousel = withKindClass(Carousel, "flex min-w-0 items-center gap-1", "KindCarousel");
export const KindCarouselViewport = withKindClass(
  CarouselViewport,
  "min-w-0 flex-1 rounded-[var(--kind-radius-md)] [scrollbar-width:none] focus-visible:[outline:var(--kind-focus-ring)] focus-visible:[outline-offset:var(--kind-focus-offset-inset)]",
  "KindCarouselViewport",
);
export const KindCarouselContent = withKindClass(CarouselContent, "flex gap-2", "KindCarouselContent");
export const KindCarouselItem = withKindClass(CarouselItem, "min-w-0", "KindCarouselItem");
export const KindCarouselPrevious = withKindClass(CarouselPrevious, step, "KindCarouselPrevious");
export const KindCarouselNext = withKindClass(CarouselNext, step, "KindCarouselNext");

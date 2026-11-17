"use client";

import { suggestionPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import {
  KindCarousel,
  KindCarouselContent,
  KindCarouselItem,
  KindCarouselNext,
  KindCarouselPrevious,
  KindCarouselViewport,
} from "./internal/carousel.js";

const parts = createParts(suggestionPrimitive, { root: "div", item: "button" });

// Lucide "chevron-left" and "chevron-right", see THIRD_PARTY_NOTICES.md.
const CHEVRON_LEFT = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CHEVRON_RIGHT = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type SuggestionProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  children?: ReactNode;
};

/**
 * A row of prompts a person can send in one press. It scrolls sideways when the prompts don't fit, with Previous and
 * Next beside it. Any `children` replace the row and its buttons, inside the Carousel.
 */
export function Suggestion({ children, ...props }: SuggestionProps) {
  return (
    <parts.Root {...props}>
      {({ label, suggestions }) => (
        <KindCarousel aria-label={label} slidesPerPage="auto" dragFree>
          {children !== undefined ? (
            children
          ) : (
            <>
              <SuggestionViewport>
                {suggestions.map((suggestion) => (
                  <SuggestionItem key={suggestion.id} value={suggestion.id} />
                ))}
              </SuggestionViewport>
              <SuggestionControls />
            </>
          )}
        </KindCarousel>
      )}
    </parts.Root>
  );
}

/** The row that scrolls, holding the suggestions. */
export function SuggestionViewport({
  children,
  ...props
}: Omit<ComponentProps<typeof KindCarouselViewport>, "children"> & { children?: ReactNode }) {
  return (
    <KindCarouselViewport {...props}>
      <KindCarouselContent>{children}</KindCarouselContent>
    </KindCarouselViewport>
  );
}

export type SuggestionItemProps = ComponentProps<typeof parts.Item>;

/** A suggestion, whose `value` is its `id`. Reads its label and description unless you pass children. */
export function SuggestionItem({
  children = ({ label, description }) => (
    <>
      <span data-suggestion-label="">{label}</span>
      {description !== undefined && (
        <>
          {" "}
          <span data-suggestion-description="">{description}</span>
        </>
      )}
    </>
  ),
  ...props
}: SuggestionItemProps) {
  return (
    <KindCarouselItem>
      <parts.Item {...props}>{children}</parts.Item>
    </KindCarouselItem>
  );
}

/** Holds Previous and Next, unless you pass children, and hides them while every suggestion fits. */
export function SuggestionControls({
  children = (
    <>
      <SuggestionPrevious />
      <SuggestionNext />
    </>
  ),
  ...props
}: ComponentProps<"div">) {
  return (
    <div data-suggestion-controls="" {...props}>
      {children}
    </div>
  );
}

// Previous and Next are hidden from agents, which takes the Carousel out of their snapshot: an agent picks any
// suggestion by its id with the Suggestion's own `pick`, wherever it has scrolled.

/** Scrolls back to earlier suggestions. Put it in `SuggestionControls` to hide it while every suggestion fits. */
export function SuggestionPrevious({
  children = CHEVRON_LEFT,
  ...props
}: ComponentProps<typeof KindCarouselPrevious>) {
  return (
    <KindCarouselPrevious aria-label="Previous suggestions" data-agent-hidden="" {...props}>
      {children}
    </KindCarouselPrevious>
  );
}

/** Scrolls on to later suggestions. Put it in `SuggestionControls` to hide it while every suggestion fits. */
export function SuggestionNext({
  children = CHEVRON_RIGHT,
  ...props
}: ComponentProps<typeof KindCarouselNext>) {
  return (
    <KindCarouselNext aria-label="Next suggestions" data-agent-hidden="" {...props}>
      {children}
    </KindCarouselNext>
  );
}

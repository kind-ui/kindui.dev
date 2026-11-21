"use client";

import { inlineCitationPrimitive } from "@kind-ui/agent-ui/core";
import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";

// Every part is a `span`, so a citation is valid inside a paragraph.
const parts = createParts(inlineCitationPrimitive, {
  root: "span",
  trigger: "button",
  content: "span",
  carousel: "span",
  item: "span",
  link: "a",
  icon: "span",
  host: "span",
  "source-title": "span",
  snippet: "span",
  index: "span",
});

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

export type InlineCitationProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  children?: ReactNode;
};

/**
 * A marker in running text for the sources a sentence came from, with a card that opens on hover, keyboard focus and
 * press. More than one source pages in the card. Any `children` replace the marker and the card.
 */
export function InlineCitation({ children, ...props }: InlineCitationProps) {
  return (
    <parts.Root {...props}>
      {({ ids }) =>
        children !== undefined ? (
          children
        ) : (
          <>
            <InlineCitationTrigger />
            <InlineCitationContent>
              {ids.length > 1 ? <InlineCitationCarousel /> : ids[0] && <InlineCitationItem value={ids[0]} />}
            </InlineCitationContent>
          </>
        )
      }
    </parts.Root>
  );
}

export type InlineCitationTriggerProps = ComponentProps<typeof parts.Trigger>;

/** The marker, which opens the card. Reads the `label` unless you pass children. */
export function InlineCitationTrigger({
  children = ({ label }) => label,
  ...props
}: InlineCitationTriggerProps) {
  return <parts.Trigger {...props}>{children}</parts.Trigger>;
}

export type InlineCitationContentProps = ComponentProps<typeof parts.Content>;

/** The card. Leaves focus on the marker when it opens. */
export function InlineCitationContent(props: InlineCitationContentProps) {
  return <parts.Content initialFocus="none" {...props} />;
}

export type InlineCitationCarouselProps = Omit<ComponentProps<typeof parts.Carousel>, "children"> & {
  children?: ReactNode;
};

/**
 * UI SDK's Carousel, a slide per source with Previous, the page and Next below. Rendered only for more than one
 * source. Any `children` replace the slides and controls, inside the Carousel.
 */
export function InlineCitationCarousel({ children, ...props }: InlineCitationCarouselProps) {
  return (
    <parts.Carousel {...props}>
      {({ controller, defaultPage, ids }) => (
        <Carousel
          render={<span />}
          controller={controller}
          defaultPage={defaultPage}
          drag={false}
          aria-label="Sources"
        >
          {children !== undefined ? (
            children
          ) : (
            <>
              <CarouselViewport render={<span />}>
                <CarouselContent render={<span />}>
                  {ids.map((id) => (
                    <CarouselItem key={id} render={<span />}>
                      <InlineCitationItem value={id} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </CarouselViewport>
              <span data-inline-citation-controls="">
                <InlineCitationPrevious />
                <InlineCitationIndex />
                <InlineCitationNext />
              </span>
            </>
          )}
        </Carousel>
      )}
    </parts.Carousel>
  );
}

export type InlineCitationItemProps = ComponentProps<typeof parts.Item>;

/**
 * The source whose `id` is `value`. Without children, it shows its icon, title and host name, a link when its `url`
 * is safe, then its snippet.
 */
export function InlineCitationItem({ children, ...props }: InlineCitationItemProps) {
  return <parts.Item {...props}>{children !== undefined ? children : DEFAULT_ITEM_PARTS}</parts.Item>;
}

/** Links to the source's `url` in a new tab; an `a` without `href`, which is text, when the URL isn't safe. */
export const InlineCitationLink = parts.Link;

export type InlineCitationIconProps = ComponentProps<typeof parts.Icon>;

/** A UI SDK Avatar of the source's `favicon`, showing a link glyph until it loads or without one. */
export function InlineCitationIcon({
  children = ({ favicon }) => (
    <Avatar>
      {favicon ? <AvatarImage src={favicon} alt="" /> : null}
      <AvatarFallback />
    </Avatar>
  ),
  ...props
}: InlineCitationIconProps) {
  return <parts.Icon {...props}>{children}</parts.Icon>;
}

export type InlineCitationHostProps = ComponentProps<typeof parts.Host>;

/** The host name of the source's `url`, unless you pass children. Rendered only with a safe `url`. */
export function InlineCitationHost({ children = ({ host }) => host, ...props }: InlineCitationHostProps) {
  return <parts.Host {...props}>{children}</parts.Host>;
}

export type InlineCitationSourceTitleProps = ComponentProps<typeof parts.SourceTitle>;

/** The source's `title`, unless you pass children. */
export function InlineCitationSourceTitle({
  children = ({ title }) => title,
  ...props
}: InlineCitationSourceTitleProps) {
  return <parts.SourceTitle {...props}>{children}</parts.SourceTitle>;
}

export type InlineCitationSnippetProps = ComponentProps<typeof parts.Snippet>;

/** The source's `snippet`, unless you pass children. Rendered only with a `snippet`. */
export function InlineCitationSnippet({
  children = ({ snippet }) => snippet,
  ...props
}: InlineCitationSnippetProps) {
  return <parts.Snippet {...props}>{children}</parts.Snippet>;
}

export type InlineCitationIndexProps = ComponentProps<typeof parts.Index>;

/** Which source the card shows, like "1 of 3", unless you pass children. */
export function InlineCitationIndex({ children = ({ text }) => text, ...props }: InlineCitationIndexProps) {
  return <parts.Index {...props}>{children}</parts.Index>;
}

// Previous and Next are hidden from agents, which takes the Carousel out of their snapshot: an agent pages with the
// citation's own `next` and `previous`.

/** Shows the previous source. */
export function InlineCitationPrevious({
  children = CHEVRON_LEFT,
  ...props
}: ComponentProps<typeof CarouselPrevious>) {
  return (
    <CarouselPrevious aria-label="Previous source" data-agent-hidden="" data-kind-icon-button="" {...props}>
      {children}
    </CarouselPrevious>
  );
}

/** Shows the next source. */
export function InlineCitationNext({
  children = CHEVRON_RIGHT,
  ...props
}: ComponentProps<typeof CarouselNext>) {
  return (
    <CarouselNext aria-label="Next source" data-agent-hidden="" data-kind-icon-button="" {...props}>
      {children}
    </CarouselNext>
  );
}

// Shared, so an update to the sources doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_PARTS = (
  <>
    <InlineCitationLink>
      <InlineCitationIcon />
      <InlineCitationSourceTitle />
      <InlineCitationHost />
    </InlineCitationLink>
    <InlineCitationSnippet />
  </>
);

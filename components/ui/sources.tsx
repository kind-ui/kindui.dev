"use client";

import { sourcesPrimitive } from "@kind-ui/agent-ui/core";
import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(sourcesPrimitive, {
  root: "div",
  trigger: "button",
  content: "div",
  list: "ul",
  item: "li",
  link: "a",
  icon: "span",
  title: "span",
  host: "span",
  snippet: "p",
});

export type SourcesProps = ComponentProps<typeof parts.Root>;

/**
 * The sources a response used, as "Used N sources" that opens a list of links. Any `children` replace the default
 * trigger and content.
 */
export function Sources({ children, ...props }: SourcesProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const SourcesContent = parts.Content;
export const SourcesLink = parts.Link;

export type SourcesTriggerProps = ComponentProps<typeof parts.Trigger>;

/** Shows and hides the list. Reads the `label`, else "Used N sources", unless you pass children. */
export function SourcesTrigger({ children = ({ label }) => label, ...props }: SourcesTriggerProps) {
  return <parts.Trigger {...props}>{children}</parts.Trigger>;
}

export type SourcesListProps = ComponentProps<typeof parts.List>;

/** An item for each of the `sources`, unless you pass children. */
export function SourcesList({
  children = ({ sources }) => sources.map((source) => <SourcesItem key={source.id} value={source.id} />),
  ...props
}: SourcesListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type SourcesItemProps = ComponentProps<typeof parts.Item>;

/** The source whose `id` is `value`. Without children, it shows a link to it and its snippet. */
export function SourcesItem({ children, ...props }: SourcesItemProps) {
  return <parts.Item {...props}>{children !== undefined ? children : DEFAULT_ITEM_PARTS}</parts.Item>;
}

export type SourcesIconProps = ComponentProps<typeof parts.Icon>;

/** A UI SDK Avatar of the source's `favicon`, showing a link glyph until it loads or without one. */
export function SourcesIcon({
  children = ({ favicon }) => (
    <Avatar>
      {favicon ? <AvatarImage src={favicon} alt="" /> : null}
      <AvatarFallback />
    </Avatar>
  ),
  ...props
}: SourcesIconProps) {
  return <parts.Icon {...props}>{children}</parts.Icon>;
}

export type SourcesTitleProps = ComponentProps<typeof parts.Title>;

/** The source's `title`, unless you pass children. */
export function SourcesTitle({ children = ({ title }) => title, ...props }: SourcesTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type SourcesHostProps = ComponentProps<typeof parts.Host>;

/** The host name of the source's `url`, unless you pass children. Rendered only with a safe `url`. */
export function SourcesHost({ children = ({ host }) => host, ...props }: SourcesHostProps) {
  return <parts.Host {...props}>{children}</parts.Host>;
}

export type SourcesSnippetProps = ComponentProps<typeof parts.Snippet>;

/** The source's `snippet`, unless you pass children. Rendered only with a `snippet`. */
export function SourcesSnippet({ children = ({ snippet }) => snippet, ...props }: SourcesSnippetProps) {
  return <parts.Snippet {...props}>{children}</parts.Snippet>;
}

// Shared, so an update to the sources doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_PARTS = (
  <>
    <SourcesLink>
      <SourcesIcon />
      <SourcesTitle />
      <SourcesHost />
    </SourcesLink>
    <SourcesSnippet />
  </>
);

const DEFAULT_PARTS = (
  <>
    <SourcesTrigger />
    <SourcesContent>
      <SourcesList />
    </SourcesContent>
  </>
);

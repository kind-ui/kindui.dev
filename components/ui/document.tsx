"use client";

import { documentPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { CodeBlock } from "./code-block.js";
import {
  KindScrollArea,
  KindScrollAreaContent,
  KindScrollAreaScrollbar,
  KindScrollAreaThumb,
  KindScrollAreaViewport,
} from "./internal/scroll-area.js";
import { KindToolbar, KindToolbarButton } from "./internal/toolbar.js";
import { Markdown } from "./markdown.js";

const parts = createParts(documentPrimitive, {
  root: "div",
  header: "div",
  title: "span",
  meta: "span",
  toolbar: "div",
  copy: "span",
  download: "span",
  body: "div",
  content: "div",
  expand: "button",
});

export type DocumentProps = ComponentProps<typeof parts.Root>;

/**
 * A document as a card: its title, kind and size, Copy and Download, and a preview that expands. Any `children`
 * replace the default header and body.
 */
export function Document({ children, ...props }: DocumentProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

/** Holds the title, the meta line and the toolbar. */
export const DocumentHeader = parts.Header;

export type DocumentTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, unless you pass children. */
export function DocumentTitle({ children = ({ label }) => label, ...props }: DocumentTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type DocumentMetaProps = ComponentProps<typeof parts.Meta>;

/** What the document is and its size, like "Markdown · 2.4 kB", unless you pass children. */
export function DocumentMeta({ children = ({ meta }) => meta, ...props }: DocumentMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type DocumentToolbarProps = ComponentProps<typeof parts.Toolbar>;

/** A `KindToolbar` with Copy and a Download for each of the `downloads`, unless you pass children. */
export function DocumentToolbar({
  children = ({ downloads, canDownload }) => (
    <KindToolbar aria-label="Document actions">
      <DocumentCopy />
      {canDownload &&
        (downloads.length > 1 ? (
          downloads.map(({ id }) => <DocumentDownload key={id} value={id} />)
        ) : (
          <DocumentDownload value={downloads[0]?.id} />
        ))}
    </KindToolbar>
  ),
  ...props
}: DocumentToolbarProps) {
  return <parts.Toolbar {...props}>{children}</parts.Toolbar>;
}

export type DocumentCopyProps = ComponentProps<typeof parts.Copy>;

/** Copies the `content`. Wraps a `KindToolbarButton` named "Copy", unless you pass children. */
export function DocumentCopy({ children = COPY_BUTTON, ...props }: DocumentCopyProps) {
  return <parts.Copy {...props}>{children}</parts.Copy>;
}

export type DocumentDownloadProps = ComponentProps<typeof parts.Download>;

/**
 * Calls `onDownload` with its `value`, a download's `id`. Wraps a `KindToolbarButton` named "Download", or showing
 * the download's `label` when there are several, unless you pass children.
 */
export function DocumentDownload({
  children = ({ label }) => (
    <KindToolbarButton aria-label={label ? `Download ${label}` : "Download"}>{label}</KindToolbarButton>
  ),
  ...props
}: DocumentDownloadProps) {
  return <parts.Download {...props}>{children}</parts.Download>;
}

export type DocumentBodyProps = ComponentProps<typeof parts.Body>;

/** The preview: a `KindScrollArea` holding the content, followed by Show more, unless you pass children. */
export function DocumentBody({
  children = ({ streaming }) => (
    <>
      <KindScrollArea stickToEnd={streaming}>{SCROLL_CONTENT}</KindScrollArea>
      <DocumentExpand />
    </>
  ),
  ...props
}: DocumentBodyProps) {
  return <parts.Body {...props}>{children}</parts.Body>;
}

export type DocumentContentProps = ComponentProps<typeof parts.Content>;

/**
 * The `content` as its `format` says: Markdown, a Code Block without its header, or wrapped plain text, unless you
 * pass children.
 */
export function DocumentContent({
  children = ({ format, content, language, highlight, streaming }) =>
    format === "markdown" ? (
      <Markdown source={content} streaming={streaming} highlight={highlight} />
    ) : format === "code" ? (
      <CodeBlock
        header={false}
        code={content}
        language={language}
        streaming={streaming}
        highlight={highlight}
      />
    ) : (
      <pre>{content}</pre>
    ),
  ...props
}: DocumentContentProps) {
  return <parts.Content {...props}>{children}</parts.Content>;
}

export type DocumentExpandProps = ComponentProps<typeof parts.Expand>;

/** "Show more", or "Show less" while expanded. Rendered only while the content overflows the preview. */
export function DocumentExpand({ children = ({ label }) => label, ...props }: DocumentExpandProps) {
  return <parts.Expand {...props}>{children}</parts.Expand>;
}

const COPY_BUTTON = <KindToolbarButton aria-label="Copy" />;

// Shared, so a streamed chunk doesn't render the scroll area's viewport and scrollbar again.
const SCROLL_CONTENT = (
  <>
    <KindScrollAreaViewport>
      <KindScrollAreaContent>
        <DocumentContent />
      </KindScrollAreaContent>
    </KindScrollAreaViewport>
    <KindScrollAreaScrollbar>
      <KindScrollAreaThumb />
    </KindScrollAreaScrollbar>
  </>
);

const DEFAULT_PARTS = (
  <>
    <DocumentHeader>
      <DocumentTitle />
      <DocumentMeta />
      <DocumentToolbar />
    </DocumentHeader>
    <DocumentBody />
  </>
);

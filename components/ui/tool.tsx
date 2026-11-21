"use client";

import { toolPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { CodeBlock } from "./code-block.js";
import { Confirmation } from "./confirmation.js";
import { Markdown } from "./markdown.js";

const parts = createParts(toolPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  meta: "span",
  approval: "span",
  content: "div",
  input: "div",
  "input-copy": "button",
  output: "div",
  "output-copy": "button",
  error: "p",
});

export type ToolProps = ComponentProps<typeof parts.Root>;

/**
 * A tool call as a step: its name and status, then its input, output or error, and its approval. Any `children`
 * replace the default parts.
 */
export function Tool({ children, ...props }: ToolProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const ToolTrigger = parts.Trigger;
export const ToolIcon = parts.Icon;
export const ToolContent = parts.Content;
export const ToolInputCopy = parts.InputCopy;
export const ToolOutputCopy = parts.OutputCopy;

export type ToolTitleProps = ComponentProps<typeof parts.Title>;

/** The tool's name, or the `label`, unless you pass children. */
export function ToolTitle({ children = ({ title }) => title, ...props }: ToolTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type ToolApprovalProps = ComponentProps<typeof parts.Approval>;

/**
 * A Confirmation for the call's approval while it has one: Approve and Deny while `onApprove` and `onDeny` are
 * set and the request is open, then what was decided. Pass children to render it yourself.
 */
export function ToolApproval({
  children = (confirmation) => <Confirmation {...confirmation} />,
  ...props
}: ToolApprovalProps) {
  return <parts.Approval {...props}>{children}</parts.Approval>;
}

export type ToolInputProps = ComponentProps<typeof parts.Input>;

/**
 * The input as code, labeled "Partial" while it streams, with its copy button, unless you pass children. The code
 * block is named by the tool, like "search_docs input".
 */
export function ToolInput({
  children = ({ label, code, streaming, highlight }) => (
    <>
      <div data-tool-heading="">
        Input
        <span data-tool-badge="" data-kind-badge="">
          Partial
        </span>
        <ToolInputCopy />
      </div>
      <CodeBlock
        aria-label={label}
        header={false}
        code={code}
        language="json"
        streaming={streaming}
        highlight={highlight}
      />
    </>
  ),
  ...props
}: ToolInputProps) {
  return <parts.Input {...props}>{children}</parts.Input>;
}

export type ToolOutputProps = ComponentProps<typeof parts.Output>;

/**
 * The output, once there is one: text as markdown, any other value as code. Labeled "Preliminary" until it's final,
 * with its copy button, unless you pass children. The code block is named by the tool, like "search_docs output".
 */
export function ToolOutput({
  children = ({ label, kind, text, preliminary, highlight }) => (
    <>
      <div data-tool-heading="">
        Output
        <span data-tool-badge="" data-kind-badge="">
          Preliminary
        </span>
        <ToolOutputCopy />
      </div>
      {kind === "markdown" ? (
        <Markdown source={text} streaming={preliminary} highlight={highlight} />
      ) : (
        <CodeBlock
          aria-label={label}
          header={false}
          code={text}
          language="json"
          streaming={preliminary}
          highlight={highlight}
        />
      )}
    </>
  ),
  ...props
}: ToolOutputProps) {
  return <parts.Output {...props}>{children}</parts.Output>;
}

export type ToolMetaProps = ComponentProps<typeof parts.Meta>;

/** How long the call took, as "N s", unless you pass children. Rendered only with `durationSeconds`. */
export function ToolMeta({ children = ({ duration }) => duration, ...props }: ToolMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type ToolErrorProps = ComponentProps<typeof parts.Error>;

/** The `error` message while the status is `error`, unless you pass children. */
export function ToolError({ children = ({ message }) => message, ...props }: ToolErrorProps) {
  return <parts.Error {...props}>{children}</parts.Error>;
}

// Shared, so an update to the call doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ToolTrigger>
      <ToolIcon />
      <ToolTitle />
      <ToolMeta />
    </ToolTrigger>
    <ToolContent>
      <ToolInput />
      <ToolOutput />
      <ToolError />
    </ToolContent>
    <ToolApproval />
  </>
);

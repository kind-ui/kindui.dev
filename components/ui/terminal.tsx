"use client";

import { type AnsiSpan, terminalPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, memo } from "react";

const parts = createParts(terminalPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  exit: "span",
  meta: "span",
  content: "div",
  command: "div",
  copy: "button",
  viewport: "div",
  output: "div",
  line: "div",
  jump: "button",
});

export type TerminalProps = ComponentProps<typeof parts.Root>;

/**
 * A command and its output as a step: the command, its exit code and duration, then the output with its ANSI colors,
 * following its end while it streams. Any `children` replace the default parts.
 */
export function Terminal({ children, ...props }: TerminalProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const TerminalTrigger = parts.Trigger;
export const TerminalIcon = parts.Icon;
export const TerminalContent = parts.Content;
export const TerminalCopy = parts.Copy;
/** Scrolls the output and follows its end. Holds a `TerminalOutput`. */
export const TerminalViewport = parts.Viewport;

export type TerminalTitleProps = ComponentProps<typeof parts.Title>;

/** The command, or the `label`, unless you pass children. */
export function TerminalTitle({ children = ({ title }) => title, ...props }: TerminalTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type TerminalExitProps = ComponentProps<typeof parts.Exit>;

/** "exit N" once there's an exit code, unless you pass children. */
export function TerminalExit({ children = ({ text }) => text, ...props }: TerminalExitProps) {
  return <parts.Exit {...props}>{children}</parts.Exit>;
}

export type TerminalMetaProps = ComponentProps<typeof parts.Meta>;

/** The duration as "N s", unless you pass children. */
export function TerminalMeta({ children = ({ duration }) => duration, ...props }: TerminalMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type TerminalCommandProps = ComponentProps<typeof parts.Command>;

/**
 * The command after its prompt, which the stylesheet draws, unless you pass children. Present only while a `label`
 * replaces the command as the title.
 */
export function TerminalCommand({ children = ({ command }) => command, ...props }: TerminalCommandProps) {
  return <parts.Command {...props}>{children}</parts.Command>;
}

export type TerminalOutputProps = ComponentProps<typeof parts.Output>;

/** A `TerminalLine` for each line in view, unless you pass children. */
export function TerminalOutput({
  children = ({ rows }) => rows.map((row) => <TerminalLine key={row.index} index={row.index} />),
  ...props
}: TerminalOutputProps) {
  return <parts.Output {...props}>{children}</parts.Output>;
}

const spanStyle = (span: AnsiSpan) =>
  span.fg || span.bg ? { color: span.fg, backgroundColor: span.bg } : undefined;

export type TerminalLineProps = ComponentProps<typeof parts.Line>;

/**
 * One line of output, its `index`th, as styled spans, unless you pass children. Memoized, so a line that moved or
 * didn't change isn't rendered again when the lines in view change.
 */
export const TerminalLine = memo(function TerminalLine({
  value,
  children = ({ spans }) =>
    spans.map((span, index) => (
      <span
        key={index}
        style={spanStyle(span)}
        data-bold={span.bold ? "" : undefined}
        data-dim={span.dim ? "" : undefined}
        data-italic={span.italic ? "" : undefined}
        data-underline={span.underline ? "" : undefined}
        data-strike={span.strike ? "" : undefined}
      >
        {span.text}
      </span>
    )),
  ...props
}: TerminalLineProps) {
  return (
    <parts.Line value={value ?? String(props.index)} {...props}>
      {children}
    </parts.Line>
  );
});

export type TerminalJumpProps = ComponentProps<typeof parts.Jump>;

/** Shown while the reader has scrolled away from the end. "Jump to latest", unless you pass children. */
export function TerminalJump({ children = "Jump to latest", ...props }: TerminalJumpProps) {
  return <parts.Jump {...props}>{children}</parts.Jump>;
}

// Shared, so new output doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <TerminalTrigger>
      <TerminalIcon />
      <TerminalTitle />
      <TerminalExit />
      <TerminalMeta />
    </TerminalTrigger>
    <TerminalContent>
      <div data-terminal-screen="" data-kind-code="">
        <div data-terminal-header="">
          <TerminalCommand />
          <TerminalCopy />
        </div>
        <TerminalViewport>
          <TerminalOutput />
        </TerminalViewport>
        <TerminalJump />
      </div>
    </TerminalContent>
  </>
);

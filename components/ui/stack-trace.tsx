"use client";

import { stackTracePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(stackTracePrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  content: "div",
  message: "div",
  copy: "button",
  list: "ol",
  frame: "li",
  "frame-open": "button",
  "frame-function": "span",
  "frame-location": "span",
  group: "li",
  library: "button",
  "library-frames": "ol",
});

export type StackTraceProps = ComponentProps<typeof parts.Root>;

/**
 * An error as a step: its name and message, then its frames, with consecutive library frames folded into one row.
 * Any `children` replace the default parts.
 */
export function StackTrace({ children, ...props }: StackTraceProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const StackTraceTrigger = parts.Trigger;
export const StackTraceIcon = parts.Icon;
export const StackTraceContent = parts.Content;
export const StackTraceCopy = parts.Copy;
/** The frame's function and location as a button, rendered only while `onOpenFrame` is set. */
export const StackTraceFrameOpen = parts.FrameOpen;

export type StackTraceTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else the message's first line with the error's name set apart, unless you pass children. */
export function StackTraceTitle({
  children = ({ name, summary }) =>
    name ? (
      <>
        <span data-stack-trace-name="">{name}</span>: {summary}
      </>
    ) : (
      summary
    ),
  ...props
}: StackTraceTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type StackTraceMessageProps = ComponentProps<typeof parts.Message>;

/** The message's lines after its first, unless you pass children. Rendered only while there are any. */
export function StackTraceMessage({ children = ({ text }) => text, ...props }: StackTraceMessageProps) {
  return <parts.Message {...props}>{children}</parts.Message>;
}

export type StackTraceListProps = ComponentProps<typeof parts.List>;

/** A frame for each app frame and a group for each run of library frames, unless you pass children. */
export function StackTraceList({
  children = ({ rows }) =>
    rows.map((row) =>
      row.type === "frame" ? (
        <StackTraceFrame key={row.index} value={String(row.index)} />
      ) : (
        <StackTraceGroup key={`library-${row.start}`} value={String(row.start)} />
      ),
    ),
  ...props
}: StackTraceListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type StackTraceFrameProps = ComponentProps<typeof parts.Frame>;

/**
 * The frame whose index is `value`. Without children, it shows the frame's function and location, inside a
 * `StackTraceFrameOpen` while `onOpenFrame` is set.
 */
export function StackTraceFrame({
  children = ({ canOpen }) => (canOpen ? DEFAULT_FRAME_OPEN : DEFAULT_FRAME_TEXT),
  ...props
}: StackTraceFrameProps) {
  return <parts.Frame {...props}>{children}</parts.Frame>;
}

export type StackTraceFrameFunctionProps = ComponentProps<typeof parts.FrameFunction>;

/** The frame's function, unless you pass children. */
export function StackTraceFrameFunction({
  children = ({ fn }) => fn,
  ...props
}: StackTraceFrameFunctionProps) {
  return <parts.FrameFunction {...props}>{children}</parts.FrameFunction>;
}

export type StackTraceFrameLocationProps = ComponentProps<typeof parts.FrameLocation>;

/** The frame's file, shortened to its last two segments, with line and column, unless you pass children. */
export function StackTraceFrameLocation({
  children = ({ location }) => location,
  ...props
}: StackTraceFrameLocationProps) {
  return <parts.FrameLocation {...props}>{children}</parts.FrameLocation>;
}

export type StackTraceGroupProps = ComponentProps<typeof parts.Group>;

/**
 * The library frames that start at the index `value`, folded into one row. Without children, it shows a
 * `StackTraceLibrary` toggle and the frames.
 */
export function StackTraceGroup({ children, ...props }: StackTraceGroupProps) {
  return <parts.Group {...props}>{children !== undefined ? children : DEFAULT_GROUP_PARTS}</parts.Group>;
}

export type StackTraceLibraryProps = ComponentProps<typeof parts.Library>;

/** Shows or folds library frames. "N library frames", unless you pass children. */
export function StackTraceLibrary({
  children = ({ count }) => `${count} library ${count === 1 ? "frame" : "frames"}`,
  ...props
}: StackTraceLibraryProps) {
  return <parts.Library {...props}>{children}</parts.Library>;
}

export type StackTraceLibraryFramesProps = ComponentProps<typeof parts.LibraryFrames>;

/** A group's frames, which open in place, unless you pass children. */
export function StackTraceLibraryFrames({
  children = ({ indexes }) => indexes.map((index) => <StackTraceFrame key={index} value={String(index)} />),
  ...props
}: StackTraceLibraryFramesProps) {
  return <parts.LibraryFrames {...props}>{children}</parts.LibraryFrames>;
}

// Shared, so a copy or a toggle doesn't render the default parts' wrappers again.
const DEFAULT_FRAME_TEXT = (
  <>
    <StackTraceFrameFunction />
    <StackTraceFrameLocation />
  </>
);

const DEFAULT_FRAME_OPEN = <StackTraceFrameOpen>{DEFAULT_FRAME_TEXT}</StackTraceFrameOpen>;

const DEFAULT_GROUP_PARTS = (
  <>
    <StackTraceLibrary />
    <StackTraceLibraryFrames />
  </>
);

const DEFAULT_PARTS = (
  <>
    <StackTraceTrigger>
      <StackTraceIcon />
      <StackTraceTitle />
    </StackTraceTrigger>
    <StackTraceContent>
      <div data-stack-trace-panel="">
        <StackTraceMessage />
        <StackTraceList />
        <StackTraceCopy />
      </div>
    </StackTraceContent>
  </>
);

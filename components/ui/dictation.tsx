"use client";

import {
  type DictationStatusState,
  type DictationWaveformState,
  dictationButtonPrimitive,
} from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(dictationButtonPrimitive, {
  root: "div",
  start: "button",
  waveform: "span",
  bar: "span",
  status: "span",
  "status-icon": "span",
  stop: "button",
  cancel: "button",
});

export type DictationProps = ComponentProps<typeof parts.Root>;
export type DictationWaveformProps = ComponentProps<typeof parts.Waveform>;
export type DictationStatusProps = ComponentProps<typeof parts.Status>;

/** The mic button, shown while idle or after an error. */
export const DictationStart = parts.Start;
/** Stop: ends the dictation and sends its final text. */
export const DictationStop = parts.Stop;
/** Cancel: ends the dictation and sends nothing. */
export const DictationCancel = parts.Cancel;
/** One bar of the waveform, whose `value` is its index. */
export const DictationBar = parts.Bar;
/** The mark beside the status: running while transcribing, an error after one. */
export const DictationStatusIcon = parts.StatusIcon;

const BARS = ({ bars }: DictationWaveformState) =>
  Array.from({ length: bars }, (_, i) => <DictationBar key={i} value={String(i)} />);

/** The waveform, one `DictationBar` per level unless you pass children. Shown while listening. */
export function DictationWaveform({ children = BARS, ...props }: DictationWaveformProps) {
  return <parts.Waveform {...props}>{children}</parts.Waveform>;
}

const STATUS = ({ text }: DictationStatusState) => (
  <>
    <DictationStatusIcon />
    <span data-dictation-text="">{text}</span>
  </>
);

/** "Listening" or the words heard so far, "Transcribing", or the error, with its mark unless you pass children. */
export function DictationStatus({ children = STATUS, ...props }: DictationStatusProps) {
  return <parts.Status {...props}>{children}</parts.Status>;
}

/**
 * A mic button that turns speech into text through a host's `source`. While listening it shows a waveform, the words
 * heard so far, Cancel and Stop, in the same box. Any `children` replace those parts.
 */
export function Dictation({ children, ...props }: DictationProps) {
  return (
    <parts.Root {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <DictationWaveform />
          <DictationStatus />
          <DictationStart />
          <DictationCancel />
          <DictationStop />
        </>
      )}
    </parts.Root>
  );
}

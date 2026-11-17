"use client";

import { type TranscriptSearchState, transcriptPrimitive } from "@kind-ui/agent-ui/core";
import { Input, InputClear, InputGroup } from "@ui-sdk/react/input";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, Fragment, memo } from "react";

const parts = createParts(transcriptPrimitive, {
  root: "div",
  search: "div",
  count: "span",
  viewport: "div",
  list: "div",
  segment: "div",
  speaker: "span",
  seek: "button",
  time: "span",
  text: "p",
  word: "span",
});

export type TranscriptProps = ComponentProps<typeof parts.Root>;

/**
 * Speaker-labelled, timed segments with a search, marking the segment and word playing at `currentTime`. Any
 * `children` replace the default parts.
 */
export function Transcript({ children, ...props }: TranscriptProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

/** A time as a button that seeks to its segment, rendered only while `onSeek` is set. Holds a `TranscriptTime`. */
export const TranscriptSeek = parts.Seek;
/** Scrolls the segments. Holds a `TranscriptList`. */
export const TranscriptViewport = parts.Viewport;

const marked = (segments: { text: string; match: boolean }[]) =>
  segments.map((segment, index) => (segment.match ? <mark key={index}>{segment.text}</mark> : segment.text));

const searchField = ({ controller, defaultValue, label }: TranscriptSearchState) => (
  <InputGroup>
    <Input
      type="search"
      controller={controller}
      defaultValue={defaultValue}
      aria-label={label}
      placeholder="Search"
      data-agent-hidden=""
    />
    <TranscriptCount />
    <InputClear aria-label="Clear search" data-agent-hidden="" />
  </InputGroup>
);

export type TranscriptSearchProps = ComponentProps<typeof parts.Search>;

/** A search field with the match count and a clear button, unless you pass children. Pass the state to UI SDK Input. */
export function TranscriptSearch({ children = searchField, ...props }: TranscriptSearchProps) {
  return <parts.Search {...props}>{children}</parts.Search>;
}

export type TranscriptCountProps = ComponentProps<typeof parts.Count>;

/** "3 matches" while there's a search, unless you pass children. */
export function TranscriptCount({ children = ({ text }) => text, ...props }: TranscriptCountProps) {
  return <parts.Count {...props}>{children}</parts.Count>;
}

export type TranscriptListProps = ComponentProps<typeof parts.List>;

/** A `TranscriptSegment` for each segment in view, unless you pass children. */
export function TranscriptList({
  children = ({ rows }) => rows.map((row) => <TranscriptSegment key={row.key} value={row.key} />),
  ...props
}: TranscriptListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

export type TranscriptSegmentProps = ComponentProps<typeof parts.Segment>;

/**
 * The segment whose id is `value`: its speaker, its time, and its text, unless you pass children. Memoized, so
 * segments playback doesn't reach aren't rendered again.
 */
export const TranscriptSegment = memo(function TranscriptSegment({
  children = ({ canSeek }) => (
    <>
      <div data-transcript-header="">
        <TranscriptSpeaker />
        {canSeek ? (
          <TranscriptSeek>
            <TranscriptTime />
          </TranscriptSeek>
        ) : (
          <TranscriptTime />
        )}
      </div>
      <TranscriptText />
    </>
  ),
  ...props
}: TranscriptSegmentProps) {
  return <parts.Segment {...props}>{children}</parts.Segment>;
});

export type TranscriptSpeakerProps = ComponentProps<typeof parts.Speaker>;

/** The speaker, with what the search matched marked, unless you pass children. */
export function TranscriptSpeaker({
  children = ({ speaker }) => marked(speaker),
  ...props
}: TranscriptSpeakerProps) {
  return <parts.Speaker {...props}>{children}</parts.Speaker>;
}

export type TranscriptTimeProps = ComponentProps<typeof parts.Time>;

/** When the segment starts, like "1:05", unless you pass children. */
export function TranscriptTime({ children = ({ time }) => time, ...props }: TranscriptTimeProps) {
  return <parts.Time {...props}>{children}</parts.Time>;
}

export type TranscriptTextProps = ComponentProps<typeof parts.Text>;

/** A `TranscriptWord` for each of the segment's words, a space apart, or its whole text, unless you pass children. */
export function TranscriptText({
  children = ({ words }) =>
    words.map((value, index) => (
      <Fragment key={value}>
        {index > 0 && " "}
        <TranscriptWord value={value} />
      </Fragment>
    )),
  ...props
}: TranscriptTextProps) {
  return <parts.Text {...props}>{children}</parts.Text>;
}

export type TranscriptWordProps = ComponentProps<typeof parts.Word>;

/**
 * The word whose `value` is `"<segment id>/<index>"`, or a segment's whole text without words, with what the search
 * matched marked, unless you pass children. Memoized, so only the words playback starts and stops render again.
 */
export const TranscriptWord = memo(function TranscriptWord({
  children = ({ text }) => marked(text),
  ...props
}: TranscriptWordProps) {
  return <parts.Word {...props}>{children}</parts.Word>;
});

// Shared, so playback doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <TranscriptSearch />
    <TranscriptViewport>
      <TranscriptList />
    </TranscriptViewport>
  </>
);

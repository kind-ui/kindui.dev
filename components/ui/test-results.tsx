"use client";

import { testResultsPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { TreeItemData } from "@ui-sdk/react/tree";
import { type ComponentProps, memo } from "react";
import {
  KindSegmentedControl,
  KindSegmentedControlIndicator,
  KindSegmentedControlItem,
} from "./internal/segmented-control.js";
import {
  KindTree,
  KindTreeGroup,
  KindTreeItem,
  KindTreeItemIndicator,
  KindTreeItemLabel,
} from "./internal/tree.js";
import { StackTrace } from "./stack-trace.js";

const parts = createParts(testResultsPrimitive, {
  root: "div",
  trigger: "button",
  icon: "span",
  title: "span",
  meta: "span",
  content: "div",
  filter: "div",
  tree: "div",
  item: "span",
  "item-status": "span",
  failure: "div",
  empty: "p",
});

// Lucide "chevron-right", see THIRD_PARTY_NOTICES.md.
const CHEVRON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type TestResultsProps = ComponentProps<typeof parts.Root>;

/**
 * A test run as a step: its counts and duration in the header, over a filter and a tree of suites and tests, in which
 * a failed test opens to its message and stack trace. Any `children` replace the default parts.
 */
export function TestResults({ children, ...props }: TestResultsProps) {
  return <parts.Root {...props}>{children !== undefined ? children : DEFAULT_PARTS}</parts.Root>;
}

export const TestResultsTrigger = parts.Trigger;
export const TestResultsIcon = parts.Icon;
export const TestResultsContent = parts.Content;

export type TestResultsTitleProps = ComponentProps<typeof parts.Title>;

/** The `label`, else "Tests", unless you pass children. */
export function TestResultsTitle({ children = ({ title }) => title, ...props }: TestResultsTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type TestResultsMetaProps = ComponentProps<typeof parts.Meta>;

/** How many tests passed, failed and were skipped, each with a mark, and the duration, unless you pass children. */
export function TestResultsMeta({
  children = ({ counts, duration }) => (
    <>
      <span data-test-results-count="pass" data-zero={counts.pass === 0 ? "" : undefined}>
        {counts.pass} passed
      </span>{" "}
      <span data-test-results-count="fail" data-zero={counts.fail === 0 ? "" : undefined}>
        {counts.fail} failed
      </span>{" "}
      <span data-test-results-count="skip" data-zero={counts.skip === 0 ? "" : undefined}>
        {counts.skip} skipped
      </span>
      {duration ? <span data-test-results-duration=""> {duration}</span> : null}
    </>
  ),
  ...props
}: TestResultsMetaProps) {
  return <parts.Meta {...props}>{children}</parts.Meta>;
}

export type TestResultsFilterProps = ComponentProps<typeof parts.Filter>;

/** The filter: all, failed, passed or skipped tests, as a Segmented Control, unless you pass children. */
export function TestResultsFilter({
  children = ({ levels, ...control }) => (
    // Hidden from agents, which use the Test Results' own `setFilter`.
    <KindSegmentedControl {...control} data-agent-hidden="">
      <KindSegmentedControlIndicator />
      {levels.map((level) => (
        <KindSegmentedControlItem key={level.value} value={level.value}>
          {level.label}
        </KindSegmentedControlItem>
      ))}
    </KindSegmentedControl>
  ),
  ...props
}: TestResultsFilterProps) {
  return <parts.Filter {...props}>{children}</parts.Filter>;
}

export type TestResultsTreeProps = ComponentProps<typeof parts.Tree>;

/** The suites and tests as a UI SDK Tree, with a row for each, unless you pass children. */
export function TestResultsTree({
  children = (tree) => (
    <KindTree {...tree}>
      <TestResultsRows items={tree.items} />
    </KindTree>
  ),
  ...props
}: TestResultsTreeProps) {
  return <parts.Tree {...props}>{children}</parts.Tree>;
}

// Every row has an indicator, a passed or skipped test's an empty spacer that lines its name up with the others. It's
// hidden from agents, which hides UI SDK's Tree from them while the rows stay the Test Results'.
export type TestResultsRowsProps = { items: TreeItemData[] };

/** A Tree row for each item: a suite holds its tests, and a failed test its `TestResultsFailure`. */
export function TestResultsRows({ items }: TestResultsRowsProps) {
  return items.map((item) => <TestResultsRow key={item.value} item={item} />);
}

// Memoized by item, which core keeps while the host keeps its suite, so a streamed test renders only its suite's rows.
const TestResultsRow = memo(function TestResultsRow({ item }: { item: TreeItemData }) {
  return (
    <KindTreeItem value={item.value}>
      <KindTreeItemLabel>
        <KindTreeItemIndicator data-agent-hidden="">{item.children ? CHEVRON : null}</KindTreeItemIndicator>
        <TestResultsItem value={item.value} />
      </KindTreeItemLabel>
      {item.children ? (
        <KindTreeGroup>
          {item.children.length > 0 ? (
            <TestResultsRows items={item.children} />
          ) : (
            <TestResultsFailure value={item.value} />
          )}
        </KindTreeGroup>
      ) : null}
    </KindTreeItem>
  );
});

export type TestResultsItemProps = ComponentProps<typeof parts.Item>;

/**
 * A row's name and its status mark, unless you pass children. Its `value` is the suite's id or the test's
 * `suiteId/testId`. The duration is drawn after them.
 */
export function TestResultsItem({
  children = ({ name }) => (
    <>
      <span data-test-results-name="">{name}</span> <TestResultsItemStatus />
    </>
  ),
  ...props
}: TestResultsItemProps) {
  return <parts.Item {...props}>{children}</parts.Item>;
}

export type TestResultsItemStatusProps = ComponentProps<typeof parts.ItemStatus>;

/** A row's status mark, read as its status and duration, like "failed, 12 ms". */
export function TestResultsItemStatus(props: TestResultsItemStatusProps) {
  return <parts.ItemStatus {...props} />;
}

export type TestResultsFailureProps = ComponentProps<typeof parts.Failure>;

/** A failed test's message and stack trace, as a Stack Trace, unless you pass children. Its `value` is the test's. */
export function TestResultsFailure({
  children = ({ message, stack, motion }) => (
    <StackTrace message={message || undefined} stack={stack} autoOpen="never" motion={motion} />
  ),
  ...props
}: TestResultsFailureProps) {
  return <parts.Failure {...props}>{children}</parts.Failure>;
}

export type TestResultsEmptyProps = ComponentProps<typeof parts.Empty>;

/** What shows when the filter lets no test through, like "No failed tests", unless you pass children. */
export function TestResultsEmpty({ children = ({ text }) => text, ...props }: TestResultsEmptyProps) {
  return <parts.Empty {...props}>{children}</parts.Empty>;
}

const DEFAULT_PARTS = (
  <>
    <TestResultsTrigger>
      <TestResultsIcon />
      <TestResultsTitle />
      <TestResultsMeta />
    </TestResultsTrigger>
    <TestResultsContent>
      <div data-test-results-panel="">
        <TestResultsFilter />
        <TestResultsTree />
        <TestResultsEmpty />
      </div>
    </TestResultsContent>
  </>
);

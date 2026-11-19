"use client";

import {
  CONTEXT_BAR_FIRST_ITEM,
  type ContextBarChipState,
  type ContextBarListState,
  type ContextBarOptions,
  contextBarPrimitive,
} from "@kind-ui/agent-ui/core";
import { createParts, renderElement } from "@ui-sdk/react/primitive";
import { type ComponentProps, memo, type ReactElement } from "react";

const parts = createParts(contextBarPrimitive, {
  root: "div",
  list: "ul",
  chip: "li",
  remove: "span",
  "item-remove": "span",
  overflow: "button",
  content: "div",
  viewport: "div",
  title: "h2",
  "overflow-list": "ul",
  item: "li",
});

/** A chip, whose `icon` is an image URL or an element such as an inline `svg`. */
export type ContextBarChipData = Omit<NonNullable<ContextBarOptions["chips"]>[number], "icon"> & {
  icon?: string | ReactElement;
};

export type ContextBarProps = Omit<ComponentProps<typeof parts.Root>, "chips"> & {
  chips?: readonly ContextBarChipData[];
};
export type ContextBarListProps = ComponentProps<typeof parts.List>;
export type ContextBarChipProps = ComponentProps<typeof parts.Chip>;
export type ContextBarOverflowProps = ComponentProps<typeof parts.Overflow>;
export type ContextBarContentProps = ComponentProps<typeof parts.Content>;
export type ContextBarTitleProps = ComponentProps<typeof parts.Title>;
export type ContextBarOverflowListProps = ComponentProps<typeof parts.OverflowList>;
export type ContextBarItemProps = ComponentProps<typeof parts.Item>;
export type ContextBarRemoveProps = ComponentProps<typeof parts.Remove>;
export type ContextBarItemRemoveProps = ComponentProps<typeof parts.ItemRemove>;

/** A chip's remove control in the bar, for the pointer: hidden from assistive technology, which uses Delete. */
export const ContextBarRemove = parts.Remove;
/** A chip's remove control in the list of the rest, as `ContextBarRemove` is in the bar. */
export const ContextBarItemRemove = parts.ItemRemove;

const chipContent = ({ chip }: ContextBarChipState, remove: ReactElement) => {
  const icon = chip?.icon as string | ReactElement | undefined;
  return (
    <>
      {icon === undefined ? null : (
        <span data-context-bar-icon="">{typeof icon === "string" ? <img src={icon} alt="" /> : icon}</span>
      )}
      <span data-context-bar-label="">{chip?.label}</span>
      {remove}
    </>
  );
};

/**
 * One chip in the bar: its icon, its label and a `ContextBarRemove`, unless you pass children. Memoized, so adding a
 * chip renders only that one.
 */
export const ContextBarChip = memo(function ContextBarChip({
  value,
  children = (state) => chipContent(state, <ContextBarRemove value={value} />),
  ...props
}: ContextBarChipProps) {
  return (
    <parts.Chip value={value} {...props}>
      {children}
    </parts.Chip>
  );
});

const CHIPS = ({ rows }: ContextBarListState) =>
  rows.map((row) => <ContextBarChip key={row.item.id} value={row.item.id} />);

/** The row of chips, one Tab stop with arrow keys between them. Without children, a `ContextBarChip` per row. */
export function ContextBarList({ children = CHIPS, ...props }: ContextBarListProps) {
  return <parts.List {...props}>{children}</parts.List>;
}

/** The "+N" button, present while some chips don't fit, which opens the list of them. */
export function ContextBarOverflow({
  children = ({ count }) => `+${count}`,
  ...props
}: ContextBarOverflowProps) {
  return <parts.Overflow {...props}>{children}</parts.Overflow>;
}

/** Names the list of the chips that don't fit: the `label`. The styles keep it for assistive technology only. */
export function ContextBarTitle({ children = ({ label }) => label, ...props }: ContextBarTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

/** One chip in the list of the rest, as `ContextBarChip` is in the bar, with a `ContextBarItemRemove`. */
export const ContextBarItem = memo(function ContextBarItem({
  value,
  children = (state) => chipContent(state, <ContextBarItemRemove value={value} />),
  ...props
}: ContextBarItemProps) {
  return (
    <parts.Item value={value} {...props}>
      {children}
    </parts.Item>
  );
});

const ITEMS = ({ rows }: ContextBarListState) =>
  rows.map((row) => <ContextBarItem key={row.item.id} value={row.item.id} />);

/** The chips that don't fit, one Tab stop with arrow keys between them. Without children, a `ContextBarItem` per row. */
export function ContextBarOverflowList({ children = ITEMS, ...props }: ContextBarOverflowListProps) {
  return <parts.OverflowList {...props}>{children}</parts.OverflowList>;
}

const DEFAULT_PANEL = (
  <>
    <ContextBarTitle />
    <ContextBarOverflowList />
  </>
);

/** The popover of the chips that don't fit, unless you pass children. Focus moves to the first. */
export function ContextBarContent({ children = DEFAULT_PANEL, render, ...props }: ContextBarContentProps) {
  return (
    <parts.Content
      initialFocus={CONTEXT_BAR_FIRST_ITEM}
      sideOffset={6}
      align="end"
      {...props}
      // A sheet sits in a full-screen viewport, which renders only while the content presents as one.
      render={(content, state) => {
        const element = renderElement("div", content, render, state);
        return state.presentation === "sheet" ? <parts.Viewport>{element}</parts.Viewport> : element;
      }}
    >
      {children}
    </parts.Content>
  );
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ContextBarList />
    <ContextBarOverflow />
    <ContextBarContent />
  </>
);

/**
 * A row of context chips: the ones that don't fit go behind a "+N" button whose popover lists them. With `onRemove`,
 * Delete, Backspace or a chip's remove control removes it. Any `children` replace the list, the button and the popover.
 */
export function ContextBar({ children = DEFAULT_PARTS, ...props }: ContextBarProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

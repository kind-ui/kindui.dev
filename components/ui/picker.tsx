"use client";

import {
  type PickerCommandState,
  type PickerOptions,
  type PickerRow,
  type PickerSection,
  pickerPrimitive,
} from "@kind-ui/agent-ui/core";
import { createParts, renderElement } from "@ui-sdk/react/primitive";
import { type ComponentProps, Fragment, type ReactElement, type ReactNode } from "react";
import {
  KindCommand,
  KindCommandEmpty,
  KindCommandGroup,
  KindCommandGroupLabel,
  KindCommandInput,
  KindCommandItem,
  KindCommandItemIcon,
  KindCommandItemText,
  KindCommandList,
  KindCommandPage,
  KindCommandSeparator,
  KindCommandStatus,
} from "./internal/command.js";

const parts = createParts(pickerPrimitive, {
  root: "div",
  trigger: "button",
  content: "div",
  viewport: "div",
  command: "div",
  item: "span",
});

/** An item, whose `icon` is an image URL or an element such as an inline `svg`. */
export type PickerChoice = Omit<NonNullable<PickerOptions["items"]>[number], "icon" | "items"> & {
  icon?: string | ReactElement;
  items?: PickerChoice[];
};

/** A footer action, whose `icon` is an image URL or an element. */
export type PickerFooterAction = Omit<NonNullable<PickerOptions["actions"]>[number], "icon"> & {
  icon?: string | ReactElement;
};

const iconOf = (icon: unknown) =>
  typeof icon === "string" ? <img src={icon} alt="" /> : (icon as ReactElement | undefined);

export type PickerProps = Omit<ComponentProps<typeof parts.Root>, "children" | "items" | "actions"> & {
  items?: PickerChoice[];
  actions?: PickerFooterAction[];
  children?: ReactNode;
};

export type PickerTriggerProps = ComponentProps<typeof parts.Trigger>;
export type PickerContentProps = ComponentProps<typeof parts.Content>;
export type PickerListProps = Omit<ComponentProps<typeof parts.Command>, "children"> & {
  /** What sits in the list, from the rows: every page by default. */
  children?: (state: PickerCommandState) => ReactNode;
};
export type PickerSectionRowsProps = {
  section: PickerSection;
  /** Whether a separator comes before it, as before the footer. */
  separated?: boolean;
  /** Renders each row: a `PickerRowItem` by default. */
  children?: (row: PickerRow) => ReactNode;
};
export type PickerRowItemProps = Omit<ComponentProps<typeof KindCommandItem>, keyof PickerRow["option"]> & {
  row: PickerRow;
  /** The row's content: a `PickerItem` by default. */
  children?: ReactNode;
};
export type PickerItemProps = ComponentProps<typeof parts.Item>;

/** The parts a picker renders through: Picker's, or those of a component that spreads `pickerBase`. */
export type PickerParts = Pick<typeof parts, "Trigger" | "Content" | "Viewport" | "Command" | "Item">;

/**
 * The trigger, popover, list and rows of a picker, rendered through `parts`, for Model Selector and the other
 * components that spread `pickerBase` to share Picker's markup, each part named `<name><Part>` in React's tools.
 * `Default` is the trigger and the popover. `icon` draws a row's icon (an image URL or an element by default; `null`
 * draws none), and `trailing` what follows its `meta`.
 */
export function pickerParts(
  parts: PickerParts,
  name: string,
  {
    icon = (row: PickerRow) => iconOf(row.icon),
    trailing,
  }: { icon?: (row: PickerRow) => ReactNode; trailing?: (row: PickerRow) => ReactNode } = {},
) {
  function Trigger({
    children = ({ text, icon }) => (
      <>
        {icon !== undefined ? <span data-picker-icon="">{iconOf(icon)}</span> : null}
        <span data-picker-text="">{text}</span>
        <span data-picker-chevron="" />
      </>
    ),
    ...props
  }: PickerTriggerProps) {
    return <parts.Trigger {...props}>{children}</parts.Trigger>;
  }

  function Content({ children = DEFAULT_LIST, render, ...props }: PickerContentProps) {
    return (
      <parts.Content
        initialFocus="input"
        sideOffset={6}
        align="start"
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

  function List({ children = DEFAULT_ROWS, ...props }: PickerListProps) {
    return (
      <parts.Command {...props}>
        {(state) => (
          <KindCommand {...state.props}>
            <KindCommandInput aria-label={state.label} placeholder={state.placeholder} data-agent-hidden="" />
            {state.statusText !== undefined ? (
              <KindCommandStatus>{state.statusText}</KindCommandStatus>
            ) : null}
            <KindCommandEmpty>{state.emptyText}</KindCommandEmpty>
            <KindCommandList>{children(state)}</KindCommandList>
          </KindCommand>
        )}
      </parts.Command>
    );
  }

  const DEFAULT_ROWS = ({ pages }: PickerCommandState) =>
    pages.map(({ page, sections }) => (
      <KindCommandPage key={page ?? ""} value={page}>
        {sections.map((section, index) => (
          <SectionRows
            key={section.footer ? "\u0000footer" : (section.label ?? "")}
            section={section}
            separated={section.footer && index > 0}
          />
        ))}
      </KindCommandPage>
    ));

  function SectionRows({
    section,
    separated = false,
    children = (row) => <RowItem row={row} />,
  }: PickerSectionRowsProps) {
    return (
      <>
        {separated ? <KindCommandSeparator /> : null}
        <KindCommandGroup>
          {section.label ? <KindCommandGroupLabel>{section.label}</KindCommandGroupLabel> : null}
          {section.rows.map((row) => (
            // Keyed by its label too: React Command filters a row by the label it mounted with, and a footer row's
            // label can hold the search.
            <Fragment key={`${row.option.value}\u0000${row.option.label}`}>{children(row)}</Fragment>
          ))}
        </KindCommandGroup>
      </>
    );
  }

  function RowItem({ row, children, ...props }: PickerRowItemProps) {
    return (
      <KindCommandItem {...props} {...row.option}>
        {children ?? <Item value={row.option.value} />}
      </KindCommandItem>
    );
  }

  function Item({
    children = ({ row, description }) => (
      <>
        {iconOfRow(row)}
        <span data-picker-item-text="">
          <KindCommandItemText>{row.label}</KindCommandItemText>
          {description.length ? (
            <span data-picker-description="">
              {description.map((segment, index) =>
                segment.match ? <mark key={index}>{segment.text}</mark> : segment.text,
              )}
            </span>
          ) : null}
        </span>
        {row.meta ? <span data-picker-meta="">{row.meta}</span> : null}
        {trailing?.(row)}
        <span data-picker-mark="" />
      </>
    ),
    ...props
  }: PickerItemProps) {
    return <parts.Item {...props}>{children}</parts.Item>;
  }

  const iconOfRow = (row: PickerRow) => {
    const drawn = row.icon === undefined ? null : icon(row);
    return drawn == null ? null : <KindCommandItemIcon>{drawn}</KindCommandItemIcon>;
  };

  // Shared, so an update doesn't render the default parts' wrappers again.
  const DEFAULT_LIST = <List />;
  const Default = (
    <>
      <Trigger />
      <Content />
    </>
  );

  const named = { Trigger, Content, List, SectionRows, RowItem, Item };
  for (const [part, component] of Object.entries(named))
    (component as { displayName?: string }).displayName = `${name}${part}`;
  return { ...named, Default };
}

const picker = pickerParts(parts, "Picker");

/**
 * A button that shows the chosen item and opens a searchable list of them, with groups, two-line rows, pages and
 * footer actions. Any `children` replace the trigger and the list.
 */
export function Picker({ children = picker.Default, ...props }: PickerProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

/** Opens the list. Shows the chosen item's icon and label, or the `label` while none is chosen, unless you pass children. */
export const PickerTrigger = picker.Trigger;
/** The popover: the search field and the list, unless you pass children. Focus moves to the search field. */
export const PickerContent = picker.Content;
/** UI SDK Command: the search field, the empty text, and every page of rows unless you pass children. */
export const PickerList = picker.List;
/** A group of rows under its label, or the footer. */
export const PickerSectionRows = picker.SectionRows;
/** A row: UI SDK's `CommandItem` with the row's props, holding its `PickerItem` unless you pass children. */
export const PickerRowItem = picker.RowItem;
/** A row's content: its icon, marked label, description, `meta`, and its check or chevron. */
export const PickerItem = picker.Item;

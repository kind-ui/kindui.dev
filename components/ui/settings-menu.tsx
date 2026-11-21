"use client";

import {
  type SettingsMenuContentState,
  type SettingsMenuOptions,
  type SettingsMenuRow,
  settingsMenuPrimitive,
} from "@kind-ui/agent-ui/core";
import { MenuItemIndicator, MenuTrigger } from "@ui-sdk/react/menu";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, Fragment, type ReactElement, type ReactNode } from "react";
import {
  KindMenu,
  KindMenuCheckboxItem,
  KindMenuContent,
  KindMenuGroup,
  KindMenuGroupLabel,
  KindMenuItem,
  KindMenuItemContent,
  KindMenuItemIndicator,
  KindMenuRadioGroup,
  KindMenuRadioItem,
  KindMenuSeparator,
  KindMenuSub,
  KindMenuSubContent,
  KindMenuSubTrigger,
} from "./internal/menu.js";

const parts = createParts(settingsMenuPrimitive, { root: "div", trigger: "span", content: "div" });

type Entry = NonNullable<SettingsMenuOptions["settings"]>[number];
type Choice = Extract<Entry, { type: "choice" }>;
type Icon = string | ReactElement;

/** A setting, whose `icon` and options' `icon`s are image URLs or elements such as an inline `svg`. */
export type SettingsMenuSetting =
  | (Extract<Entry, { type: "toggle" }> & { icon?: Icon })
  | (Omit<Choice, "options"> & { icon?: Icon; options: (Choice["options"][number] & { icon?: Icon })[] });

export type SettingsMenuProps = Omit<ComponentProps<typeof parts.Root>, "children" | "settings"> & {
  settings?: SettingsMenuSetting[];
  children?: ReactNode;
};

type ChoiceRow = Extract<SettingsMenuRow, { type: "choice" }>;

/** A choice's options in one radio group, under their group labels, then its actions. */
function Choices({ row }: { row: ChoiceRow }) {
  return (
    <>
      <KindMenuRadioGroup name={row.id} value={row.value ?? null}>
        {row.groups.map((group, index) => {
          const radios = group.options.map((option) => (
            <KindMenuRadioItem
              key={option.value}
              value={option.value}
              label={option.label}
              disabled={option.disabled ?? false}
            >
              <KindMenuItemIndicator keepMounted>
                <span data-menu-check="" aria-hidden="true" />
              </KindMenuItemIndicator>
              <KindMenuItemContent icon={option.icon} label={option.label} />
            </KindMenuRadioItem>
          ));
          // A labelled group sits inside the one radio group, which UI SDK keys by the setting's `id`.
          return group.label === undefined ? (
            radios
          ) : (
            // By position: an inline row's own label can match a host group's.
            <KindMenuGroup key={index}>
              <KindMenuGroupLabel>{group.label}</KindMenuGroupLabel>
              {radios}
            </KindMenuGroup>
          );
        })}
      </KindMenuRadioGroup>
      {row.actions.length && !row.inline ? <KindMenuSeparator /> : null}
      {row.actions.map((action) => (
        <KindMenuItem
          key={action.value}
          value={action.value}
          label={action.label}
          data-menu-inset={row.inline ? "" : undefined}
        >
          <KindMenuItemContent icon={action.icon} label={action.label} />
        </KindMenuItem>
      ))}
    </>
  );
}

function Row({ row }: { row: SettingsMenuRow }) {
  if (row.type === "toggle")
    return (
      <KindMenuCheckboxItem value={row.id} label={row.label} checked={row.checked}>
        <KindMenuItemContent icon={row.icon} label={row.label} description={row.description} />
        <MenuItemIndicator keepMounted data-menu-switch="" aria-hidden="true">
          <span data-menu-switch-thumb="" />
        </MenuItemIndicator>
      </KindMenuCheckboxItem>
    );
  if (row.inline) return <Choices row={row} />;
  return (
    <KindMenuSub>
      <KindMenuSubTrigger>
        <KindMenuItemContent icon={row.icon} label={row.label} />
        <span data-settings-menu-value="">
          {row.options.map((option) => (
            <span key={option.value} data-current={option.value === row.value ? "" : undefined}>
              {option.label}
            </span>
          ))}
        </span>
        <span data-menu-chevron="" />
      </KindMenuSubTrigger>
      <KindMenuSubContent>
        <Choices row={row} />
      </KindMenuSubContent>
    </KindMenuSub>
  );
}

export type SettingsMenuRowsProps = { rows: SettingsMenuRow[] };

/**
 * The rows: a switch for each toggle, and for each choice a submenu showing its value, or while `inline` a section of
 * the menu, holding its options under their group labels and any actions after them. A separator follows an inline
 * section. Model Control draws its rows with it too.
 */
export function SettingsMenuRows({ rows }: SettingsMenuRowsProps) {
  return rows.map((row, index) => (
    <Fragment key={row.id}>
      <Row row={row} />
      {row.type === "choice" && row.inline && index < rows.length - 1 ? <KindMenuSeparator /> : null}
    </Fragment>
  ));
}

/**
 * An icon button named "Settings" that opens a menu of settings: toggles drawn as switches, which keep the menu open,
 * and choices, each a submenu of options showing the current one. Any `children` replace the trigger and the content,
 * inside UI SDK Menu.
 */
export function SettingsMenu({ children = DEFAULT_PARTS, ...props }: SettingsMenuProps) {
  return <parts.Root {...props}>{(menu) => <KindMenu {...menu}>{children}</KindMenu>}</parts.Root>;
}

export type SettingsMenuTriggerProps = ComponentProps<typeof MenuTrigger>;

/** Opens the menu: UI SDK's `MenuTrigger`, named by the `label`, showing a settings icon unless you pass children. */
export function SettingsMenuTrigger({ children = ICON, ...props }: SettingsMenuTriggerProps) {
  return (
    <parts.Trigger>
      {(trigger) => (
        // Hidden from agents, which use the Settings Menu's own actions.
        <MenuTrigger {...trigger} data-agent-hidden="" {...props}>
          {children}
        </MenuTrigger>
      )}
    </parts.Trigger>
  );
}

export type SettingsMenuContentProps = Omit<ComponentProps<typeof KindMenuContent>, "children"> & {
  /** What the menu holds, or a function of its rows: the rows by default. */
  children?: ReactNode | ((state: SettingsMenuContentState) => ReactNode);
};

/** The menu: UI SDK's `MenuContent` holding the rows unless you pass children. Props go to it. */
export function SettingsMenuContent({ children = DEFAULT_ROWS, ...props }: SettingsMenuContentProps) {
  return (
    <parts.Content>
      {(state) => (
        <KindMenuContent align="start" sideOffset={6} {...props}>
          {typeof children === "function" ? children(state) : children}
        </KindMenuContent>
      )}
    </parts.Content>
  );
}

const DEFAULT_ROWS = ({ rows }: SettingsMenuContentState) => <SettingsMenuRows rows={rows} />;

// Shared, so an update doesn't render the default parts' wrappers again.
const ICON = <span data-menu-trigger-icon="" aria-hidden="true" />;
const DEFAULT_PARTS = (
  <>
    <SettingsMenuTrigger />
    <SettingsMenuContent />
  </>
);

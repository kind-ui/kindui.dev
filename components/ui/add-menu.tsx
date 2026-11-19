"use client";

import {
  type AddMenuContentState,
  type AddMenuOptions,
  type AddMenuRow,
  type AddMenuSection,
  addMenuPrimitive,
} from "@kind-ui/agent-ui/core";
import { MenuTrigger } from "@ui-sdk/react/menu";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, Fragment, type ReactElement, type ReactNode } from "react";
import {
  KindMenu,
  KindMenuContent,
  KindMenuGroup,
  KindMenuGroupLabel,
  KindMenuItem,
  KindMenuItemContent,
  KindMenuSeparator,
  KindMenuSub,
  KindMenuSubContent,
  KindMenuSubTrigger,
} from "./internal/menu.js";

const parts = createParts(addMenuPrimitive, { root: "div", trigger: "span", content: "div" });

/** An entry, whose `icon` is an image URL or an element such as an inline `svg`. */
export type AddMenuEntry = Omit<NonNullable<AddMenuOptions["items"]>[number], "icon" | "items"> & {
  icon?: string | ReactElement;
  items?: AddMenuEntry[];
};

export type AddMenuProps = Omit<ComponentProps<typeof parts.Root>, "children" | "items"> & {
  items?: AddMenuEntry[];
  children?: ReactNode;
};

function Row({ row }: { row: AddMenuRow }) {
  if (!row.sections)
    return (
      <KindMenuItem value={row.id} label={row.label} disabled={row.disabled}>
        <KindMenuItemContent icon={row.icon} label={row.label} description={row.description} />
      </KindMenuItem>
    );
  return (
    <KindMenuSub>
      <KindMenuSubTrigger disabled={row.disabled}>
        <KindMenuItemContent icon={row.icon} label={row.label} description={row.description} />
        <span data-menu-chevron="" />
      </KindMenuSubTrigger>
      <KindMenuSubContent>
        <AddMenuRows sections={row.sections} />
      </KindMenuSubContent>
    </KindMenuSub>
  );
}

export type AddMenuRowsProps = { sections: AddMenuSection[] };

/** The rows of a level: each group under its label, separated, and a submenu for each entry with `items`. */
export function AddMenuRows({ sections }: AddMenuRowsProps) {
  return sections.map((section, index) => {
    const rows = section.rows.map((row) => <Row key={row.id} row={row} />);
    return (
      <Fragment key={section.label ?? ""}>
        {index > 0 ? <KindMenuSeparator /> : null}
        {section.label === undefined ? (
          rows
        ) : (
          <KindMenuGroup>
            <KindMenuGroupLabel>{section.label}</KindMenuGroupLabel>
            {rows}
          </KindMenuGroup>
        )}
      </Fragment>
    );
  });
}

/**
 * An icon button named "Add" that opens a menu of what can be added: items with an icon and a description, grouped
 * under labels, and submenus. Any `children` replace the trigger and the content, inside UI SDK Menu.
 */
export function AddMenu({ children = DEFAULT_PARTS, ...props }: AddMenuProps) {
  return <parts.Root {...props}>{(menu) => <KindMenu {...menu}>{children}</KindMenu>}</parts.Root>;
}

export type AddMenuTriggerProps = ComponentProps<typeof MenuTrigger>;

/** Opens the menu: UI SDK's `MenuTrigger`, named by the `label`, showing a plus unless you pass children. */
export function AddMenuTrigger({ children = PLUS, ...props }: AddMenuTriggerProps) {
  return (
    <parts.Trigger>
      {(trigger) => (
        // Hidden from agents, which use the Add Menu's own actions.
        <MenuTrigger {...trigger} data-agent-hidden="" {...props}>
          {children}
        </MenuTrigger>
      )}
    </parts.Trigger>
  );
}

export type AddMenuContentProps = Omit<ComponentProps<typeof KindMenuContent>, "children"> & {
  /** What the menu holds, or a function of its rows: the rows by default. */
  children?: ReactNode | ((state: AddMenuContentState) => ReactNode);
};

/** The menu: UI SDK's `MenuContent` holding the rows unless you pass children. Props go to it. */
export function AddMenuContent({ children = DEFAULT_ROWS, ...props }: AddMenuContentProps) {
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

const DEFAULT_ROWS = ({ sections }: AddMenuContentState) => <AddMenuRows sections={sections} />;

// Shared, so an update doesn't render the default parts' wrappers again.
const PLUS = <span data-menu-trigger-icon="" aria-hidden="true" />;
const DEFAULT_PARTS = (
  <>
    <AddMenuTrigger />
    <AddMenuContent />
  </>
);

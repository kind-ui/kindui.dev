"use client";

import {
  type ModelControlOptions,
  type ModelControlTriggerState,
  modelControlPrimitive,
  type SettingsMenuContentState,
} from "@kind-ui/agent-ui/core";
import { MenuTrigger } from "@ui-sdk/react/menu";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { KindMenu, KindMenuContent, KindMenuItemIcon } from "./internal/menu.js";
import { SettingsMenuRows, type SettingsMenuSetting } from "./settings-menu.js";

const parts = createParts(modelControlPrimitive, { root: "div", trigger: "span", content: "div" });

type Icon = string | ReactElement;

/** A model, whose `icon` is an image URL or an element such as an inline `svg`. */
export type ModelControlModel = Omit<NonNullable<ModelControlOptions["models"]>[number], "icon"> & {
  icon?: Icon;
};

export type ModelControlProps = Omit<
  ComponentProps<typeof parts.Root>,
  "children" | "models" | "actions" | "settings"
> & {
  models?: ModelControlModel[];
  /** Items after the models in the Model submenu, like "More models". */
  actions?: (Omit<NonNullable<ModelControlOptions["actions"]>[number], "icon"> & { icon?: Icon })[];
  /** More rows: toggles above Model and Effort, choices below. */
  settings?: SettingsMenuSetting[];
  children?: ReactNode;
};

/**
 * One button for the model and its effort, reading "GPT-5 · High", that opens a menu: the Model submenu, the Effort
 * submenu of the levels the model supports, and your own toggles and choices. Any `children` replace the trigger and
 * the content, inside UI SDK Menu.
 */
export function ModelControl({ children = DEFAULT_PARTS, ...props }: ModelControlProps) {
  return <parts.Root {...props}>{(menu) => <KindMenu {...menu}>{children}</KindMenu>}</parts.Root>;
}

const triggerContent = ({ model, effort }: ModelControlTriggerState) => (
  <>
    {model.icon !== undefined ? (
      <KindMenuItemIcon>
        {typeof model.icon === "string" ? <img src={model.icon} alt="" /> : (model.icon as ReactElement)}
      </KindMenuItemIcon>
    ) : null}
    <span data-model-control-model="">{model.label}</span>
    {effort ? (
      <>
        {/* Spaces around the "·", so the accessible name reads "GPT-5 · High"; the trigger's gap spaces it on screen. */}{" "}
        <span data-model-control-separator="">·</span>{" "}
        {/* Every level's label shares one cell and only the chosen one shows, so the trigger keeps its width. */}
        <span data-model-control-effort="">
          {effort.options.map((option) => (
            <span key={option.value} data-current={option.value === effort.value ? "" : undefined}>
              {option.label}
            </span>
          ))}
        </span>
      </>
    ) : null}
    <span data-menu-chevron="" />
  </>
);

export type ModelControlTriggerProps = Omit<ComponentProps<typeof MenuTrigger>, "children"> & {
  /** What the button shows: the model's icon and name, then its effort, by default. */
  children?: ReactNode | ((state: ModelControlTriggerState) => ReactNode);
};

/** Opens the menu: UI SDK's `MenuTrigger`, named by the `label`, the model and the effort. */
export function ModelControlTrigger({ children = triggerContent, ...props }: ModelControlTriggerProps) {
  return (
    <parts.Trigger>
      {({ model, effort, ...trigger }) => (
        // Hidden from agents, which use the Model Control's own actions.
        <MenuTrigger {...trigger} data-agent-hidden="" {...props}>
          {typeof children === "function" ? children({ model, effort, ...trigger }) : children}
        </MenuTrigger>
      )}
    </parts.Trigger>
  );
}

export type ModelControlContentProps = Omit<ComponentProps<typeof KindMenuContent>, "children"> & {
  /** What the menu holds, or a function of its rows: the rows by default. */
  children?: ReactNode | ((state: SettingsMenuContentState) => ReactNode);
};

/** The menu: UI SDK's `MenuContent` holding the rows unless you pass children. Props go to it. */
export function ModelControlContent({ children = DEFAULT_ROWS, ...props }: ModelControlContentProps) {
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
const DEFAULT_PARTS = (
  <>
    <ModelControlTrigger />
    <ModelControlContent />
  </>
);

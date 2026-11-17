"use client";

import {
  type ModelSelectorItem as Item,
  type ModelSelectorOptions,
  modelSelectorPrimitive,
} from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import {
  KindCombobox,
  KindComboboxContent,
  KindComboboxEmpty,
  KindComboboxGroup,
  KindComboboxGroupLabel,
  KindComboboxInput,
  KindComboboxItem,
  KindComboboxItemIcon,
  KindComboboxItemIndicator,
  KindComboboxList,
  KindComboboxTrigger,
} from "./internal/combobox.js";

const parts = createParts(modelSelectorPrimitive, {
  root: "div",
  trigger: "div",
  icon: "span",
  input: "span",
  content: "div",
});

// Lucide "chevron-down" and "check", see THIRD_PARTY_NOTICES.md.
const CHEVRON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A model, whose `icon` is an image URL or an element such as an inline `svg`. */
export type ModelSelectorModel = Omit<NonNullable<ModelSelectorOptions["models"]>[number], "icon"> & {
  icon?: string | ReactElement;
};

/** A model in the list, with its name split into what the query matched and what it didn't. */
export type ModelSelectorListItem = Omit<Item, "icon"> & Pick<ModelSelectorModel, "icon">;

const iconOf = (icon: string | ReactElement) => (typeof icon === "string" ? <img src={icon} alt="" /> : icon);

export type ModelSelectorProps = Omit<ComponentProps<typeof parts.Root>, "children" | "models"> & {
  models?: ModelSelectorModel[];
  children?: ReactNode;
};

/**
 * A searchable list of models grouped by provider. The field shows the chosen model, its icon and its group; typing
 * filters the list and marks what matched. Any `children` replace the field and the list, inside the Combobox.
 */
export function ModelSelector({ children = DEFAULT_PARTS, ...props }: ModelSelectorProps) {
  return (
    <parts.Root {...props}>{(combobox) => <KindCombobox {...combobox}>{children}</KindCombobox>}</parts.Root>
  );
}

export type ModelSelectorTriggerProps = ComponentProps<typeof parts.Trigger>;

/**
 * The field: the chosen model's icon, the search field, the chosen model's group, and the button that opens the list,
 * unless you pass children. The list opens against it.
 */
export function ModelSelectorTrigger({
  children = ({ group, buttonLabel }) => (
    <>
      <ModelSelectorIcon />
      <ModelSelectorInput />
      <span data-model-selector-group="">{group}</span>
      <KindComboboxTrigger aria-label={buttonLabel}>{CHEVRON}</KindComboboxTrigger>
    </>
  ),
  ...props
}: ModelSelectorTriggerProps) {
  return <parts.Trigger {...props}>{children}</parts.Trigger>;
}

export type ModelSelectorIconProps = ComponentProps<typeof parts.Icon>;

/** The chosen model's icon, shown before the search field while that model has one, unless you pass children. */
export function ModelSelectorIcon({
  children = ({ icon }) => iconOf(icon as string | ReactElement),
  ...props
}: ModelSelectorIconProps) {
  return <parts.Icon {...props}>{children}</parts.Icon>;
}

export type ModelSelectorInputProps = ComponentProps<typeof parts.Input>;

/** The search field, which shows the chosen model's name while the list is closed, unless you pass children. */
export function ModelSelectorInput({
  children = ({ label, placeholder }) => (
    // Hidden from agents, which use the Model Selector's own `setValue`.
    <KindComboboxInput aria-label={label} placeholder={placeholder} data-agent-hidden="" />
  ),
  ...props
}: ModelSelectorInputProps) {
  return <parts.Input {...props}>{children}</parts.Input>;
}

export type ModelSelectorContentProps = ComponentProps<typeof parts.Content>;

/** The list, the matching models by group, best match first, unless you pass children. It opens against the field. */
export function ModelSelectorContent({
  children = ({ anchor, groups }) => (
    <KindComboboxContent anchor={anchor} sideOffset={6} align="start">
      <ModelSelectorEmpty />
      <KindComboboxList>
        {groups.map(({ group, models }) => (
          <ModelSelectorGroup key={group ?? ""} label={group}>
            {models.map((model) => (
              <ModelSelectorItem key={model.id} model={model as ModelSelectorListItem} />
            ))}
          </ModelSelectorGroup>
        ))}
      </KindComboboxList>
    </KindComboboxContent>
  ),
  ...props
}: ModelSelectorContentProps) {
  return <parts.Content {...props}>{children}</parts.Content>;
}

export type ModelSelectorGroupProps = Omit<ComponentProps<typeof KindComboboxGroup>, "children"> & {
  label: string | undefined;
  children?: ReactNode;
};

/** A group of models, named by its `label` when it has one. */
export function ModelSelectorGroup({ label, children, ...props }: ModelSelectorGroupProps) {
  return (
    <KindComboboxGroup {...props}>
      {label ? <KindComboboxGroupLabel>{label}</KindComboboxGroupLabel> : null}
      {children}
    </KindComboboxGroup>
  );
}

export type ModelSelectorItemProps = Omit<
  ComponentProps<typeof KindComboboxItem>,
  "value" | "label" | "disabled" | "children"
> & { model: ModelSelectorListItem };

/**
 * A model in the list: its icon, its name with what the query matched marked, its description and a check when
 * chosen. A string `icon` is an image URL; an element renders as is.
 */
export function ModelSelectorItem({ model, ...props }: ModelSelectorItemProps) {
  const { icon } = model;
  return (
    <KindComboboxItem {...props} value={model.id} label={model.name} disabled={model.disabled}>
      {icon ? <KindComboboxItemIcon>{iconOf(icon)}</KindComboboxItemIcon> : null}
      <span data-model-selector-item-text="">
        <span data-model-selector-name="">
          {model.segments.map((segment, index) =>
            segment.match ? <mark key={index}>{segment.text}</mark> : segment.text,
          )}
        </span>
        {model.description ? <span data-model-selector-description="">{model.description}</span> : null}
      </span>
      <KindComboboxItemIndicator>{CHECK}</KindComboboxItemIndicator>
    </KindComboboxItem>
  );
}

export type ModelSelectorEmptyProps = ComponentProps<typeof KindComboboxEmpty>;

/** Shown while no model matches. Reads "No models found." unless you pass children. */
export function ModelSelectorEmpty({ children = "No models found.", ...props }: ModelSelectorEmptyProps) {
  return <KindComboboxEmpty {...props}>{children}</KindComboboxEmpty>;
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ModelSelectorTrigger />
    <ModelSelectorContent />
  </>
);

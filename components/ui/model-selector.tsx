"use client";

import { type ModelSelectorOptions, modelSelectorPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import {
  type PickerContentProps,
  type PickerFooterAction,
  type PickerItemProps,
  type PickerListProps,
  type PickerRowItemProps,
  type PickerSectionRowsProps,
  type PickerTriggerProps,
  pickerParts,
} from "./picker.js";

const parts = createParts(modelSelectorPrimitive, {
  root: "div",
  trigger: "button",
  content: "div",
  viewport: "div",
  command: "div",
  item: "span",
});

const picker = pickerParts(parts, "ModelSelector");

/** A model, whose `icon` is an image URL or an element such as an inline `svg`. */
export type ModelSelectorModel = Omit<NonNullable<ModelSelectorOptions["models"]>[number], "icon"> & {
  icon?: string | ReactElement;
};

export type ModelSelectorProps = Omit<
  ComponentProps<typeof parts.Root>,
  "children" | "models" | "actions"
> & {
  models?: ModelSelectorModel[];
  /** Footer rows after the models, like "More models". */
  actions?: PickerFooterAction[];
  children?: ReactNode;
};

/**
 * A button that shows the chosen model and its icon, and opens a searchable list of models grouped by provider, with
 * footer `actions`. Any `children` replace the trigger and the list.
 */
export function ModelSelector({ children = picker.Default, ...props }: ModelSelectorProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export type ModelSelectorTriggerProps = PickerTriggerProps;
export type ModelSelectorContentProps = PickerContentProps;
export type ModelSelectorListProps = PickerListProps;
export type ModelSelectorSectionRowsProps = PickerSectionRowsProps;
export type ModelSelectorRowItemProps = PickerRowItemProps;
export type ModelSelectorItemProps = PickerItemProps;

/** Opens the list. Shows the chosen model's icon and name, or the `label` while none is chosen, unless you pass children. */
export const ModelSelectorTrigger = picker.Trigger;
/** The popover: the search field and the list, unless you pass children. Focus moves to the search field. */
export const ModelSelectorContent = picker.Content;
/** UI SDK Command: the search field, the empty text, and every page of rows unless you pass children. */
export const ModelSelectorList = picker.List;
/** A group of rows under its label, or the footer. */
export const ModelSelectorSectionRows = picker.SectionRows;
/** A row: UI SDK's `CommandItem` with the row's props, holding its `ModelSelectorItem` unless you pass children. */
export const ModelSelectorRowItem = picker.RowItem;
/** A row's content: the model's icon, its marked name, its description, and a check when chosen. */
export const ModelSelectorItem = picker.Item;

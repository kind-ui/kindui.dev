"use client";

import { questionPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";
import { KindCheckbox, KindCheckboxGroup, KindCheckboxIndicator } from "./internal/checkbox.js";
import { KindRadio, KindRadioGroup, KindRadioIndicator } from "./internal/radio.js";
import { KindTextarea } from "./internal/textarea.js";

const parts = createParts(questionPrimitive, {
  root: "form",
  item: "fieldset",
  prompt: "legend",
  choices: "div",
  text: "div",
  actions: "div",
  submit: "button",
  skip: "button",
  status: "span",
  "status-icon": "span",
  error: "span",
  summary: "div",
  "summary-icon": "span",
});

export type QuestionProps = ComponentProps<typeof parts.Root>;

/**
 * One question or several in one form, each a fieldset, with Submit and Skip, then the recorded answers in the form's
 * place. Any `children` replace the default parts.
 */
export function Question({ children = DEFAULT_PARTS, ...props }: QuestionProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export const QuestionActions = parts.Actions;
export const QuestionStatusIcon = parts.StatusIcon;
export const QuestionSummaryIcon = parts.SummaryIcon;

export type QuestionItemProps = ComponentProps<typeof parts.Item>;

/** The question whose `id` is `value`. Without children, it shows its prompt and its choices or text box. */
export function QuestionItem({ children = DEFAULT_ITEM_PARTS, ...props }: QuestionItemProps) {
  return <parts.Item {...props}>{children}</parts.Item>;
}

export type QuestionPromptProps = ComponentProps<typeof parts.Prompt>;

/** The question's prompt, marked "Required" when it is, unless you pass children. */
export function QuestionPrompt({
  children = ({ prompt, required }) => (
    <>
      {prompt}
      {required ? (
        <>
          {" "}
          <span data-question-required="">Required</span>
        </>
      ) : null}
    </>
  ),
  ...props
}: QuestionPromptProps) {
  return <parts.Prompt {...props}>{children}</parts.Prompt>;
}

export type QuestionChoicesProps = ComponentProps<typeof parts.Choices>;

/** A radio group for a single choice or a checkbox group for a multiple one, unless you pass children. */
export function QuestionChoices({
  children = (state) => {
    if (!("kind" in state)) return null;
    const options = state.options.map((option) => (
      // biome-ignore lint/a11y/noLabelWithoutControl: the label wraps UI SDK's radio or checkbox, which it names.
      <label key={option.value} data-question-option="">
        {state.kind === "single" ? (
          <KindRadio value={option.value}>
            <KindRadioIndicator />
          </KindRadio>
        ) : (
          <KindCheckbox value={option.value}>
            <KindCheckboxIndicator>{CHECK}</KindCheckboxIndicator>
          </KindCheckbox>
        )}
        <span data-question-option-text="">
          <span>{option.label}</span>
          {option.description ? <span data-question-option-description="">{option.description}</span> : null}
        </span>
      </label>
    ));
    return state.kind === "single" ? (
      <KindRadioGroup
        aria-labelledby={state.labelledBy}
        controller={state.controller}
        defaultValue={state.defaultValue}
        readOnly={state.readOnly}
      >
        {options}
      </KindRadioGroup>
    ) : (
      <KindCheckboxGroup
        controller={state.controller}
        defaultValue={state.defaultValue}
        readOnly={state.readOnly}
      >
        {options}
      </KindCheckboxGroup>
    );
  },
  ...props
}: QuestionChoicesProps) {
  return <parts.Choices {...props}>{children}</parts.Choices>;
}

export type QuestionTextProps = ComponentProps<typeof parts.Text>;

/** A text box for a text question, unless you pass children. Enter adds a line; it never submits. */
export function QuestionText({
  children = (state) =>
    "controller" in state ? (
      <KindTextarea
        controller={state.controller}
        defaultValue={state.defaultValue}
        readOnly={state.readOnly}
        placeholder={state.placeholder}
        aria-label={state.label}
        rows={3}
      />
    ) : null,
  ...props
}: QuestionTextProps) {
  return <parts.Text {...props}>{children}</parts.Text>;
}

export type QuestionSubmitProps = ComponentProps<typeof parts.Submit>;

/** Calls `onSubmit`. Reads the `submitLabel` unless you pass children. Rendered only while `onSubmit` is set. */
export function QuestionSubmit({ children = withPendingMark, ...props }: QuestionSubmitProps) {
  return <parts.Submit {...props}>{children}</parts.Submit>;
}

export type QuestionSkipProps = ComponentProps<typeof parts.Skip>;

/** Calls `onSkip`. Reads the `skipLabel` unless you pass children. Rendered only while `onSkip` is set. */
export function QuestionSkip({ children = withPendingMark, ...props }: QuestionSkipProps) {
  return <parts.Skip {...props}>{children}</parts.Skip>;
}

export type QuestionStatusProps = ComponentProps<typeof parts.Status>;

/**
 * "Sending answers" or "Skipping" while the host has them, unless you pass children. The pressed button holds the
 * running mark, so the words stand alone.
 */
export function QuestionStatus({ children = ({ label }) => label, ...props }: QuestionStatusProps) {
  return <parts.Status {...props}>{children}</parts.Status>;
}

export type QuestionErrorProps = ComponentProps<typeof parts.Error>;

/** "Answers not sent. Try again." after a submission fails, unless you pass children. */
export function QuestionError({ children = "Answers not sent. Try again.", ...props }: QuestionErrorProps) {
  return <parts.Error {...props}>{children}</parts.Error>;
}

export type QuestionSummaryProps = ComponentProps<typeof parts.Summary>;

/** "Answered" with each question and its answer, or "Skipped", unless you pass children. */
export function QuestionSummary({
  children = ({ outcome, items }) => (
    <>
      <span data-question-outcome="">
        <QuestionSummaryIcon />
        {outcome}
      </span>
      {items.length > 0 ? (
        <dl>
          {items.map((item) => (
            <div key={item.id}>
              <dt>{item.prompt}</dt>
              <dd data-empty={item.answer === undefined ? "" : undefined}>{item.answer ?? "No answer"}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </>
  ),
  ...props
}: QuestionSummaryProps) {
  return <parts.Summary {...props}>{children}</parts.Summary>;
}

// The mark shows only while the button's call is pending (controls.css).
const withPendingMark = ({ label }: { label: string }) => (
  <>
    <span data-kind-pending-mark="" data-status-mark="" data-status="running" aria-hidden="true" />
    {label}
  </>
);

// Lucide's check, as the status mark draws it.
const CHECK = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// Shared, so an update to the answers doesn't render the default parts' wrappers again.
const DEFAULT_ITEM_PARTS = (
  <>
    <QuestionPrompt />
    <QuestionChoices />
    <QuestionText />
  </>
);

const ACTIONS = (
  <QuestionActions>
    <QuestionSubmit />
    <QuestionSkip />
    <QuestionStatus />
    <QuestionError />
  </QuestionActions>
);

const DEFAULT_PARTS: QuestionProps["children"] = ({ questions }) => (
  <>
    {questions.map((question) => (
      <QuestionItem key={question.id} value={question.id} />
    ))}
    {ACTIONS}
    <QuestionSummary />
  </>
);

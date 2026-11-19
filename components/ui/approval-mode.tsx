"use client";

import {
  APPROVAL_MODE_GROUP,
  APPROVAL_MODE_LEARN_MORE,
  type ApprovalModeContentState,
  type ApprovalModeRow,
  type ApprovalModeTriggerState,
  approvalModePrimitive,
} from "@kind-ui/agent-ui/core";
import { MenuTrigger } from "@ui-sdk/react/menu";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import {
  KindMenu,
  KindMenuContent,
  KindMenuGroupLabel,
  KindMenuItem,
  KindMenuItemContent,
  KindMenuItemIndicator,
  KindMenuRadioGroup,
  KindMenuRadioItem,
} from "./internal/menu.js";

const parts = createParts(approvalModePrimitive, { root: "div", trigger: "span", content: "div" });

export type ApprovalModeProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  children?: ReactNode;
};

/**
 * A button showing the approval mode, named "Approvals, <mode>", that opens a menu of modes: radio items with a
 * description each, a risky one marked, and an optional Learn more link in the header. Any `children` replace the
 * trigger and the content, inside UI SDK Menu.
 */
export function ApprovalMode({ children = DEFAULT_PARTS, ...props }: ApprovalModeProps) {
  return <parts.Root {...props}>{(menu) => <KindMenu {...menu}>{children}</KindMenu>}</parts.Root>;
}

const RISKY = (
  <span data-approval-mode-risk="">
    <span data-status-mark="" data-status="warning" aria-hidden="true" />
    Risky
  </span>
);

export type ApprovalModeRowsProps = Pick<ApprovalModeContentState, "rows">;

/** The modes' radio items, a risky one marked with the warning mark and "Risky". Choosing one closes the menu. */
export function ApprovalModeRows({ rows }: ApprovalModeRowsProps) {
  return rows.map((row) => (
    <KindMenuRadioItem
      key={row.value}
      value={row.value}
      label={row.label}
      closeOnSelect
      data-danger={row.danger ? "" : undefined}
    >
      <KindMenuItemIndicator keepMounted>
        <span data-menu-check="" aria-hidden="true" />
      </KindMenuItemIndicator>
      <KindMenuItemContent label={row.label} description={row.description} />
      {row.danger ? RISKY : null}
    </KindMenuRadioItem>
  ));
}

function TriggerValue({ mode }: { mode: ApprovalModeRow | undefined }) {
  return (
    <>
      <span data-menu-trigger-icon="" aria-hidden="true" />
      {mode ? <span data-approval-mode-value="">{mode.label}</span> : null}
      {mode?.danger ? <span data-status-mark="" data-status="warning" aria-hidden="true" /> : null}
    </>
  );
}

export type ApprovalModeTriggerProps = Omit<ComponentProps<typeof MenuTrigger>, "children"> & {
  /** What the button shows, or a function of its state: a shield, the mode's label and a risky mode's mark. */
  children?: ReactNode | ((state: ApprovalModeTriggerState) => ReactNode);
};

/** Opens the menu: UI SDK's `MenuTrigger`, named by the `label` and the mode. Props go to it. */
export function ApprovalModeTrigger({ children, ...props }: ApprovalModeTriggerProps) {
  return (
    <parts.Trigger>
      {({ mode, ...trigger }) => (
        // Hidden from agents, which use the Approval Mode's own actions.
        <MenuTrigger {...trigger} data-agent-hidden="" {...props}>
          {typeof children === "function"
            ? children({ mode, ...trigger })
            : (children ?? <TriggerValue mode={mode} />)}
        </MenuTrigger>
      )}
    </parts.Trigger>
  );
}

export type ApprovalModeContentProps = Omit<ComponentProps<typeof KindMenuContent>, "children"> & {
  /** What the radio group holds after its header, or a function of the content's state: the modes by default. */
  children?: ReactNode | ((state: ApprovalModeContentState) => ReactNode);
};

/**
 * The menu: UI SDK's `MenuContent` holding one radio group, headed by the `label` and a Learn more item (a link with
 * `learnMoreHref`), then the modes unless you pass children. Props go to the content.
 */
export function ApprovalModeContent({ children = DEFAULT_ROWS, ...props }: ApprovalModeContentProps) {
  return (
    <parts.Content>
      {(state) => (
        <KindMenuContent align="start" sideOffset={6} {...props}>
          <KindMenuRadioGroup name={APPROVAL_MODE_GROUP} value={state.value}>
            <div data-approval-mode-header="">
              <KindMenuGroupLabel>{state.label}</KindMenuGroupLabel>
              {state.learnMore ? (
                <KindMenuItem
                  value={APPROVAL_MODE_LEARN_MORE}
                  data-approval-mode-learn-more=""
                  // biome-ignore lint/a11y/useAnchorContent: UI SDK renders the item's children into the link.
                  render={state.learnMoreHref ? <a href={state.learnMoreHref} /> : undefined}
                >
                  Learn more
                </KindMenuItem>
              ) : null}
            </div>
            {typeof children === "function" ? children(state) : children}
          </KindMenuRadioGroup>
        </KindMenuContent>
      )}
    </parts.Content>
  );
}

const DEFAULT_ROWS = ({ rows }: ApprovalModeContentState) => <ApprovalModeRows rows={rows} />;

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_PARTS = (
  <>
    <ApprovalModeTrigger />
    <ApprovalModeContent />
  </>
);

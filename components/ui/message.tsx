"use client";

import {
  type MessageOptions,
  type MessageRegenerateContentState,
  messagePrimitive,
} from "@kind-ui/agent-ui/core";
import { MenuTrigger } from "@ui-sdk/react/menu";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, isValidElement, type ReactElement, type ReactNode } from "react";
import {
  KindMenu,
  KindMenuContent,
  KindMenuItem,
  KindMenuItemContent,
  KindMenuSeparator,
  KindMenuSub,
  KindMenuSubContent,
  KindMenuSubTrigger,
} from "./internal/menu.js";

const message = createParts(messagePrimitive, {
  root: "div",
  avatar: "div",
  content: "div",
  editor: "textarea",
  toolbar: "div",
  copy: "span",
  regenerate: "span",
  "regenerate-trigger": "span",
  "regenerate-content": "span",
  edit: "span",
  branch: "div",
  "branch-previous": "button",
  "branch-label": "span",
  "branch-next": "button",
});

/** A regenerate option, whose `icon` is an image URL or an element such as an inline `svg`. */
export type MessageRegenerateOption = Omit<
  NonNullable<MessageOptions["regenerateOptions"]>[number],
  "icon" | "items"
> & {
  icon?: string | ReactElement;
  items?: MessageRegenerateOption[];
};

export type MessageProps = Omit<ComponentProps<typeof message.Root>, "regenerateOptions"> & {
  regenerateOptions?: MessageRegenerateOption[];
};

/** Name it with `aria-label`, like "Assistant message". */
export function Message(props: MessageProps) {
  return <message.Root {...props} />;
}
export const MessageAvatar = message.Avatar;
export const MessageContent = message.Content;
/** Shown in place of the content while a user message is edited. */
export const MessageEditor = message.Editor;
/** Shown once the message settles. Holds the branch switcher and a `KindToolbar` of actions. */
export const MessageToolbar = message.Toolbar;
/** Wrap a `KindToolbarButton` in each action: `<MessageCopy><KindToolbarButton aria-label="Copy" /></MessageCopy>`. */
export const MessageCopy = message.Copy;

export type MessageRegenerateProps = Omit<ComponentProps<typeof message.Regenerate>, "children"> & {
  /** The `KindToolbarButton` that regenerates, or opens the menu while there are `regenerateOptions`. */
  children?: ReactNode;
  /** The menu, while there are `regenerateOptions`: `<MessageRegenerateContent />` by default. */
  menuContent?: ReactNode;
};

/**
 * Wraps the toolbar button that regenerates. While the message has `regenerateOptions`, the button opens a menu of
 * them instead, rendered through UI SDK's `MenuTrigger`, so it keeps its place in the toolbar's arrow-key order.
 */
export function MessageRegenerate({
  children,
  menuContent = DEFAULT_CONTENT,
  ...props
}: MessageRegenerateProps) {
  return (
    <message.Regenerate {...props}>
      {({ menu }) =>
        menu && isValidElement<Record<string, unknown>>(children) ? (
          <KindMenu {...menu}>
            <message.RegenerateTrigger>
              <MenuTrigger render={children} />
            </message.RegenerateTrigger>
            {menuContent}
          </KindMenu>
        ) : (
          children
        )
      }
    </message.Regenerate>
  );
}

function Rows({ options }: { options: MessageRegenerateContentState["options"] }) {
  return options.map((option) =>
    option.items ? (
      <KindMenuSub key={option.id}>
        <KindMenuSubTrigger>
          <KindMenuItemContent icon={option.icon} label={option.label} description={option.description} />
          <span data-menu-chevron="" />
        </KindMenuSubTrigger>
        <KindMenuSubContent>
          <Rows options={option.items} />
        </KindMenuSubContent>
      </KindMenuSub>
    ) : (
      <KindMenuItem key={option.id} value={option.id} label={option.label}>
        <KindMenuItemContent icon={option.icon} label={option.label} description={option.description} />
      </KindMenuItem>
    ),
  );
}

export type MessageRegenerateRowsProps = MessageRegenerateContentState;

/** The regenerate menu's rows: "Try again", a separator, then the options, a submenu for each with `items`. */
export function MessageRegenerateRows({ tryAgain, options }: MessageRegenerateRowsProps) {
  return (
    <>
      <Rows options={[tryAgain]} />
      <KindMenuSeparator />
      <Rows options={options} />
    </>
  );
}

export type MessageRegenerateContentProps = Omit<ComponentProps<typeof KindMenuContent>, "children"> & {
  /** What the menu holds, or a function of its rows: the rows by default. */
  children?: ReactNode | ((state: MessageRegenerateContentState) => ReactNode);
};

/** The regenerate menu: UI SDK's `MenuContent` holding the rows unless you pass children. Props go to it. */
export function MessageRegenerateContent({
  children = DEFAULT_ROWS,
  ...props
}: MessageRegenerateContentProps) {
  return (
    <message.RegenerateContent>
      {(state) => (
        // Hidden from agents, which use the Message's own `regenerate`. Kept in the page while closed, as on web, so
        // the mark keeps Menu out of the snapshot while only its trigger would show.
        <KindMenuContent align="start" sideOffset={6} keepMounted data-agent-hidden="" {...props}>
          {typeof children === "function" ? children(state) : children}
        </KindMenuContent>
      )}
    </message.RegenerateContent>
  );
}

const DEFAULT_ROWS = (state: MessageRegenerateContentState) => <MessageRegenerateRows {...state} />;
// Shared, so an update doesn't render the default content's wrapper again.
const DEFAULT_CONTENT = <MessageRegenerateContent />;

export const MessageEdit = message.Edit;
export const MessageBranch = message.Branch;
export const MessageBranchPrevious = message.BranchPrevious;
/** Shows the branch, like "2 of 3". */
export function MessageBranchLabel(props: Omit<ComponentProps<typeof message.BranchLabel>, "children">) {
  return <message.BranchLabel {...props}>{({ label }) => label}</message.BranchLabel>;
}
export const MessageBranchNext = message.BranchNext;

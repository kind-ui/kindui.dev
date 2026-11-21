"use client";

import {
  type ThreadListGridState,
  type ThreadListLinkState,
  type ThreadListMenuContentState,
  type ThreadListTimeState,
  threadListPrimitive,
} from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, memo, type ReactNode } from "react";
import {
  KindAlertDialog,
  KindAlertDialogBackdrop,
  KindAlertDialogContent,
  KindAlertDialogDescription,
  KindAlertDialogTitle,
} from "./internal/alert-dialog.js";
import { KindMenu, KindMenuContent, KindMenuItem } from "./internal/menu.js";

const parts = createParts(threadListPrimitive, {
  root: "nav",
  new: "button",
  viewport: "div",
  grid: "div",
  heading: "div",
  "heading-cell": "div",
  row: "div",
  "link-cell": "div",
  link: "a",
  status: "span",
  unread: "span",
  time: "span",
  editor: "input",
  "more-cell": "div",
  more: "button",
  menu: "div",
  "menu-content": "div",
  dialog: "div",
  "dialog-error": "span",
  "dialog-cancel": "button",
  "dialog-delete": "button",
  end: "div",
  retry: "button",
});

export type ThreadListProps = ComponentProps<typeof parts.Root>;

/**
 * The threads as a navigation grid, grouped by pinned, the host's groups and date, with New chat above and one menu
 * of Rename, Pin, Share and Delete for every row. Any `children` replace the default parts.
 */
export function ThreadList({ children = DEFAULT_PARTS, ...props }: ThreadListProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export type ThreadListNewProps = ComponentProps<typeof parts.New>;

/** Calls `onNew`. Reads "New chat" unless you pass children. Rendered only while `onNew` is set. */
export function ThreadListNew({ children = NEW_CHAT, ...props }: ThreadListNewProps) {
  return <parts.New {...props}>{children}</parts.New>;
}

/** Scrolls the rows, of which it renders only those in view. Holds a `ThreadListGrid` and a `ThreadListEnd`. */
export const ThreadListViewport = parts.Viewport;

export type ThreadListGridProps = ComponentProps<typeof parts.Grid>;

/** A `ThreadListHeading` or `ThreadListRow` for each row in view, unless you pass children. */
export function ThreadListGrid({ children = DEFAULT_ROWS, ...props }: ThreadListGridProps) {
  return <parts.Grid {...props}>{children}</parts.Grid>;
}

const DEFAULT_ROWS = ({ visible, rows }: ThreadListGridState) =>
  visible.map((item) =>
    rows[item.index]?.type === "heading" ? (
      <ThreadListHeading key={item.key} value={item.key} />
    ) : (
      <ThreadListRow key={item.key} value={item.key} />
    ),
  );

export type ThreadListHeadingProps = ComponentProps<typeof parts.Heading>;

/** A group's heading, by its row key. Memoized, so rows that didn't change aren't rendered again. */
export const ThreadListHeading = memo(function ThreadListHeading(props: ThreadListHeadingProps) {
  return (
    <parts.Heading {...props}>
      <parts.HeadingCell value={props.value}>{({ label }) => label}</parts.HeadingCell>
    </parts.Heading>
  );
});

export type ThreadListRowProps = Omit<ComponentProps<typeof parts.Row>, "children"> & {
  /**
   * What the link shows, a function of its `{ value, title }`. Define it once outside a render, so the row stays
   * memoized as the list scrolls.
   */
  children?: (state: ThreadListLinkState) => ReactNode;
};

/**
 * A thread's row, by its id: its link, which also opens the row's menu on a right-click or Shift+F10, how long ago it
 * changed, and its More button, which takes the time's place on hover and focus. Memoized, so rows that didn't change aren't rendered again.
 */
export const ThreadListRow = memo(function ThreadListRow({ children, ...props }: ThreadListRowProps) {
  return (
    <parts.Row {...props}>
      <parts.LinkCell value={props.value}>
        <ThreadListLink value={props.value}>{children}</ThreadListLink>
        <parts.Editor value={props.value} type="text" />
        <parts.Time value={props.value}>{TIME}</parts.Time>
      </parts.LinkCell>
      <parts.MoreCell value={props.value}>
        <parts.More value={props.value} data-kind-icon-button="" data-kind-size="sm">
          {ELLIPSIS}
        </parts.More>
      </parts.MoreCell>
    </parts.Row>
  );
});

const TIME = ({ label }: ThreadListTimeState) => label;

export type ThreadListLinkProps = ComponentProps<typeof parts.Link>;

/** A thread's link: its title, then its status and unread marks, unless you pass children. */
export function ThreadListLink({ children = DEFAULT_LINK, ...props }: ThreadListLinkProps) {
  return <parts.Link {...props}>{children}</parts.Link>;
}

const DEFAULT_LINK = ({ value, title }: ThreadListLinkState) => (
  <>
    <span data-thread-list-title="">{title}</span>
    <parts.Status value={value} />
    <parts.Unread value={value} />
  </>
);

export type ThreadListMenuProps = { children?: ReactNode };

/** UI SDK Menu, shared by every row, holding a `ThreadListMenuContent` unless you pass children. */
export function ThreadListMenu({ children = MENU_CONTENT }: ThreadListMenuProps) {
  return <parts.Menu>{(menu) => <KindMenu {...menu}>{children}</KindMenu>}</parts.Menu>;
}

export type ThreadListMenuContentProps = Omit<ComponentProps<typeof KindMenuContent>, "children"> & {
  /** The menu's items, a function of its thread and actions: a menu item for each action by default. */
  children?: (state: ThreadListMenuContentState) => ReactNode;
};

/** UI SDK's `MenuContent` with Rename, Pin or Unpin, Share and Delete, each while its callback is set. */
export function ThreadListMenuContent({ children = DEFAULT_ITEMS, ...props }: ThreadListMenuContentProps) {
  return (
    <parts.MenuContent>
      {(state) => (
        // Hidden from agents, which use the Thread List's own actions. Kept mounted, so Menu never shows up beside it.
        <KindMenuContent
          align="end"
          sideOffset={4}
          finalFocus={state.finalFocus}
          keepMounted
          data-agent-hidden=""
          {...props}
        >
          {children(state)}
        </KindMenuContent>
      )}
    </parts.MenuContent>
  );
}

const DEFAULT_ITEMS = ({ actions }: ThreadListMenuContentState) =>
  actions.map((action) => (
    <KindMenuItem
      key={action.value}
      value={action.value}
      data-destructive={action.value === "delete" ? "" : undefined}
    >
      <span data-thread-list-icon={action.value} aria-hidden="true" />
      {action.label}
    </KindMenuItem>
  ));

export type ThreadListDialogProps = { children?: ReactNode };

/**
 * The Alert Dialog Delete opens: "Delete chat?", the thread's title, and Cancel and Delete, unless you pass children
 * for the answers. Rendered only while `onDelete` is set and `confirmDelete` is on.
 */
export function ThreadListDialog({ children = DEFAULT_ANSWERS }: ThreadListDialogProps) {
  return (
    <parts.Dialog>
      {({ controller, dismissible, initialFocus, finalFocus, title, description }) => (
        <KindAlertDialog controller={controller} dismissible={dismissible}>
          <KindAlertDialogBackdrop />
          <KindAlertDialogContent initialFocus={initialFocus} finalFocus={finalFocus}>
            <KindAlertDialogTitle>{title}</KindAlertDialogTitle>
            <KindAlertDialogDescription>{description}</KindAlertDialogDescription>
            {children}
          </KindAlertDialogContent>
        </KindAlertDialog>
      )}
    </parts.Dialog>
  );
}

export type ThreadListDialogErrorProps = ComponentProps<typeof parts.DialogError>;

/** "Couldn't delete. Try again." after a delete fails, unless you pass children. */
export function ThreadListDialogError({
  children = "Couldn't delete. Try again.",
  ...props
}: ThreadListDialogErrorProps) {
  return <parts.DialogError {...props}>{children}</parts.DialogError>;
}

export type ThreadListDialogCancelProps = ComponentProps<typeof parts.DialogCancel>;

/** Closes the dialog. Reads "Cancel" unless you pass children. */
export function ThreadListDialogCancel({ children = "Cancel", ...props }: ThreadListDialogCancelProps) {
  return <parts.DialogCancel {...props}>{children}</parts.DialogCancel>;
}

export type ThreadListDialogDeleteProps = ComponentProps<typeof parts.DialogDelete>;

/** Calls `onDelete`. Reads "Delete" unless you pass children. */
export function ThreadListDialogDelete({ children = "Delete", ...props }: ThreadListDialogDeleteProps) {
  return <parts.DialogDelete {...props}>{children}</parts.DialogDelete>;
}

export type ThreadListEndProps = ComponentProps<typeof parts.End>;

/** After the rows while loading more: "Loading more chats", or "Couldn't load more chats" and Retry. */
export function ThreadListEnd({
  children = ({ status }) =>
    status === "loading" ? (
      <>
        <span aria-hidden="true" data-status-mark="" data-status="running" />
        Loading more chats
      </>
    ) : (
      <>
        Couldn't load more chats
        <ThreadListRetry />
      </>
    ),
  ...props
}: ThreadListEndProps) {
  return <parts.End {...props}>{children}</parts.End>;
}

export type ThreadListRetryProps = ComponentProps<typeof parts.Retry>;

/** Calls `onLoadMore` again. Reads "Retry" unless you pass children. */
export function ThreadListRetry({ children = "Retry", ...props }: ThreadListRetryProps) {
  return <parts.Retry {...props}>{children}</parts.Retry>;
}

// Shared, so an update doesn't render the default parts' wrappers again.
const NEW_CHAT = (
  <>
    <span data-thread-list-icon="new" aria-hidden="true" />
    New chat
  </>
);
const ELLIPSIS = <span data-thread-list-icon="more" aria-hidden="true" />;
const MENU_CONTENT = <ThreadListMenuContent />;
const DEFAULT_ANSWERS = (
  <div data-thread-list-answers="">
    <ThreadListDialogError />
    <ThreadListDialogCancel />
    <ThreadListDialogDelete />
  </div>
);
const DEFAULT_PARTS = (
  <>
    <ThreadListNew />
    <ThreadListViewport>
      <ThreadListGrid />
      <ThreadListEnd />
    </ThreadListViewport>
    <ThreadListMenu />
    <ThreadListDialog />
  </>
);

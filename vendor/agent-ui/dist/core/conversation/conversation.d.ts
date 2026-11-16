import { definePrimitive, type FocusRecovery, type SlotDefinition, type StickToBottom, type VirtualItem, type Virtualizer } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import { type MotionMode } from "../motion/index.js";
export type ConversationController = {
    /** Scrolls to the newest message and follows new content again. */
    scrollToEnd: () => void;
    /** Call right before adding older messages above: the next `messageCount` increase keeps the reader's place and isn't counted as new. */
    prepend: () => void;
    /** Whether new content scrolls into view. */
    isFollowing: () => boolean;
    /** The rows to render now, with `virtualize`. */
    getRows: () => readonly VirtualItem[];
};
/** A handle for the `controller` option, to scroll and read a conversation from outside it. */
export declare const createConversationController: () => ConversationController;
export type ConversationOptions = {
    /**
     * How many messages the conversation holds. Drives the new-message count, the empty part and virtualization.
     * @default 0
     */
    messageCount?: number;
    /**
     * Renders only the rows in view, with `createVirtualizer`. Read once, when the conversation mounts.
     * @default false
     */
    virtualize?: boolean;
    /**
     * A row's height before it is measured, in pixels, with `virtualize`.
     * @default 120
     */
    estimateRowHeight?: number;
    /**
     * A stable key for the message at an index, so measured heights follow messages when the list changes, with `virtualize`.
     * @default String(index)
     */
    rowKey?: (index: number) => string;
    /** Called with the rows to render whenever they change, with `virtualize`. */
    onRowsChange?: (rows: readonly VirtualItem[]) => void;
    /** A handle from `createConversationController()`, to scroll and read the conversation from outside it. */
    controller?: ConversationController;
    /**
     * `"auto"` follows `prefers-reduced-motion`.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type ConversationState = {
    /** The `messageCount` option. */
    messageCount: number;
    /** The `virtualize` option the conversation mounted with. */
    virtualize: boolean;
    /** The `motion` option. */
    motion: MotionMode;
    /** Whether new content scrolls into view. Set by `createStickToBottom`; listed in `controlled` for the agent snapshot only. */
    following: boolean;
    /** Messages added while not following. In the agent snapshot too. */
    newCount: number;
    /** Whether the jump control is still animating out after following resumed. */
    jumpExiting: boolean;
    /** The rows to render, with `virtualize`; empty otherwise. */
    rows: readonly VirtualItem[];
    /** The height of every row together, in pixels, with `virtualize`. */
    size: number;
};
export type ConversationApi = ConversationController & {
    /** Follows the viewport's end, for its slot. */
    stick: StickToBottom;
    /** Picks the rows in view with `virtualize`, for the viewport and row slots. */
    virtual: Virtualizer;
    /** Moves focus to the viewport when a focused row or the jump control leaves. */
    recovery: FocusRecovery;
    /** Plays the mount-only entrance on a row that wasn't rendered before. */
    enterRow: (el: HTMLElement, index: number) => void;
};
type RowProps = {
    value: string;
    index: number;
};
type ConversationSlot<Props extends object, Public extends object = Record<never, never>> = SlotDefinition<ConversationState, ConversationApi, Props, Public>;
export type ConversationPrimitive = ReturnType<typeof definePrimitive<ConversationOptions, ConversationState, ConversationApi, {
    root: ConversationSlot<BaseSlotProps>;
    viewport: ConversationSlot<BaseSlotProps>;
    content: ConversationSlot<BaseSlotProps, {
        rows: readonly VirtualItem[];
    }>;
    row: ConversationSlot<RowProps & BaseSlotProps>;
    jump: ConversationSlot<BaseSlotProps>;
    empty: ConversationSlot<BaseSlotProps>;
}>>;
export declare const conversationPrimitive: ConversationPrimitive;
export {};
//# sourceMappingURL=conversation.d.ts.map
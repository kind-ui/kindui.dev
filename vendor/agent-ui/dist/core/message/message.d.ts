import { type ChangeDetails, definePrimitive, type InlineEdit, type InlineEditReason, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import type { MessageStatus, Role } from "../../types/index.js";
import { type MotionMode } from "../motion/index.js";
/** The branch switcher's text: `"2 of 3"` for the second of three. */
export declare const branchLabel: (index: number, count: number) => string;
export type MessageBranchChangeReason = "previous-press" | "next-press" | "imperative";
export type MessageOptions = {
    /**
     * Who wrote it. Not `role`, which is the element's ARIA role.
     * @default "assistant"
     */
    messageRole?: Role;
    /**
     * Where the response is. The toolbar shows once it's no longer submitted or streaming.
     * @default "complete"
     */
    status?: MessageStatus;
    /**
     * What `copy` writes and editing starts from.
     * @default ""
     */
    text?: string;
    /**
     * The response shown, from 0. Change it in `onBranchChange`.
     * @default 0
     */
    branchIndex?: number;
    /**
     * How many responses there are. The switcher shows above 1.
     * @default 1
     */
    branchCount?: number;
    /** Called with the index of the response someone asks for. Pass it back as `branchIndex` to show it. */
    onBranchChange?: (index: number, details: ChangeDetails<MessageBranchChangeReason>) => void;
    /** Called before `text` is copied. Cancel it to copy something else yourself. */
    onCopy?: (text: string, details: ChangeDetails<"copy-press" | "imperative">) => void;
    /** Called to ask for a new response. Shows the regenerate action while set. */
    onRegenerate?: (text: string, details: ChangeDetails<"regenerate-press" | "imperative">) => void;
    /** Called with the new text when someone saves an edit. Shows the edit action on user messages while set. */
    onEdit?: (text: string, details: ChangeDetails<InlineEditReason>) => void;
    /**
     * `"auto"` follows `prefers-reduced-motion`.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type MessageState = {
    /** The `messageRole` option. */
    role: Role;
    status: MessageStatus;
    branchIndex: number;
    branchCount: number;
    /** Whether `onRegenerate` is set. */
    canRegenerate: boolean;
    /** Whether it's a user message with `onEdit`. */
    canEdit: boolean;
    motion: MotionMode;
    /** `"message"` while the text is being edited, else `null`. */
    editing: string | null;
    copied: boolean;
};
export type MessageApi = {
    /** Copies `text` and resolves with whether it worked. */
    copy: (event?: Event) => Promise<boolean>;
    /** Calls `onRegenerate`. Offered once the message settles, while `onRegenerate` is set. */
    readonly regenerate: ((event?: Event) => void) | undefined;
    /** Starts editing in place. Offered once a user message with `onEdit` settles. */
    readonly edit: ((event?: Event) => void) | undefined;
    /** Asks `onBranchChange` for the response at an index, from 0. Offered when there's more than one. */
    readonly setBranch: ((index: number, event?: Event) => void) | undefined;
    inlineEdit: InlineEdit;
    /** Plays the toolbar's entrance when the message settles while mounted, not when it mounts settled. */
    enterToolbar: (el: HTMLElement) => void;
};
type MessageSlot<Public extends object = Record<never, never>> = SlotDefinition<MessageState, MessageApi, BaseSlotProps, Public>;
export type MessagePrimitive = ReturnType<typeof definePrimitive<MessageOptions, MessageState, MessageApi, Record<"root" | "avatar" | "content" | "editor" | "toolbar" | "copy" | "regenerate" | "edit" | "branch" | "branch-previous" | "branch-next", MessageSlot> & {
    "branch-label": MessageSlot<{
        label: string;
    }>;
}>>;
export declare const messagePrimitive: MessagePrimitive;
export {};
//# sourceMappingURL=message.d.ts.map
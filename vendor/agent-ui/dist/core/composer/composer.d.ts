import { type ChangeDetails, createFocusRecovery, createInputHistory, definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { FileInputOptions, FileInputValueChangeReason } from "@ui-sdk/core/file-input";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import { type TokenInputController, type TokenInputOptions } from "@ui-sdk/core/token-input";
import type { TriggerDefinition } from "@ui-sdk/core/trigger-menu";
import type { AttachmentsOptions } from "../attachments/index.js";
import { type FileIntake } from "../file-input-events.js";
import { type MotionMode } from "../motion/index.js";
import { type ComposerDraft, type ComposerToken, type ComposerTriggerItem } from "./draft.js";
/**
 * `"input-change"`: typing, tokens or `setValue` with an event. `"history-key"`: ArrowUp or ArrowDown brought
 * back an earlier prompt. `"picker"`, `"drop"`, `"paste"`, `"reset"`: File Input attached files.
 * `"remove-press"`: an attachment was removed. `"submit"`: a resolved submission cleared the draft.
 * `"imperative"`: an `api` call without an event.
 */
export type ComposerValueChangeReason = "input-change" | "history-key" | FileInputValueChangeReason | "submit";
export type ComposerOptions = {
    /** The draft. Passing it controls it: change it in `onValueChange`. Don't pass it with `defaultValue`. */
    value?: ComposerDraft;
    /** The draft at first, when `value` isn't passed. */
    defaultValue?: ComposerDraft;
    /** Called when the draft changes, with what caused it. Cancel `details` to refuse the change. */
    onValueChange?: (value: ComposerDraft, details: ChangeDetails<ComposerValueChangeReason>) => void;
    /**
     * Called with the draft when it's sent. Return a promise to keep the composer pending: resolving clears the
     * draft unless it changed meanwhile, and rejecting keeps it. Otherwise the draft clears right away.
     */
    onSubmit?: (draft: ComposerDraft) => unknown;
    /** Called when Stop is pressed. While it's set, Stop takes Send's place during a pending submission. */
    onStop?: () => void;
    /**
     * Which keys send. With `"enter"`, Shift+Enter starts a new line; with `"mod-enter"`, Enter does.
     * @default "enter"
     */
    submitOn?: "enter" | "mod-enter";
    /** What typing `@` suggests. */
    mentions?: readonly ComposerTriggerItem[];
    /** What typing `/` at the start of a line suggests. */
    commands?: readonly ComposerTriggerItem[];
    /** The file types to accept, like the `accept` attribute. Other files attach with an error. */
    accept?: string;
    /** The largest file to accept, in bytes. Larger files attach with an error. */
    maxSize?: number;
    /** Earlier prompts, oldest first, that ArrowUp brings back. */
    history?: readonly string[];
    /**
     * Stops editing, attaching, sending and every agent action.
     * @default false
     */
    disabled?: boolean;
    /**
     * Makes an agent ask a person before it runs any composer action, unless the host's `allow` lets it through.
     * @default true
     */
    agentConfirm?: boolean;
    /**
     * `"auto"` follows `prefers-reduced-motion`.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type ComposerState = {
    /** The draft: its text, tokens and attachments. */
    value: ComposerDraft;
    /** Whether a submission is in flight; Send is locked until it settles. */
    pending: boolean;
    /** Whether `onStop` is set, so Stop takes Send's place while pending. */
    canStop: boolean;
    /** The options of the same name, with their defaults. */
    disabled: boolean;
    submitOn: "enter" | "mod-enter";
    agentConfirm: boolean;
    mentions: readonly ComposerTriggerItem[] | undefined;
    commands: readonly ComposerTriggerItem[] | undefined;
    accept: string | undefined;
    maxSize: number | undefined;
    motion: MotionMode;
};
type TokenToInsert = Omit<ComposerToken, "id">;
export type ComposerApi = {
    /** The current draft; the owner's `value` when controlled. */
    getValue: () => ComposerDraft;
    /** Replaces the draft. A string replaces only the text and keeps the attachments. Returns whether the change was accepted. */
    setValue: (value: ComposerDraft | string, event?: Event) => boolean;
    /** Inserts a mention or command at the caret. Returns whether it was inserted. */
    insertToken: (token: TokenToInsert) => boolean;
    /** Removes an attachment from the draft by its `id`. Returns whether the change was accepted. */
    removeAttachment: (id: string, event?: Event) => boolean;
    /** Sends the draft, unless there's nothing to send, it's pending or disabled, or `onSubmit` isn't set. */
    submit: (event?: Event) => void;
    /** Calls `onStop`. Offered only while a submission is pending and `onStop` is set. */
    readonly stop: ((event?: Event) => void) | undefined;
    /** Drives the Token Input; render layers pass it as its `controller`. */
    tokenInput: TokenInputController;
    /** Takes in what File Input accepted or rejected. */
    intake: FileIntake;
    /**
     * Starts syncing the draft and the Token Input once the Token Input has attached the controller, which on web
     * can happen after the input part binds. Returns a cleanup; calling it again while connected does nothing.
     */
    connectInput: () => () => void;
    history: ReturnType<typeof createInputHistory<string>>;
    recovery: ReturnType<typeof createFocusRecovery>;
    /** Plays Send's entrance when it comes back from Stop, not when the composer mounts. */
    enterSubmit: (el: HTMLElement) => void;
    /** Each part's state for render functions, kept while what it's built from stays the same. */
    partState: {
        root: (state: ComposerState) => ComposerRootState;
        input: (state: ComposerState) => ComposerInputState;
        triggerMenu: (state: ComposerState) => ComposerTriggerMenuState;
        attachments: (state: ComposerState) => ComposerAttachmentsState;
    };
};
export type ComposerRootState = {
    /** Props for the File Input around the form's content. */
    fileInput: Pick<FileInputOptions, "accept" | "maxSize" | "multiple" | "disabled" | "onValueChange" | "onReject">;
};
export type ComposerInputState = {
    /** Props for the Token Input inside the input part. */
    tokenInput: Pick<TokenInputOptions, "controller" | "defaultValue" | "submitShortcut" | "disabled">;
};
export type ComposerTriggerMenuState = {
    triggers: TriggerDefinition[];
};
/** Props for the Attachments inside the attachments part. `onRemove` is left out while the composer is disabled. */
export type ComposerAttachmentsState = Required<Pick<AttachmentsOptions, "items" | "motion">> & Pick<AttachmentsOptions, "onRemove">;
type ComposerSlot<Public extends object = Record<never, never>> = SlotDefinition<ComposerState, ComposerApi, BaseSlotProps, Public>;
export type ComposerPrimitive = ReturnType<typeof definePrimitive<ComposerOptions, ComposerState, ComposerApi, {
    root: ComposerSlot<ComposerRootState>;
    input: ComposerSlot<ComposerInputState>;
    "trigger-menu": ComposerSlot<ComposerTriggerMenuState>;
    attachments: ComposerSlot<ComposerAttachmentsState>;
    submit: ComposerSlot;
    stop: ComposerSlot;
}>>;
export declare const composerPrimitive: ComposerPrimitive;
export {};
//# sourceMappingURL=composer.d.ts.map
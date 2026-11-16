import { type ChangeDetails, createFocusRecovery, createRovingFocus, definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import { type MotionMode } from "../motion/index.js";
/** One attachment. `file` or `url` gives an image its preview; `error` shows in place of its size. */
export type AttachmentItem = {
    id: string;
    name: string;
    /** In bytes. */
    size?: number;
    mediaType?: string;
    url?: string;
    file?: File;
    error?: "type" | "size";
};
export declare const ATTACHMENT_ERRORS: {
    readonly type: "File type not accepted";
    readonly size: "File is too large";
};
/** What a chip says under the name: its error, else its size. */
export declare const attachmentDetail: (item: AttachmentItem) => string;
export type AttachmentsOptions = {
    /**
     * The chips, in order, keyed by `id`.
     * @default []
     */
    items?: readonly AttachmentItem[];
    /** Called with an item's `id` when someone removes it. While it's set, chips can be removed. */
    onRemove?: (id: string, details: ChangeDetails<"remove-press" | "imperative">) => void;
    /**
     * `"auto"` follows `prefers-reduced-motion`.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type AttachmentsState = {
    items: readonly AttachmentItem[];
    /** The item holding the list's Tab stop. */
    focused: string | null;
    /** Whether `onRemove` is set. */
    canRemove: boolean;
    motion: MotionMode;
    /** Object URLs for image files, by item id, made once each item binds. */
    previews: Readonly<Record<string, string>>;
};
type ItemProps = {
    value: string;
};
export type AttachmentState = {
    item: AttachmentItem | undefined;
    /** An image's preview URL. */
    preview: string | undefined;
    /** The error, else the size, for people. */
    detail: string;
};
export type AttachmentsApi = {
    /** Removes an item by its `id`, through `onRemove`. Offered only while `onRemove` is set. */
    readonly remove: ((id: string, event?: Event) => void) | undefined;
    roving: ReturnType<typeof createRovingFocus<AttachmentsState, ItemProps>>;
    recovery: ReturnType<typeof createFocusRecovery<ItemProps>>;
    /** A host `url`, else the object URL made for an image file once its item bound. */
    previewOf: (item: AttachmentItem) => string | undefined;
    /** Makes an image file's object URL in the browser, so the server and hydration render the icon. */
    bindPreview: (id: string) => void;
    /** Plays an item's entrance when it's added, not when the list mounts with it. */
    enterItem: (el: HTMLElement, id: string) => void;
};
type AttachmentsSlot<Props extends object, Public extends object = Record<never, never>> = SlotDefinition<AttachmentsState, AttachmentsApi, Props, Public>;
export type AttachmentsPrimitive = ReturnType<typeof definePrimitive<AttachmentsOptions, AttachmentsState, AttachmentsApi, {
    root: AttachmentsSlot<BaseSlotProps>;
    item: AttachmentsSlot<ItemProps & BaseSlotProps, AttachmentState>;
    remove: AttachmentsSlot<ItemProps & BaseSlotProps>;
}>>;
export declare const attachmentsPrimitive: AttachmentsPrimitive;
export {};
//# sourceMappingURL=attachments.d.ts.map
import { type ChangeDetails, definePrimitive, type Part, type SlotDefinition } from "@ui-sdk/core";
import { type FileInputOptions, type FileInputValueChangeReason, type FileRejection } from "@ui-sdk/core/file-input";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import { type MotionMode } from "../motion/index.js";
export type UploadStatus = "queued" | "uploading" | "done" | "error" | "cancelled";
/** One file the host is uploading. */
export type UploadItem = {
    id: string;
    name: string;
    /** In bytes. */
    size: number;
    /** From 0 to 100. */
    progress: number;
    status: UploadStatus;
    /**
     * Shown in place of the size while `status` is `"error"`.
     * @default "Upload failed"
     */
    error?: string;
};
export type UploaderFilesDetails = ChangeDetails<FileInputValueChangeReason>;
export type UploaderOptions = {
    /**
     * The uploads, in order, keyed by `id`.
     * @default []
     */
    items?: readonly UploadItem[];
    /** Called with the files someone chooses, drops or pastes that pass `accept` and `maxSize`. */
    onFiles?: (files: File[], details: UploaderFilesDetails) => void;
    /** Called with the files `accept` or `maxSize` turns down, each with its `reasons`. */
    onReject?: (rejected: FileRejection[], details: UploaderFilesDetails) => void;
    /** Called with an item's `id` when it's cancelled. While it's set, queued and uploading items show Cancel. */
    onCancel?: (id: string, details: ChangeDetails<"cancel-press" | "imperative">) => void;
    /** Called with an item's `id` when it's retried. While it's set, failed items show Retry. */
    onRetry?: (id: string, details: ChangeDetails<"retry-press" | "imperative">) => void;
    /** The file types to accept, like the `accept` attribute. Without it, any file. */
    accept?: string;
    /** The largest file to accept, in bytes. Without it, any size. */
    maxSize?: number;
    /**
     * `"auto"` follows `prefers-reduced-motion`.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type UploaderState = {
    items: readonly UploadItem[];
    canCancel: boolean;
    canRetry: boolean;
    accept: string | undefined;
    maxSize: number | undefined;
    motion: MotionMode;
};
/** Props for the File Input inside the root. */
export type UploaderRootState = {
    fileInput: Pick<FileInputOptions, "accept" | "maxSize" | "multiple" | "onValueChange" | "onReject">;
};
export type UploadItemState = {
    item: UploadItem | undefined;
    /** The error, else what the upload is doing and the file's size, for people. */
    detail: string;
};
type ItemProps = {
    value: string;
};
export type UploaderApi = {
    /** Cancels a queued or uploading item by its `id`, through `onCancel`. Offered while one can be cancelled. */
    readonly cancel: ((id: string, event?: Event) => void) | undefined;
    /** Retries a failed item by its `id`, through `onRetry`. Offered while one has failed. */
    readonly retry: ((id: string, event?: Event) => void) | undefined;
    /** Plays an item's entrance when it's added, not when the uploader mounts with it. */
    enterItem: (el: HTMLElement, id: string) => void;
    /** Hears File Input's events on web, and marks the end of the first frame. */
    bindRoot: (el: HTMLElement) => () => void;
    /** Tracks an action button, so focus moves to a neighbor's when a cancelled item's button leaves. */
    bindAction: (el: HTMLElement, part: Part<UploaderState, UploaderApi, ItemProps>) => () => void;
    partState: {
        root: (state: UploaderState) => UploaderRootState;
    };
};
type UploaderSlot<Props extends object, Public extends object = Record<never, never>> = SlotDefinition<UploaderState, UploaderApi, Props, Public>;
export type UploaderPrimitive = ReturnType<typeof definePrimitive<UploaderOptions, UploaderState, UploaderApi, {
    root: UploaderSlot<BaseSlotProps, UploaderRootState>;
    list: UploaderSlot<BaseSlotProps>;
    item: UploaderSlot<ItemProps & BaseSlotProps, UploadItemState>;
    action: UploaderSlot<ItemProps & BaseSlotProps>;
}>>;
/** What an upload row says under the name. */
export declare function uploadDetail(item: UploadItem): string;
export declare const uploaderPrimitive: UploaderPrimitive;
export {};
//# sourceMappingURL=uploader.d.ts.map
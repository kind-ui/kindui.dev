import type { FileInputValueChangeReason, FileRejection } from "@ui-sdk/core/file-input";
/** What a composer or uploader does with files File Input took in or turned down. */
export type FileIntake = {
    accept: (files: File[], reason: FileInputValueChangeReason, cancel: () => void) => void;
    reject: (rejected: FileRejection[], reason: FileInputValueChangeReason) => void;
};
/**
 * Hands `<ui-file-input>`'s `valuechange` and `reject` events to `intake`, as React's props do.
 * `@ui-sdk/web` fires them on the file input alone, without bubbling, so `container` hears them as they capture.
 */
export declare function forwardFileInputEvents(container: HTMLElement, intake: FileIntake): () => void;
//# sourceMappingURL=file-input-events.d.ts.map
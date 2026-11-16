import { definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import { type MotionMode } from "../motion/index.js";
export type StreamingTextOptions = {
    /**
     * The whole text so far: text that extends the last fades its new part in, and any other text replaces it at once.
     * @default ""
     */
    text?: string;
    /**
     * Shows a caret after the text, for while it streams.
     * @default false
     */
    caret?: boolean;
    /**
     * Whether new text fades in: `"auto"` follows `prefers-reduced-motion`, and `"reduced"` or `"none"` append it at once.
     * @default "auto"
     */
    motion?: MotionMode;
};
/** A run of text: one still fading in, or everything before those, folded into one. `id` keys its element. */
export type StreamingTextChunk = {
    id: number;
    text: string;
};
export type StreamingTextState = {
    text: string;
    chunks: readonly StreamingTextChunk[];
    caret: boolean;
    motion: MotionMode;
};
export type StreamingTextApi = {
    /** Fades a chunk in when it was appended at full motion, never one that mounted with the text or replaced it. */
    enterChunk: (el: HTMLElement, id: number) => void;
};
type ChunkProps = {
    value: number;
};
type StreamingTextSlot<Props extends object, Public extends object = Record<never, never>> = SlotDefinition<StreamingTextState, StreamingTextApi, Props, Public>;
export type StreamingTextPrimitive = ReturnType<typeof definePrimitive<StreamingTextOptions, StreamingTextState, StreamingTextApi, {
    root: StreamingTextSlot<BaseSlotProps, {
        chunks: readonly StreamingTextChunk[];
    }>;
    chunk: StreamingTextSlot<ChunkProps & BaseSlotProps>;
    caret: StreamingTextSlot<BaseSlotProps>;
}>>;
export declare const streamingTextPrimitive: StreamingTextPrimitive;
export {};
//# sourceMappingURL=streaming-text.d.ts.map
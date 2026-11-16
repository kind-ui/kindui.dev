import { definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import type { Highlight } from "../code-block/code-block.js";
import { type MarkdownBlock, type MarkdownEngine } from "../markdown/index.js";
export type MarkdownOptions = {
    /** The markdown to show, so far. Appending parses only the blocks that changed. */
    source?: string;
    /**
     * Whether `source` is still growing, so the last block is repaired before it renders.
     * @default false
     */
    streaming?: boolean;
    /** Passed to each code block to color its code. A new function doesn't color code already shown again. */
    highlight?: Highlight;
    /**
     * Parses `source`, read once when the view mounts; pass your own to read its `stats()`.
     * @default createMarkdownEngine()
     */
    engine?: MarkdownEngine;
};
export type MarkdownState = {
    /** The `engine` option, or the view's own. */
    engine: MarkdownEngine;
    /** The engine's blocks for `source`: final ones keep their object across appends. */
    blocks: MarkdownBlock[];
    /** The `streaming` option. */
    streaming: boolean;
    /** The `highlight` option. */
    highlight: Highlight | undefined;
};
type MarkdownPublic = Pick<MarkdownState, "blocks" | "streaming" | "highlight">;
export type MarkdownViewPrimitive = ReturnType<typeof definePrimitive<MarkdownOptions, MarkdownState, Record<never, never>, {
    root: SlotDefinition<MarkdownState, Record<never, never>, BaseSlotProps, MarkdownPublic>;
}>>;
export declare const markdownViewPrimitive: MarkdownViewPrimitive;
export {};
//# sourceMappingURL=markdown-view.d.ts.map
import { definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
export type MarkdownTableState = {
    copied: boolean;
};
export type MarkdownTableApi = {
    /** Copies the table as tab-separated text, a row per line. */
    copy: () => Promise<boolean>;
};
type MarkdownTableSlot = SlotDefinition<MarkdownTableState, MarkdownTableApi, BaseSlotProps, Record<never, never>>;
export type MarkdownTablePrimitive = ReturnType<typeof definePrimitive<Record<never, never>, MarkdownTableState, MarkdownTableApi, Record<"root" | "header" | "copy" | "table", MarkdownTableSlot>>>;
export declare const markdownTablePrimitive: MarkdownTablePrimitive;
export {};
//# sourceMappingURL=markdown-table.d.ts.map
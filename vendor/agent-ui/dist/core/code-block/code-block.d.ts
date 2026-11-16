import { type ChangeDetails, definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
/**
 * A run of highlighted code. Its `content` may hold line breaks. `color` is any CSS color: a
 * `light-dark()` pair follows `color-scheme` like the theme tokens do.
 */
export type Token = {
    content: string;
    color?: string;
    fontStyle?: "italic" | "bold";
};
/** Resolves the tokens of `code`, whose contents joined are `code`. No highlighter ships with Kind UI. */
export type Highlight = (code: string, language: string | undefined) => Promise<Token[]>;
export type CodeBlockWrapChangeReason = "wrap-press" | "imperative";
export type CodeBlockOptions = {
    /**
     * The code to show.
     * @default ""
     */
    code?: string;
    /** The code's language, like `"ts"`, shown in the header and passed to `highlight`. */
    language?: string;
    /**
     * Resolves colored tokens for the code; plain text shows until it does. While code streams in, the highlighted
     * start shows with the rest plain. A new function each render is fine, and a rejection isn't retried until `code`
     * or `language` changes.
     */
    highlight?: Highlight;
    /** Whether long lines wrap. Passing it controls it: change it in `onWrapChange`. Don't pass it with `defaultWrap`. */
    wrap?: boolean;
    /**
     * Whether long lines wrap at first, when `wrap` isn't passed.
     * @default false
     */
    defaultWrap?: boolean;
    /** Called before wrapping turns on or off; cancel `details` to keep it as it is. */
    onWrapChange?: (wrap: boolean, details: ChangeDetails<CodeBlockWrapChangeReason>) => void;
    /**
     * Numbers each line.
     * @default false
     */
    lineNumbers?: boolean;
    /**
     * Whether the code is still arriving, so the view follows its end.
     * @default false
     */
    streaming?: boolean;
};
export type CodeBlockState = {
    code: string;
    language: string | undefined;
    wrap: boolean;
    lineNumbers: boolean;
    streaming: boolean;
    /** The code split into lines of tokens: highlighted where a result covers it, plain after. */
    lines: Token[][];
    copied: boolean;
};
export type CodeBlockApi = {
    /** Copies the code, and resolves with whether the clipboard write went through. */
    copy: () => Promise<boolean>;
    isWrapped: () => boolean;
    /** Returns whether the change was accepted. */
    setWrap: (wrap: boolean, event?: Event) => boolean;
    /** Turns line wrapping on or off, and returns whether the change was accepted. */
    toggleWrap: (event?: Event) => boolean;
};
type CodeBlockSlot<Public extends object = Record<never, never>> = SlotDefinition<CodeBlockState, CodeBlockApi, BaseSlotProps, Public>;
export type CodeBlockPrimitive = ReturnType<typeof definePrimitive<CodeBlockOptions, CodeBlockState, CodeBlockApi, {
    root: CodeBlockSlot;
    header: CodeBlockSlot;
    language: CodeBlockSlot<{
        language: string | undefined;
    }>;
    wrap: CodeBlockSlot;
    copy: CodeBlockSlot;
    code: CodeBlockSlot<{
        lines: Token[][];
    }>;
}>>;
export declare const codeBlockPrimitive: CodeBlockPrimitive;
export {};
//# sourceMappingURL=code-block.d.ts.map
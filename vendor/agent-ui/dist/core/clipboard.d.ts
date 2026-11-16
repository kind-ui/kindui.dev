import { type PrimitiveContext } from "@ui-sdk/core";
type CopyContext = Pick<PrimitiveContext<unknown, {
    copied: boolean;
}, string>, "store" | "onDestroy">;
/**
 * Writes text to the clipboard (spec §2 exception: UI SDK has no clipboard utility), sets `copied` for
 * `COPIED_MS` and announces the outcome. Resolves with whether the write went through.
 */
export declare function createCopy(context: CopyContext): (text: string) => Promise<boolean>;
export {};
//# sourceMappingURL=clipboard.d.ts.map
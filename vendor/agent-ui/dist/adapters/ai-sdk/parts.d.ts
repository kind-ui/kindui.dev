/** @ts-ignore `ai` is an optional peer; without it these types are `any`. Kept in the emitted `.d.ts`. */
import type { UIMessage } from "ai";
import type { Part } from "../../types/index.js";
export type UIPart = UIMessage["parts"][number];
export interface PartContext {
    messageId: string;
    index: number;
}
/** Maps one AI SDK UI message part. Returns `null` only for `step-start`; unknown types become `data`. */
export declare function fromUIMessagePart(part: UIPart, ctx: PartContext): Part | null;
//# sourceMappingURL=parts.d.ts.map
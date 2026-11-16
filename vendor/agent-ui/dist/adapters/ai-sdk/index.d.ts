/** @ts-ignore `ai` is an optional peer; without it these types are `any`. Kept in the emitted `.d.ts`. */
import type { ChatStatus, UIMessage } from "ai";
import type { Message } from "../../types/index.js";
export type { ApprovalDecision, ApprovalResponse } from "./approval.js";
export { toApprovalResponse } from "./approval.js";
export type { PartContext } from "./parts.js";
export { fromUIMessagePart } from "./parts.js";
export { fromChatStatus } from "./status.js";
/**
 * Maps AI SDK UI messages to neutral messages. The chat `status` describes the in-flight turn, so it applies to
 * the last message; every earlier message is `"complete"`.
 */
export declare function fromUIMessages(messages: readonly UIMessage[], status?: ChatStatus): Message[];
//# sourceMappingURL=index.d.ts.map
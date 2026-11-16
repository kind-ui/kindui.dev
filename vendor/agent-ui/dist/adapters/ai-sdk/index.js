import { fromUIMessagePart } from "./parts.js";
import { fromChatStatus } from "./status.js";
export { toApprovalResponse } from "./approval.js";
export { fromUIMessagePart } from "./parts.js";
export { fromChatStatus } from "./status.js";
/**
 * Maps AI SDK UI messages to neutral messages. The chat `status` describes the in-flight turn, so it applies to
 * the last message; every earlier message is `"complete"`.
 */
export function fromUIMessages(messages, status) {
    const last = messages.length - 1;
    return messages.map((message, messageIndex) => {
        const parts = message.parts.flatMap((part, index) => fromUIMessagePart(part, { messageId: message.id, index }) ?? []);
        const neutral = {
            id: message.id,
            role: message.role,
            status: messageIndex === last && status !== undefined ? fromChatStatus(status) : "complete",
            parts,
        };
        const metadata = message.metadata;
        if (typeof metadata === "object" && metadata !== null && !Array.isArray(metadata)) {
            neutral.metadata = metadata;
        }
        return neutral;
    });
}
//# sourceMappingURL=index.js.map
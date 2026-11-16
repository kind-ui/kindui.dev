import { conversationPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";

const conversation = createParts(conversationPrimitive, {
  root: "div",
  viewport: "div",
  content: "div",
  row: "div",
  jump: "button",
  empty: "div",
});

/** Pass `controller={createConversationController()}` (from `@kind-ui/agent-ui/core`) to scroll it from outside. */
export const Conversation = conversation.Root;
export const ConversationViewport = conversation.Viewport;
/**
 * With `virtualize`, render rows from its state, keyed by index so each measurement stays with its row:
 * `{({ rows }) => rows.map((row) => <ConversationRow key={row.index} value={row.key} index={row.index} …/>)}`.
 */
export const ConversationContent = conversation.Content;
export const ConversationRow = conversation.Row;
/** Its text is the new-message count, written by the primitive; render it without children. */
export const ConversationJump = conversation.Jump;
export const ConversationEmpty = conversation.Empty;

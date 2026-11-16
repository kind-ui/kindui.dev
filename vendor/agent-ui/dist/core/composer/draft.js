export const emptyDraft = () => ({ text: "", tokens: [], attachments: [] });
/** Whether the draft has something to send: text that isn't only whitespace, a token, or a valid attachment. */
export const isSubmittable = (draft) => draft.text.trim() !== "" ||
    draft.tokens.length > 0 ||
    draft.attachments.some((attachment) => attachment.error === undefined);
// Tokens are part of `text`, so comparing text compares them too.
const sameDraft = (a, b) => a.text === b.text &&
    a.attachments.length === b.attachments.length &&
    a.attachments.every((attachment, index) => attachment.id === b.attachments[index]?.id);
/** The draft once a submission settles: a resolved one clears only if nothing changed since; a rejected one keeps it. */
export function draftAfterSettle(current, submitted, outcome) {
    return outcome === "resolved" && sameDraft(current, submitted) ? emptyDraft() : current;
}
//# sourceMappingURL=draft.js.map
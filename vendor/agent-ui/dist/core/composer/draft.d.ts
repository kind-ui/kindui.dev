/** A mention or command inside the draft, inserted from the Trigger Menu or with `insertToken`. */
export type ComposerToken = {
    id: string;
    kind: "mention" | "command";
    value: string;
    label: string;
};
/** A file attached to the draft. `error` marks one the host's `accept` or `maxSize` rules out. */
export type ComposerAttachment = {
    id: string;
    file: File;
    name: string;
    /** In bytes. */
    size: number;
    mediaType: string;
    error?: "type" | "size";
};
/**
 * What the composer holds. `text` is the Token Input's codec text, where each token reads
 * `[@label](kind:value)`, so a draft round-trips; `tokens` lists the same tokens in order.
 */
export type ComposerDraft = {
    text: string;
    tokens: ComposerToken[];
    attachments: ComposerAttachment[];
};
/** A suggestion the Trigger Menu offers after `@` or `/`. */
export type ComposerTriggerItem = {
    value: string;
    label: string;
    description?: string;
};
export declare const emptyDraft: () => ComposerDraft;
/** Whether the draft has something to send: text that isn't only whitespace, a token, or a valid attachment. */
export declare const isSubmittable: (draft: ComposerDraft) => boolean;
/** The draft once a submission settles: a resolved one clears only if nothing changed since; a rejected one keeps it. */
export declare function draftAfterSettle(current: ComposerDraft, submitted: ComposerDraft, outcome: "resolved" | "rejected"): ComposerDraft;
//# sourceMappingURL=draft.d.ts.map
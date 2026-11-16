export interface FollowState {
    /** Whether new content scrolls into view, as `createStickToBottom` reports it. */
    following: boolean;
    /** Messages added below while not following, less any removed since. */
    newCount: number;
    /** The message count the state was last given. */
    count: number;
}
/** `prepend` is a count that grew above the reader (older history), which is never new. */
export type FollowEvent = {
    type: "count";
    count: number;
} | {
    type: "prepend";
    count: number;
} | {
    type: "following";
    following: boolean;
};
/** Spec §2 exception "Conversation new-message counter". `following` events come only from `createStickToBottom`. */
export declare function nextFollowState(prev: FollowState, event: FollowEvent): FollowState;
//# sourceMappingURL=follow.d.ts.map
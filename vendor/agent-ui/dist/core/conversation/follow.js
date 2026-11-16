/** Spec §2 exception "Conversation new-message counter". `following` events come only from `createStickToBottom`. */
export function nextFollowState(prev, event) {
    if (event.type === "following") {
        return event.following ? { ...prev, following: true, newCount: 0 } : { ...prev, following: false };
    }
    if (prev.following || event.type === "prepend")
        return { ...prev, count: event.count };
    return { ...prev, count: event.count, newCount: Math.max(0, prev.newCount + event.count - prev.count) };
}
//# sourceMappingURL=follow.js.map
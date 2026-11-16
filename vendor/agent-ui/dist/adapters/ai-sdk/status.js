const statuses = {
    submitted: "submitted",
    streaming: "streaming",
    ready: "complete",
    error: "error",
};
export function fromChatStatus(status) {
    return statuses[status];
}
//# sourceMappingURL=status.js.map
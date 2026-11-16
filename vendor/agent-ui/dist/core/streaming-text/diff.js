/** `next` either extends `prev`, and only the rest is new, or replaces it: shrunk, regenerated or edited. */
export function streamingTextDiff(prev, next) {
    return next.startsWith(prev) ? { kind: "append", appended: next.slice(prev.length) } : { kind: "reset" };
}
//# sourceMappingURL=diff.js.map
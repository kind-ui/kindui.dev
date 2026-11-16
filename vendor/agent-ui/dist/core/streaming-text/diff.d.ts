export type StreamingTextDiff = {
    kind: "append";
    appended: string;
} | {
    kind: "reset";
};
/** `next` either extends `prev`, and only the rest is new, or replaces it: shrunk, regenerated or edited. */
export declare function streamingTextDiff(prev: string, next: string): StreamingTextDiff;
//# sourceMappingURL=diff.d.ts.map
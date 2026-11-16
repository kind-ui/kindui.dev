/**
 * Motion tokens, in seconds. `agent-ui.css` mirrors them as `--kind-duration-*` and `--kind-ease*`
 * for CSS motion; `tests/core/motion.test.mjs` fails when the two differ.
 */
export declare const DURATION: {
    readonly fast: 0.15;
    readonly base: 0.2;
    readonly panel: 0.28;
    readonly reduced: 0.12;
};
/** Cubic-bezier control points. `out` is CSS `ease-out` and motion's `"easeOut"`. */
export declare const EASE: {
    readonly standard: readonly [0.2, 0.8, 0.2, 1];
    readonly out: readonly [0, 0, 0.58, 1];
};
/** Full-motion spring for the helper. It settles in `DURATION.panel`, the CSS panel height transition. */
export declare const SPRING: {
    readonly type: "spring";
    readonly visualDuration: 0.28;
    readonly bounce: 0;
};
//# sourceMappingURL=tokens.d.ts.map
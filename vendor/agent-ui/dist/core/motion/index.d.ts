import { type MotionMode, type MotionPreset, type ResolvedMotion } from "./presets.js";
export { type MotionMode, type MotionPreset, type ResolvedMotion, reducedKeyframes, resolveMotion, } from "./presets.js";
export interface MotionOptions {
    /** Defaults to `"auto"`, which follows `prefers-reduced-motion`. */
    motion?: MotionMode;
}
/** What `motion` resolves to on this page: `"auto"` follows `prefers-reduced-motion`. */
export declare function resolvedMotion(motion?: MotionMode): ResolvedMotion;
/** Calls `listener` when the person turns reduced motion on or off. Returns a cleanup. */
export declare function onReducedMotionChange(listener: () => void): () => void;
/**
 * Animates `el` in. Call it from a part's `bind` (or on mount) with UI SDK presence: this applies
 * `animateIn`'s `data-starting-style`. During a running `exit`, it reverses from the current value.
 * `"dot-flow"` starts a staggered loop over `[data-dot]` children; the promise resolves once the
 * container has entered, and the loop runs until `exit`.
 */
export declare function enter(el: HTMLElement, preset: MotionPreset, options?: MotionOptions): Promise<void>;
/**
 * Animates `el` out and resolves once it may unmount. Presence uses UI SDK `animateOut`
 * (`data-ending-style` and `inert` while leaving). Calling `exit` again returns the same promise.
 * An `enter` during the exit rejects it with an `AbortError`: the element stays.
 */
export declare function exit(el: HTMLElement, preset: MotionPreset, options?: MotionOptions): Promise<void>;
/**
 * FLIP: animates `el` from `measureBefore` (its `getBoundingClientRect()` before the change) to
 * where it is now, on the `translate` and `scale` properties, so it runs alongside `enter` and `exit`.
 * Reduced motion and `"none"` apply the new layout at once, with no translate or scale.
 */
export declare function layout(el: HTMLElement, measureBefore: DOMRect, options?: MotionOptions): Promise<void>;
/** Stops `el`'s enter, exit and `"dot-flow"` loop at once and clears their styles, for a part that unbinds. */
export declare function cancel(el: HTMLElement): void;
/**
 * Starts or stops `el`'s `"dot-flow"` loop for `motion` without playing its entrance again, for a motion change
 * after `enter`. Reduced motion and `"none"` hold the dots still.
 */
export declare function flow(el: HTMLElement, options?: MotionOptions): void;
//# sourceMappingURL=index.d.ts.map
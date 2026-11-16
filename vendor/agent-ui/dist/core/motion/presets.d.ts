export type MotionMode = "auto" | "reduced" | "none";
export type MotionPreset = "fade" | "fade-up" | "expand" | "dot-flow";
export type ResolvedMotion = "full" | "reduced" | "none";
/** Staggered fade that flows across loading dots, never synchronized blinking. */
export declare const DOT_FLOW: {
    readonly selector: "[data-dot]";
    readonly duration: 1.2;
    readonly stagger: 0.15;
    readonly dim: 0.3;
};
/** `"auto"` follows `prefers-reduced-motion`. */
export declare function resolveMotion(mode: MotionMode, prefersReduced: boolean): ResolvedMotion;
export type Frame = {
    opacity: number;
    transform?: string;
};
/** Hidden then shown, for an entrance. `expand` also animates height, which the helper measures. */
export declare function fullKeyframes(preset: MotionPreset): [Frame, Frame];
/** The reduced version of every preset: an opacity fade only, with no translate, scale, or height. */
export declare function reducedKeyframes(preset: MotionPreset): [Frame, Frame];
//# sourceMappingURL=presets.d.ts.map
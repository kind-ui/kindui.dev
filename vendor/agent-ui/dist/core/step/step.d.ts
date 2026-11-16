import { type ChangeDetails, definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import type { StepStatus } from "../../types/index.js";
import type { MotionMode } from "../motion/index.js";
import { type StepAutoOpen } from "./auto-open.js";
export type StepOpenChangeReason = "trigger-press" | "find-in-page" | "imperative" | "auto";
export type StepOptions = {
    /**
     * What the step is doing. The icon shows it.
     * @default "pending"
     */
    status?: StepStatus;
    /** Written as `data-kind`, for styling by step type. */
    kind?: string;
    /** Names the step in announcements. Defaults to the title part's text. */
    title?: string;
    /** Whether the content shows. Passing it controls it: change it in `onOpenChange`. */
    open?: boolean;
    /**
     * Whether the content shows at first, when `open` isn't passed. Defaults to open while `status` is `running` or
     * `awaiting-input`, unless `autoOpen` is `"never"`.
     */
    defaultOpen?: boolean;
    /** Called when the step opens or closes, with what caused it. */
    onOpenChange?: (open: boolean, details: ChangeDetails<StepOpenChangeReason>) => void;
    /**
     * With `"running"`, the step opens while running or awaiting input and closes on completion, until someone
     * toggles it. With `"never"`, only a person or your code opens it.
     * @default "running"
     */
    autoOpen?: StepAutoOpen;
    /** Written as `--kind-step-duration`. */
    durationSeconds?: number;
    /**
     * `"auto"` follows `prefers-reduced-motion`.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type StepState = {
    open: boolean;
    status: StepStatus;
    kind: string | undefined;
    durationSeconds: number | undefined;
    motion: MotionMode;
    userToggled: boolean;
    exiting: boolean;
};
type Cause = {
    reason?: StepOpenChangeReason;
    event?: Event | undefined;
};
export type StepApi = {
    /** The current open state; the owner's `open` when controlled. */
    isOpen: () => boolean;
    setOpen: (open: boolean, cause?: Cause) => boolean;
    /** Opens the step. Returns whether the change was accepted. */
    expand: () => boolean;
    /** Closes the step. Returns whether the change was accepted. */
    collapse: () => boolean;
    toggle: (event?: Event) => boolean;
};
type StepSlot = SlotDefinition<StepState, StepApi, BaseSlotProps, Record<never, never>>;
export type StepPrimitive = ReturnType<typeof definePrimitive<StepOptions, StepState, StepApi, Record<"root" | "trigger" | "icon" | "title" | "meta" | "content" | "children", StepSlot>>>;
export declare const stepPrimitive: StepPrimitive;
export {};
//# sourceMappingURL=step.d.ts.map
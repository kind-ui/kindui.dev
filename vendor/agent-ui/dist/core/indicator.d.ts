import type { definePrimitive, SlotDefinition, SlotFactory } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
import { type MotionMode } from "./motion/index.js";
export type IndicatorOptions = {
    /**
     * Names the status, and screen readers read it again when it changes. Loader and Thinking Indicator also show
     * it; it defaults to "Loading", "Thinking" or "Typing".
     */
    label?: string;
    /**
     * Whether the dots move: `"auto"` follows `prefers-reduced-motion`, and `"reduced"` or `"none"` hold them still.
     * @default "auto"
     */
    motion?: MotionMode;
};
export type IndicatorState = {
    label: string;
    motion: MotionMode;
};
type IndicatorApi = Record<never, never>;
type IndicatorSlot<Public extends object = Record<never, never>> = SlotDefinition<IndicatorState, IndicatorApi, BaseSlotProps, Public>;
export type IndicatorPrimitive = ReturnType<typeof definePrimitive<IndicatorOptions, IndicatorState, IndicatorApi, {
    root: IndicatorSlot;
    label: IndicatorSlot<{
        label: string;
    }>;
    dots: IndicatorSlot;
    dot: IndicatorSlot;
}>>;
/**
 * Everything but the name of Loader, Thinking Indicator and Typing Indicator: a polite `status` named by its
 * label, and decorative dots that flow with the `"dot-flow"` preset.
 */
export declare const indicator: (defaultLabel: string) => {
    options: {
        readonly label: "string";
        readonly motion: "string";
    };
    state: (options: IndicatorOptions) => IndicatorState;
    sync: (options: IndicatorOptions) => IndicatorState;
    api: () => IndicatorApi;
    slots: (slot: SlotFactory<IndicatorState, IndicatorApi>) => {
        root: SlotDefinition<IndicatorState, IndicatorApi, BaseSlotProps, {}>;
        label: SlotDefinition<IndicatorState, IndicatorApi, NoInfer<BaseSlotProps> & BaseSlotProps, NoInfer<{
            label: string;
        }>>;
        dots: SlotDefinition<IndicatorState, IndicatorApi, BaseSlotProps, {}>;
        dot: SlotDefinition<IndicatorState, IndicatorApi, BaseSlotProps, {}>;
    };
    agent: {
        actions: never[];
    };
};
export {};
//# sourceMappingURL=indicator.d.ts.map
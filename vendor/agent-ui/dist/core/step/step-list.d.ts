import { createFocusRecovery, createRovingFocus, definePrimitive, type SlotDefinition } from "@ui-sdk/core";
import type { BaseSlotProps } from "@ui-sdk/core/renderer";
export type StepListOptions = Record<never, never>;
export type StepListState = {
    focused: string | null;
};
type ItemProps = {
    value: string;
};
export type StepListApi = {
    roving: ReturnType<typeof createRovingFocus<StepListState, ItemProps>>;
    recovery: ReturnType<typeof createFocusRecovery<ItemProps>>;
};
type StepListSlot<Props extends object> = SlotDefinition<StepListState, StepListApi, Props, Record<never, never>>;
export type StepListPrimitive = ReturnType<typeof definePrimitive<StepListOptions, StepListState, StepListApi, {
    root: StepListSlot<BaseSlotProps>;
    item: StepListSlot<ItemProps & BaseSlotProps>;
}>>;
export declare const stepListPrimitive: StepListPrimitive;
export {};
//# sourceMappingURL=step-list.d.ts.map
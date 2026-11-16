import type { StepStatus } from "../../types/index.js";
export type StepAutoOpen = "running" | "never";
export interface NextOpenInput {
    status: StepStatus;
    prevStatus: StepStatus;
    open: boolean;
    userToggled: boolean;
    autoOpen: StepAutoOpen;
}
/** Spec §5: opens on `running` / `awaiting-input`, closes on `complete`, and stops once someone toggles the step. */
export declare function nextOpen({ status, prevStatus, open, userToggled, autoOpen }: NextOpenInput): boolean;
//# sourceMappingURL=auto-open.d.ts.map
import type { Approval } from "../../types/index.js";
export interface ApprovalDecision {
    approved: boolean;
    reason?: string;
}
export interface ApprovalResponse extends ApprovalDecision {
    id: string;
}
/** The argument a host passes to the SDK's `addToolApprovalResponse`. */
export declare function toApprovalResponse(approval: Approval, decision: ApprovalDecision): ApprovalResponse;
/** The subset of an AI SDK tool approval the neutral `Approval` keeps. */
export interface SdkApproval {
    id: string;
    approved?: boolean;
    reason?: string;
    isAutomatic?: boolean;
}
export declare function fromSdkApproval(approval: SdkApproval): Approval;
//# sourceMappingURL=approval.d.ts.map
/** The argument a host passes to the SDK's `addToolApprovalResponse`. */
export function toApprovalResponse(approval, decision) {
    const response = { id: approval.approvalId, approved: decision.approved };
    if (decision.reason !== undefined)
        response.reason = decision.reason;
    return response;
}
// The SDK has no request generation. Opaque fields (`descriptor`, `signature`, …) carry no authority.
export function fromSdkApproval(approval) {
    const answered = approval.approved !== undefined;
    const mapped = {
        approvalId: approval.id,
        generation: 0,
        state: approval.isAutomatic ? "auto" : answered ? "responded" : "requested",
    };
    if (approval.approved !== undefined) {
        mapped.decision =
            approval.reason === undefined
                ? { approved: approval.approved }
                : { approved: approval.approved, reason: approval.reason };
    }
    return mapped;
}
//# sourceMappingURL=approval.js.map
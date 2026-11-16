export function isTextPart(part) {
    return part.type === "text";
}
export function isReasoningPart(part) {
    return part.type === "reasoning";
}
export function isFilePart(part) {
    return part.type === "file";
}
export function isSourcePart(part) {
    return part.type === "source";
}
export function isStepPart(part) {
    return part.type === "step";
}
export function isDataPart(part) {
    return part.type === "data";
}
export function isToolStep(step) {
    return step.kind === "tool";
}
export function hasOutput(call) {
    return call.output !== undefined;
}
//# sourceMappingURL=guards.js.map
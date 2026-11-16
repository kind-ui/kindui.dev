import type { Part } from "./message.js";
import type { Step } from "./step.js";
import type { ToolCall } from "./tool.js";
export declare function isTextPart(part: Part): part is Extract<Part, {
    type: "text";
}>;
export declare function isReasoningPart(part: Part): part is Extract<Part, {
    type: "reasoning";
}>;
export declare function isFilePart(part: Part): part is Extract<Part, {
    type: "file";
}>;
export declare function isSourcePart(part: Part): part is Extract<Part, {
    type: "source";
}>;
export declare function isStepPart(part: Part): part is Extract<Part, {
    type: "step";
}>;
export declare function isDataPart(part: Part): part is Extract<Part, {
    type: "data";
}>;
export declare function isToolStep(step: Step): step is Extract<Step, {
    kind: "tool";
}>;
export declare function hasOutput(call: ToolCall): call is ToolCall & {
    output: NonNullable<ToolCall["output"]>;
};
//# sourceMappingURL=guards.d.ts.map
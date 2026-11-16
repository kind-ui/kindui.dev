import { fromSdkApproval } from "./approval.js";
function isToolPart(part) {
    return part.type === "dynamic-tool" || part.type.startsWith("tool-");
}
const toolStatus = {
    "input-streaming": "running",
    "input-available": "running",
    "approval-requested": "awaiting-input",
    "approval-responded": "running",
    "output-available": "complete",
    "output-error": "error",
    "output-denied": "cancelled",
};
function fromToolPart(part) {
    const dynamic = part.type === "dynamic-tool";
    // A `dynamic-tool` part with `dynamic: false` is a static tool the SDK normalized; it keeps its static origin.
    const name = dynamic ? part.toolName : part.type.slice("tool-".length);
    const call = {
        toolCallId: part.toolCallId,
        name,
        dynamic: dynamic && part.dynamic !== false,
        input: { state: part.state === "input-streaming" ? "streaming" : "ready", value: part.input },
    };
    if (part.state === "output-available") {
        call.output = { state: part.preliminary ? "preliminary" : "available", value: part.output };
    }
    if (part.state === "output-error") {
        call.outcome = "error";
        // Older static parts carried error input in the deprecated `rawInput`.
        if (part.input === undefined && "rawInput" in part)
            call.input.value = part.rawInput;
    }
    if (part.state === "output-denied")
        call.outcome = "denied";
    if (part.approval)
        call.approval = fromSdkApproval(part.approval);
    const step = { id: part.toolCallId, kind: "tool", status: toolStatus[part.state], title: name, call };
    if (part.state === "output-error")
        step.error = { message: part.errorText };
    return { type: "step", id: part.toolCallId, step };
}
/** Maps one AI SDK UI message part. Returns `null` only for `step-start`; unknown types become `data`. */
export function fromUIMessagePart(part, ctx) {
    const id = `${ctx.messageId}:${ctx.index}`;
    const type = part?.type;
    if (typeof type !== "string")
        return { type: "data", id, name: "unknown", data: part };
    if (part.type === "step-start")
        return null;
    if (part.type === "text" || part.type === "reasoning") {
        return { type: part.type, id, text: part.text, state: part.state ?? "done" };
    }
    if (part.type === "file") {
        return {
            type: "file",
            id,
            name: part.filename ?? part.mediaType,
            mediaType: part.mediaType,
            url: part.url,
        };
    }
    if (part.type === "source-url") {
        const source = { id: part.sourceId, title: part.title ?? part.url, url: part.url };
        return { type: "source", id, source };
    }
    if (part.type === "source-document") {
        const source = { id: part.sourceId, title: part.title, mediaType: part.mediaType };
        return { type: "source", id, source };
    }
    // A tool state this adapter does not know is passed through as data rather than guessed.
    if (isToolPart(part) && Object.hasOwn(toolStatus, part.state))
        return fromToolPart(part);
    if (type.startsWith("data-") && "data" in part) {
        return { type: "data", id, name: type.slice("data-".length), data: part.data };
    }
    return { type: "data", id, name: type, data: part };
}
//# sourceMappingURL=parts.js.map
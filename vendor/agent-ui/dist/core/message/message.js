import { createInlineEdit, definePrimitive, dispatch, } from "@ui-sdk/core";
import { createCopy } from "../clipboard.js";
import { enter } from "../motion/index.js";
/** The branch switcher's text: `"2 of 3"` for the second of three. */
export const branchLabel = (index, count) => `${index + 1} of ${count}`;
const EDITING = "message";
const settled = (status) => status !== "submitted" && status !== "streaming";
const presentation = (options) => {
    const role = options.messageRole ?? "assistant";
    return {
        role,
        status: options.status ?? "complete",
        branchIndex: options.branchIndex ?? 0,
        branchCount: options.branchCount ?? 1,
        canRegenerate: options.onRegenerate !== undefined,
        canEdit: role === "user" && options.onEdit !== undefined,
        motion: options.motion ?? "auto",
    };
};
export const messagePrimitive = definePrimitive({
    name: "kind-message",
    options: {
        messageRole: "string",
        status: "string",
        text: "string",
        branchIndex: "number",
        branchCount: "number",
        onBranchChange: "callback",
        onCopy: "callback",
        onRegenerate: "callback",
        onEdit: "callback",
        motion: "string",
    },
    state: (options) => ({
        ...presentation(options),
        editing: null,
        copied: false,
    }),
    sync: presentation,
    controlled: ["branchIndex", "branchCount", "status"],
    api: (context) => {
        const { store } = context;
        const copy = createCopy(context);
        const text = () => context.options().text ?? "";
        let streamed = !settled(store.get().status);
        context.onOptions((options) => {
            if (!settled(options.status ?? "complete"))
                streamed = true;
        });
        const inlineEdit = createInlineEdit(context, {
            key: "editing",
            value: text,
            commit: (_id, value, details) => !dispatch(context, "onEdit", value, details),
        });
        const setBranch = (index, event) => {
            const { branchIndex, branchCount } = store.get();
            if (!Number.isInteger(index) || index < 0 || index >= branchCount || index === branchIndex)
                return;
            const reason = !event ? "imperative" : index < branchIndex ? "previous-press" : "next-press";
            dispatch(context, "onBranchChange", index, event ? { reason, event } : { reason });
        };
        return {
            copy: async (event) => {
                const value = text();
                if (dispatch(context, "onCopy", value, event ? { reason: "copy-press", event } : { reason: "imperative" }))
                    return false;
                return copy(value);
            },
            get regenerate() {
                const { canRegenerate, status } = store.get();
                if (!canRegenerate || !settled(status))
                    return undefined;
                return (event) => void dispatch(context, "onRegenerate", text(), event ? { reason: "regenerate-press", event } : { reason: "imperative" });
            },
            get edit() {
                const { canEdit, status } = store.get();
                if (!canEdit || !settled(status))
                    return undefined;
                return (event) => void inlineEdit.start(EDITING, event ? { reason: "imperative", event } : undefined);
            },
            get setBranch() {
                return store.get().branchCount > 1 ? setBranch : undefined;
            },
            inlineEdit,
            enterToolbar: (el) => {
                if (streamed)
                    void enter(el, "fade", { motion: store.get().motion });
            },
        };
    },
    slots: (slot) => ({
        root: slot({
            role: "article",
            attrs: (state) => ({
                "data-role": state.role,
                "data-status": state.status,
                "data-editing": state.editing === null ? undefined : "",
            }),
        }),
        avatar: slot({
            attrs: (state) => ({ "data-role": state.role }),
        }),
        content: slot({
            present: (state) => state.editing === null,
            attrs: (state) => ({ "data-role": state.role, "data-status": state.status }),
        }),
        editor: slot({
            present: (state) => state.editing !== null,
            attrs: () => ({ "aria-label": "Edit message" }),
            on: {
                keydown: (event, { api }) => api.inlineEdit.inputKeydown(event),
                focusout: (event, { api }) => api.inlineEdit.end("focus-out", event),
            },
            bind: (el, { api }) => api.inlineEdit.bindInput(el),
        }),
        toolbar: slot({
            present: (state) => settled(state.status),
            attrs: (state) => ({ "data-role": state.role }),
            bind: (el, { api }) => api.enterToolbar(el),
        }),
        // The actions wrap UI SDK toolbar buttons and hear their clicks bubble up (spec §2, composing UI SDK).
        copy: slot({
            attrs: (state) => ({ "data-copied": state.copied ? "" : undefined }),
            on: { click: (event, { api }) => void api.copy(event) },
        }),
        regenerate: slot({
            present: (state) => state.canRegenerate,
            on: { click: (event, { api }) => api.regenerate?.(event) },
        }),
        edit: slot({
            present: (state) => state.canEdit,
            on: { click: (event, { api }) => api.edit?.(event) },
        }),
        branch: slot({
            role: "group",
            present: (state) => state.branchCount > 1,
            attrs: () => ({ "aria-label": "Responses" }),
        }),
        "branch-previous": slot({
            role: "button",
            focus: "native",
            press: ({ api, store }, event) => api.setBranch?.(store.get().branchIndex - 1, event),
            attrs: (state) => ({
                type: "button",
                "aria-label": "Previous response",
                "aria-disabled": state.branchIndex <= 0 ? "true" : undefined,
            }),
        }),
        // Web has no render function to show `label`, so `bind` writes it; React renders the same text first.
        "branch-label": slot({
            state: (state) => ({ label: branchLabel(state.branchIndex, state.branchCount) }),
            bind: (el, { store }) => {
                const write = () => {
                    const { branchIndex, branchCount } = store.get();
                    const label = branchLabel(branchIndex, branchCount);
                    if (el.textContent !== label)
                        el.textContent = label;
                };
                write();
                return store.subscribe(write);
            },
        }),
        "branch-next": slot({
            role: "button",
            focus: "native",
            press: ({ api, store }, event) => api.setBranch?.(store.get().branchIndex + 1, event),
            attrs: (state) => ({
                type: "button",
                "aria-label": "Next response",
                "aria-disabled": state.branchIndex >= state.branchCount - 1 ? "true" : undefined,
            }),
        }),
    }),
    agent: { actions: ["copy", "regenerate", "edit", "setBranch"] },
});
//# sourceMappingURL=message.js.map
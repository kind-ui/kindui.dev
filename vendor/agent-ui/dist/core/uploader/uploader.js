import { announce, createFocusRecovery, definePrimitive, dispatch, } from "@ui-sdk/core";
import { formatFileSize, } from "@ui-sdk/core/file-input";
import { forwardFileInputEvents } from "../file-input-events.js";
import { memo } from "../memo.js";
import { enter } from "../motion/index.js";
const NO_ITEMS = [];
const isActive = (item) => item.status === "queued" || item.status === "uploading";
/** What an upload row says under the name. */
export function uploadDetail(item) {
    const size = formatFileSize(item.size);
    switch (item.status) {
        case "queued":
            return `Waiting · ${size}`;
        case "uploading":
            return `${Math.round(item.progress)}% · ${size}`;
        case "done":
            return size;
        case "error":
            return item.error ?? "Upload failed";
        case "cancelled":
            return "Cancelled";
    }
}
const ANNOUNCED = { done: "uploaded", error: "failed" };
const presentation = (options) => ({
    items: options.items ?? NO_ITEMS,
    canCancel: options.onCancel !== undefined,
    canRetry: options.onRetry !== undefined,
    accept: options.accept,
    maxSize: options.maxSize,
    motion: options.motion ?? "auto",
});
const itemOf = (state, id) => state.items.find((item) => item.id === id);
/** Cancel while queued or uploading, Retry once failed, when the host offers it. */
function actionOf(state, id) {
    const item = itemOf(state, id);
    if (item && isActive(item) && state.canCancel)
        return "cancel";
    if (item?.status === "error" && state.canRetry)
        return "retry";
    return undefined;
}
export const uploaderPrimitive = definePrimitive({
    name: "kind-uploader",
    options: {
        items: "value",
        onFiles: "callback",
        onReject: "callback",
        onCancel: "callback",
        onRetry: "callback",
        accept: "string",
        maxSize: "number",
        motion: "string",
    },
    state: presentation,
    sync: presentation,
    controlled: ["items"],
    api: (context) => {
        const { store } = context;
        let statuses = new Map(store.get().items.map((item) => [item.id, item.status]));
        // Focus recovery runs after a removed item has left `items`, so keep the order from before.
        let order = [...statuses.keys()];
        let previousOrder = order;
        // An item asked to cancel or retry takes no second request until the host changes its status.
        const requested = new Set();
        context.onOptions((options) => {
            const items = options.items ?? NO_ITEMS;
            const next = new Map(items.map((item) => [item.id, item.status]));
            for (const item of items) {
                const outcome = ANNOUNCED[item.status];
                const before = statuses.get(item.id);
                if (outcome && before !== undefined && before !== item.status) {
                    announce(`${item.name} ${outcome}`, { priority: "polite" });
                }
            }
            for (const id of requested)
                if (next.get(id) !== statuses.get(id))
                    requested.delete(id);
            statuses = next;
            previousOrder = order;
            order = [...next.keys()];
        });
        const intake = {
            accept: (files, reason, cancel) => {
                // The host's items hold the uploads, so File Input keeps none of its own.
                cancel();
                if (files.length > 0)
                    void dispatch(context, "onFiles", files, { reason });
            },
            reject: (rejected, reason) => void dispatch(context, "onReject", rejected, { reason }),
        };
        const cancel = (id, event) => {
            const item = itemOf(store.get(), id);
            if (!item || !isActive(item) || requested.has(id))
                return;
            requested.add(id);
            void dispatch(context, "onCancel", id, event ? { reason: "cancel-press", event } : { reason: "imperative" });
        };
        const retry = (id, event) => {
            if (itemOf(store.get(), id)?.status !== "error" || requested.has(id))
                return;
            requested.add(id);
            void dispatch(context, "onRetry", id, event ? { reason: "retry-press", event } : { reason: "imperative" });
        };
        const root = memo((accept, maxSize) => ({
            fileInput: {
                multiple: true,
                ...(accept === undefined ? {} : { accept }),
                ...(maxSize === undefined ? {} : { maxSize }),
                onValueChange: (_files, details) => intake.accept(details.added, details.reason, details.cancel),
                onReject: (rejected, details) => intake.reject(rejected, details.reason),
            },
        }));
        const mounted = new Set(store.get().items.map((item) => item.id));
        // Web hosts can only set `items` once the element exists, so rows in the first frame count as mounted.
        let mounting = true;
        const actions = new Map();
        const recovery = createFocusRecovery({
            fallback: (lost) => {
                const ids = order.includes(lost.props.value) ? order : previousOrder;
                const index = ids.indexOf(lost.props.value);
                const after = ids.slice(index + 1);
                const before = ids.slice(0, Math.max(index, 0)).reverse();
                const neighbor = [...after, ...before].find((id) => actions.get(id)?.isConnected);
                return neighbor === undefined ? undefined : actions.get(neighbor);
            },
        });
        return {
            get cancel() {
                const { canCancel, items } = store.get();
                return canCancel && items.some(isActive) ? cancel : undefined;
            },
            get retry() {
                const { canRetry, items } = store.get();
                return canRetry && items.some((item) => item.status === "error") ? retry : undefined;
            },
            enterItem: (el, id) => {
                if (mounted.has(id))
                    return;
                mounted.add(id);
                if (!mounting)
                    void enter(el, "fade-up", { motion: store.get().motion });
            },
            bindRoot: (el) => {
                const frame = requestAnimationFrame(() => {
                    mounting = false;
                });
                const unforward = forwardFileInputEvents(el, intake);
                return () => {
                    cancelAnimationFrame(frame);
                    unforward();
                };
            },
            bindAction: (el, part) => {
                actions.set(part.props.value, el);
                const unbind = recovery.bind(el, part);
                return () => {
                    if (actions.get(part.props.value) === el)
                        actions.delete(part.props.value);
                    unbind();
                };
            },
            partState: { root: (state) => root(state.accept, state.maxSize) },
        };
    },
    slots: (slot) => ({
        root: slot({
            role: "group",
            attrs: (state) => ({ "data-motion": state.motion }),
            state: (state, { api }) => api.partState.root(state),
            bind: (el, { api }) => api.bindRoot(el),
        }),
        // Stays mounted while empty, so the first upload plays its entrance like the rest.
        list: slot({
            role: "list",
            attrs: (state) => ({ "data-empty": state.items.length === 0 ? "" : undefined }),
        }),
        item: slot({
            role: "listitem",
            props: { value: "string" },
            attrs: (state, { props }) => ({ "data-status": itemOf(state, props.value)?.status }),
            state: (state, { props }) => {
                const item = itemOf(state, props.value);
                return { item, detail: item ? uploadDetail(item) : "" };
            },
            bind: (el, { api, props }) => api.enterItem(el, props.value),
        }),
        action: slot({
            role: "button",
            focus: "native",
            props: { value: { kind: "string", from: "item" } },
            present: (state, { props }) => actionOf(state, props.value) !== undefined,
            press: ({ api, props, store }, event) => {
                // Retry turns into Cancel under the pointer, so a double click's second click must not cancel.
                if (event instanceof MouseEvent && event.detail > 1)
                    return;
                const action = actionOf(store.get(), props.value);
                if (action)
                    api[action]?.(props.value, event);
            },
            attrs: (state, { props }) => {
                const action = actionOf(state, props.value);
                const name = itemOf(state, props.value)?.name ?? "upload";
                return {
                    type: "button",
                    "aria-label": action === "retry" ? `Retry ${name}` : `Cancel ${name}`,
                    "data-action": action,
                };
            },
            bind: (el, part) => part.api.bindAction(el, part),
        }),
    }),
    agent: { actions: ["cancel", "retry"] },
});
//# sourceMappingURL=uploader.js.map
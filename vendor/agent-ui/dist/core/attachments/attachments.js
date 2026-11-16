import { createFocusRecovery, createRovingFocus, definePrimitive, dispatch, } from "@ui-sdk/core";
import { formatFileSize } from "@ui-sdk/core/file-input";
import { enter } from "../motion/index.js";
export const ATTACHMENT_ERRORS = { type: "File type not accepted", size: "File is too large" };
/** What a chip says under the name: its error, else its size. */
export const attachmentDetail = (item) => item.error ? ATTACHMENT_ERRORS[item.error] : item.size === undefined ? "" : formatFileSize(item.size);
const NO_ITEMS = [];
const presentation = (options) => ({
    items: options.items ?? NO_ITEMS,
    canRemove: options.onRemove !== undefined,
    motion: options.motion ?? "auto",
});
const isImage = (item) => item.mediaType?.startsWith("image/") ?? false;
export const attachmentsPrimitive = definePrimitive({
    name: "kind-attachments",
    options: { items: "value", onRemove: "callback", motion: "string" },
    state: (options) => ({
        ...presentation(options),
        focused: null,
        previews: {},
    }),
    sync: presentation,
    controlled: ["items"],
    api: (context) => {
        const { store } = context;
        // Recovery runs after the removed item has left `roving.items()`, so keep the order from before.
        let current = [];
        let previous = [];
        const roving = createRovingFocus(context, {
            slot: "item",
            key: "focused",
            orientation: () => "horizontal",
            onItemsChange: () => {
                previous = current;
                current = roving.items().map((item) => item.key);
            },
        });
        const recovery = createFocusRecovery({
            fallback: (lost) => {
                const order = current.includes(lost.key) ? current : previous;
                const index = order.indexOf(lost.key);
                const items = roving.items();
                const at = (key) => items.find((item) => item.key === key);
                return (at(order[index + 1]) ?? at(order[index - 1]))?.el;
            },
        });
        const made = new Map();
        const revokeGone = (items) => {
            const gone = [...made].filter(([id, { file }]) => !items.some((item) => item.id === id && item.file === file));
            for (const [id, { url }] of gone) {
                URL.revokeObjectURL(url);
                made.delete(id);
            }
            return gone.map(([id]) => id);
        };
        context.onOptions((options) => {
            const gone = revokeGone(options.items ?? NO_ITEMS);
            if (gone.length === 0)
                return;
            const previews = { ...store.get().previews };
            for (const id of gone)
                delete previews[id];
            store.set({ previews });
        });
        context.onDestroy(() => void revokeGone(NO_ITEMS));
        const mounted = new Set(store.get().items.map((item) => item.id));
        const remove = (id, event) => void dispatch(context, "onRemove", id, event ? { reason: "remove-press", event } : { reason: "imperative" });
        return {
            get remove() {
                return store.get().canRemove ? remove : undefined;
            },
            roving,
            recovery,
            previewOf: (item) => (isImage(item) ? (item.url ?? store.get().previews[item.id]) : undefined),
            bindPreview: (id) => {
                const item = store.get().items.find((entry) => entry.id === id);
                if (!item?.file || item.url !== undefined || !isImage(item) || made.get(id)?.file === item.file)
                    return;
                const url = URL.createObjectURL(item.file);
                made.set(id, { file: item.file, url });
                store.set({ previews: { ...store.get().previews, [id]: url } });
            },
            enterItem: (el, id) => {
                if (mounted.has(id))
                    return;
                mounted.add(id);
                void enter(el, "fade-up", { motion: store.get().motion });
            },
        };
    },
    slots: (slot) => ({
        root: slot({ role: "list", attrs: (state) => ({ "data-motion": state.motion }) }),
        item: slot({
            role: "listitem",
            props: { value: "string" },
            focus: "roving",
            attrs: (state, part) => {
                const item = state.items.find((entry) => entry.id === part.props.value);
                return {
                    tabindex: part.api.roving.tabIndex(state, part),
                    "data-error": item?.error,
                    "data-image": item && isImage(item) ? "" : undefined,
                    "aria-keyshortcuts": state.canRemove ? "Delete" : undefined,
                };
            },
            state: (state, { props, api }) => {
                const item = state.items.find((entry) => entry.id === props.value);
                return {
                    item,
                    preview: item && api.previewOf(item),
                    detail: item ? attachmentDetail(item) : "",
                };
            },
            on: {
                keydown: (event, { el, api, props }) => {
                    const key = event;
                    if ((key.key === "Delete" || key.key === "Backspace") && api.remove) {
                        key.preventDefault();
                        api.remove(props.value, key);
                    }
                    else if (el) {
                        api.roving.keydown(key, el);
                    }
                },
            },
            bind: (el, part) => {
                part.api.bindPreview(part.props.value);
                part.api.enterItem(el, part.props.value);
                const unbindFocus = part.api.roving.bind(el, part);
                const unbindRecovery = part.api.recovery.bind(el, part);
                return () => {
                    unbindFocus();
                    unbindRecovery();
                };
            },
        }),
        // Pointer only, like Token Input's remove part: keyboard users press Delete on the item.
        remove: slot({
            props: { value: { kind: "string", from: "item" } },
            present: (state) => state.canRemove,
            press: ({ api, props }, event) => api.remove?.(props.value, event),
            attrs: () => ({ "aria-hidden": "true" }),
        }),
    }),
    agent: { actions: ["remove"] },
});
//# sourceMappingURL=attachments.js.map
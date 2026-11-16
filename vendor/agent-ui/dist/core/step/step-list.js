import { createFocusRecovery, createRovingFocus, definePrimitive } from "@ui-sdk/core";
export const stepListPrimitive = definePrimitive({
    name: "kind-step-list",
    state: () => ({ focused: null }),
    api: (context) => {
        // Recovery runs after the removed item has left `roving.items()`, so keep the order from before.
        let current = [];
        let previous = [];
        const roving = createRovingFocus(context, {
            slot: "item",
            key: "focused",
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
                return (at(order[index + 1]) ?? at(order[index - 1]) ?? items.at(-1))?.el;
            },
        });
        return { roving, recovery };
    },
    slots: (slot) => ({
        root: slot({ role: "group" }),
        item: slot({
            props: { value: "string" },
            focus: "roving",
            attrs: (state, part) => ({ tabindex: part.api.roving.tabIndex(state, part) }),
            on: {
                keydown: (event, { el, api }) => {
                    if (el)
                        api.roving.keydown(event, el);
                },
            },
            bind: (el, part) => {
                const unbindFocus = part.api.roving.bind(el, part);
                const unbindRecovery = part.api.recovery.bind(el, part);
                return () => {
                    unbindFocus();
                    unbindRecovery();
                };
            },
        }),
    }),
    agent: { actions: [] },
});
//# sourceMappingURL=step-list.js.map
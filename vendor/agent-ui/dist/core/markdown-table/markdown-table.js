import { cellsToText, definePrimitive } from "@ui-sdk/core";
import { createCopy } from "../clipboard.js";
export const markdownTablePrimitive = definePrimitive({
    name: "kind-markdown-table",
    state: () => ({ copied: false }),
    api: (context) => {
        const copy = createCopy(context);
        return {
            copy: () => {
                const table = context.element("table");
                const rows = [...(table?.rows ?? [])].map((row) => [...row.cells].map((cell) => cell.textContent?.trim() ?? ""));
                return copy(cellsToText(rows));
            },
        };
    },
    slots: (slot) => ({
        root: slot({ role: "group" }),
        header: slot({}),
        copy: slot({
            role: "button",
            focus: "native",
            press: ({ api }) => void api.copy(),
            attrs: (state) => ({
                type: "button",
                "aria-label": "Copy table",
                "data-copied": state.copied ? "" : undefined,
            }),
        }),
        table: slot({}),
    }),
    agent: { actions: ["copy"] },
});
//# sourceMappingURL=markdown-table.js.map
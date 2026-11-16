import { definePrimitive } from "@ui-sdk/core";
import { createMarkdownEngine } from "../markdown/index.js";
export const markdownViewPrimitive = definePrimitive({
    name: "kind-markdown",
    options: { source: "string", streaming: "boolean", highlight: "value", engine: "value" },
    state: (options) => {
        const engine = options.engine ?? createMarkdownEngine();
        return {
            engine,
            blocks: engine.set(options.source ?? "", options.streaming ?? false),
            streaming: options.streaming ?? false,
            highlight: options.highlight,
        };
    },
    sync: (options) => ({
        streaming: options.streaming ?? false,
        highlight: options.highlight,
    }),
    api: (context) => {
        const { engine } = context.store.get();
        let { source = "", streaming = false } = context.options();
        context.onOptions((options) => {
            const next = { source: options.source ?? "", streaming: options.streaming ?? false };
            if (next.source === source && next.streaming === streaming)
                return;
            ({ source, streaming } = next);
            context.store.set({ blocks: engine.set(source, streaming) });
        });
        return {};
    },
    slots: (slot) => ({
        root: slot({
            state: (state) => ({ blocks: state.blocks, streaming: state.streaming, highlight: state.highlight }),
            attrs: (state) => ({ "data-streaming": state.streaming ? "" : undefined }),
        }),
    }),
});
//# sourceMappingURL=markdown-view.js.map
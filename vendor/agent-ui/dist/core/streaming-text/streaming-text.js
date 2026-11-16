import { definePrimitive } from "@ui-sdk/core";
import { enter, resolvedMotion } from "../motion/index.js";
import { streamingTextDiff } from "./diff.js";
const presentation = (options) => ({
    caret: options.caret ?? false,
    motion: options.motion ?? "auto",
});
export const streamingTextPrimitive = definePrimitive({
    name: "kind-streaming-text",
    options: { text: "string", caret: "boolean", motion: "string" },
    state: (options) => {
        const text = options.text ?? "";
        return { ...presentation(options), text, chunks: text ? [{ id: 0, text }] : [] };
    },
    // `text` reaches state through the diff in `api`, which needs the text before it.
    sync: presentation,
    api: (context) => {
        const { store } = context;
        let nextId = 1;
        // Chunks still fading in. Every chunk before the first of them folds into one, so parts stay few.
        const fading = new Set();
        // A part can bind twice (React StrictMode); its entrance plays once.
        const entering = new Set();
        const settled = (chunks) => {
            const end = chunks.findIndex((chunk) => fading.has(chunk.id));
            const count = end === -1 ? chunks.length : end;
            if (count < 2)
                return chunks;
            const [first] = chunks;
            const text = chunks
                .slice(0, count)
                .map((chunk) => chunk.text)
                .join("");
            return [{ id: first.id, text }, ...chunks.slice(count)];
        };
        context.onOptions((options) => {
            const text = options.text ?? "";
            const { text: previous, chunks, motion } = store.get();
            if (text === previous)
                return;
            const id = nextId++;
            const diff = streamingTextDiff(previous, text);
            if (diff.kind === "append") {
                if (resolvedMotion(motion) === "full")
                    fading.add(id);
                store.set({ text, chunks: [...settled(chunks), { id, text: diff.appended }] });
            }
            else {
                fading.clear();
                entering.clear();
                store.set({ text, chunks: text ? [{ id, text }] : [] });
            }
        });
        return {
            enterChunk: (el, id) => {
                if (!fading.has(id) || entering.has(id))
                    return;
                entering.add(id);
                void enter(el, "fade", { motion: store.get().motion }).then(() => {
                    fading.delete(id);
                    entering.delete(id);
                });
            },
        };
    },
    slots: (slot) => ({
        root: slot({
            attrs: (state) => ({ "data-motion": state.motion }),
            state: (state) => ({ chunks: state.chunks }),
        }),
        chunk: slot({
            props: { value: "number" },
            bind: (el, { api, props }) => api.enterChunk(el, props.value),
        }),
        caret: slot({
            present: (state) => state.caret,
            attrs: (state) => ({ "aria-hidden": "true", "data-motion": state.motion }),
        }),
    }),
    agent: { actions: [] },
});
//# sourceMappingURL=streaming-text.js.map
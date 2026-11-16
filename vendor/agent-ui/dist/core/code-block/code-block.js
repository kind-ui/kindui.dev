import { createChange, css, definePrimitive } from "@ui-sdk/core";
import { createCopy } from "../clipboard.js";
function toLines(code, highlighted) {
    const tokens = highlighted
        ? [...highlighted.tokens, { content: code.slice(highlighted.code.length) }]
        : [{ content: code }];
    const lines = [[]];
    for (const token of tokens) {
        token.content.split("\n").forEach((content, index) => {
            if (index > 0)
                lines.push([]);
            if (content)
                lines[lines.length - 1]?.push({ ...token, content });
        });
    }
    if (lines.length > 1 && lines[lines.length - 1]?.length === 0)
        lines.pop();
    return lines;
}
const presentation = (options) => ({
    code: options.code ?? "",
    language: options.language,
    lineNumbers: options.lineNumbers ?? false,
    streaming: options.streaming ?? false,
});
export const codeBlockPrimitive = definePrimitive({
    name: "kind-code-block",
    options: {
        code: "string",
        language: "string",
        highlight: "value",
        wrap: "boolean",
        defaultWrap: "boolean",
        onWrapChange: "callback",
        lineNumbers: "boolean",
        streaming: "boolean",
    },
    state: (options) => ({
        ...presentation(options),
        wrap: options.wrap ?? options.defaultWrap ?? false,
        lines: toLines(options.code ?? "", undefined),
        copied: false,
    }),
    sync: (options) => ({
        ...presentation(options),
        ...(options.wrap === undefined ? {} : { wrap: options.wrap }),
    }),
    controlled: ["wrap"],
    api: (context) => {
        const { store } = context;
        const change = createChange(context);
        const copy = createCopy(context);
        let highlighted;
        let pending = false;
        let destroyed = false;
        context.onDestroy(() => {
            destroyed = true;
        });
        // One request at a time; once it settles, the newest code is asked for. A code and language that
        // failed aren't asked for again.
        let failed;
        const request = () => {
            const { code = "", language, highlight } = context.options();
            if (!highlight || pending || highlighted?.code === code || failed === code)
                return;
            pending = true;
            const settle = (tokens) => {
                if (destroyed)
                    return;
                pending = false;
                const current = context.options();
                const currentCode = current.code ?? "";
                if (!tokens)
                    failed = code;
                else if (current.language === language && currentCode.startsWith(code)) {
                    highlighted = { code, tokens };
                    store.set({ lines: toLines(currentCode, highlighted) });
                }
                request();
            };
            highlight(code, language).then(settle, () => settle());
        };
        let previous = context.options();
        context.onOptions((options) => {
            const code = options.code ?? "";
            const languageChanged = options.language !== previous.language;
            const codeChanged = code !== (previous.code ?? "");
            const highlightAdded = !previous.highlight && options.highlight !== undefined;
            previous = options;
            if (highlightAdded)
                request();
            if (!languageChanged && !codeChanged)
                return;
            if (languageChanged || !code.startsWith(highlighted?.code ?? ""))
                highlighted = undefined;
            if (languageChanged)
                failed = undefined;
            store.set({ lines: toLines(code, highlighted) });
            request();
        });
        request();
        const setWrap = (wrap, event) => change("wrap", wrap, event ? { reason: "wrap-press", event } : { reason: "imperative" });
        return {
            copy: () => copy(store.get().code),
            isWrapped: () => store.get().wrap,
            setWrap,
            toggleWrap: (event) => setWrap(!store.get().wrap, event),
        };
    },
    slots: (slot) => ({
        root: slot({
            role: "group",
            attrs: (state) => ({
                "data-wrap": state.wrap ? "" : undefined,
                "data-streaming": state.streaming ? "" : undefined,
            }),
        }),
        header: slot({}),
        language: slot({
            state: (state) => ({ language: state.language }),
        }),
        wrap: slot({
            role: "button",
            focus: "native",
            press: ({ api }, event) => api.toggleWrap(event),
            attrs: (state) => ({
                type: "button",
                "aria-label": "Wrap lines",
                "aria-pressed": String(state.wrap),
            }),
        }),
        copy: slot({
            role: "button",
            focus: "native",
            press: ({ api }) => void api.copy(),
            attrs: (state) => ({
                type: "button",
                "aria-label": "Copy code",
                "data-copied": state.copied ? "" : undefined,
            }),
        }),
        code: slot({
            state: (state) => ({ lines: state.lines }),
            attrs: (state) => ({
                "data-wrap": state.wrap ? "" : undefined,
                "data-line-numbers": state.lineNumbers ? "" : undefined,
                style: css({ "--kind-code-block-digits": String(String(state.lines.length).length) }),
            }),
        }),
    }),
    agent: { actions: ["copy", "toggleWrap"] },
});
//# sourceMappingURL=code-block.js.map
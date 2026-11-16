import { announce, createController, createFocusRecovery, createStickToBottom, createVirtualizer, css, definePrimitive, } from "@ui-sdk/core";
import { enter, exit, resolveMotion } from "../motion/index.js";
import { nextFollowState } from "./follow.js";
/** A handle for the `controller` option, to scroll and read a conversation from outside it. */
export const createConversationController = () => createController();
const newMessages = (count) => `${count} new message${count === 1 ? "" : "s"}`;
const presentation = (options) => ({
    messageCount: options.messageCount ?? 0,
    motion: options.motion ?? "auto",
});
const prefersReduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const conversationPrimitive = definePrimitive({
    name: "kind-conversation",
    options: {
        messageCount: "number",
        virtualize: "boolean",
        estimateRowHeight: "number",
        rowKey: "value",
        onRowsChange: "callback",
        controller: "value",
        motion: "string",
    },
    state: (options) => ({
        ...presentation(options),
        virtualize: options.virtualize ?? false,
        following: true,
        newCount: 0,
        jumpExiting: false,
        rows: [],
        size: 0,
    }),
    sync: presentation,
    controlled: ["following", "newCount"],
    api: (context) => {
        const { store } = context;
        let follow = { following: true, newCount: 0, count: store.get().messageCount };
        // Rows up to this index have entered already, so a row that remounts (virtualized, or re-rendered) stays still.
        let newestEntered = follow.count - 1;
        let prepending = false;
        const apply = (next) => {
            const wasFollowing = follow.following;
            const announced = !next.following && next.newCount > follow.newCount;
            follow = next;
            store.set({
                following: next.following,
                newCount: next.newCount,
                ...(next.following && !wasFollowing && context.element("jump") ? { jumpExiting: true } : {}),
            });
            if (announced)
                announce(newMessages(next.newCount), { priority: "polite" });
        };
        const stick = createStickToBottom({
            onChange: ({ following }) => {
                if (following !== follow.following)
                    apply(nextFollowState(follow, { type: "following", following }));
            },
        });
        const virtual = createVirtualizer({
            count: () => context.options().messageCount ?? 0,
            estimate: () => context.options().estimateRowHeight ?? 120,
            key: (index) => context.options().rowKey?.(index) ?? String(index),
        });
        virtual.subscribe(() => {
            const rows = virtual.items();
            store.set({ rows, size: virtual.size() });
            context.options().onRowsChange?.(rows);
        });
        context.onOptions((options) => {
            const count = options.messageCount ?? 0;
            if (count === follow.count)
                return;
            if (prepending) {
                prepending = false;
                newestEntered += count - follow.count;
                follow = nextFollowState(follow, { type: "prepend", count });
            }
            else {
                newestEntered = Math.min(newestEntered, count - 1);
                apply(nextFollowState(follow, { type: "count", count }));
            }
            if (store.get().virtualize)
                virtual.refresh();
        });
        const recovery = createFocusRecovery({ fallback: () => context.element("viewport") });
        return {
            scrollToEnd: () => {
                const instant = resolveMotion(store.get().motion, prefersReduced()) !== "full";
                stick.scrollToBottom({ behavior: instant ? "instant" : "smooth" });
            },
            prepend: () => {
                prepending = true;
                stick.prepend();
            },
            isFollowing: () => store.get().following,
            getRows: () => store.get().rows,
            stick,
            virtual,
            recovery,
            enterRow: (el, index) => {
                if (index <= newestEntered)
                    return;
                newestEntered = index;
                void enter(el, "fade-up", { motion: store.get().motion });
            },
        };
    },
    slots: (slot) => ({
        root: slot({
            role: "log",
            attrs: (state) => ({
                "aria-live": "polite",
                "data-following": state.following ? "" : undefined,
                "data-virtualize": state.virtualize ? "" : undefined,
            }),
        }),
        viewport: slot({
            // A tab stop, so the keyboard can scroll it in every browser, as UI SDK Scroll Area's viewport is.
            focus: "tab-stop",
            attrs: (state) => ({ tabindex: "0", "data-following": state.following ? "" : undefined }),
            bind: (el, { api, store }) => {
                const disconnectStick = api.stick.connect(el);
                if (!store.get().virtualize)
                    return disconnectStick;
                const disconnectVirtual = api.virtual.connect(el);
                return () => {
                    disconnectVirtual();
                    disconnectStick();
                };
            },
        }),
        content: slot({
            state: (state) => ({ rows: state.rows }),
            attrs: (state) => ({
                "data-virtualize": state.virtualize ? "" : undefined,
                style: css({ "--kind-conversation-size": state.virtualize ? `${state.size}px` : undefined }),
            }),
        }),
        row: slot({
            props: { value: "string", index: "number" },
            attrs: (state, { props }) => {
                const start = state.virtualize
                    ? state.rows.find((row) => row.index === props.index)?.start
                    : undefined;
                return {
                    "data-virtualize": state.virtualize ? "" : undefined,
                    style: css({ "--kind-conversation-row-start": start === undefined ? undefined : `${start}px` }),
                };
            },
            bind: (el, part) => {
                const { api, props, store } = part;
                api.enterRow(el, props.index);
                const unmeasure = store.get().virtualize ? api.virtual.measure(props.index, el) : undefined;
                const unbindRecovery = api.recovery.bind(el, part);
                return () => {
                    unmeasure?.();
                    unbindRecovery();
                };
            },
        }),
        jump: slot({
            role: "button",
            focus: "native",
            press: ({ api }) => api.scrollToEnd(),
            present: (state) => !state.following || state.jumpExiting,
            attrs: (state) => ({
                type: "button",
                "aria-label": state.newCount > 0 ? `Jump to latest, ${newMessages(state.newCount)}` : "Jump to latest",
                // `announce` reads the count once; the log would read the button's text again.
                "aria-live": "off",
            }),
            bind: (el, part) => {
                const { store } = part;
                const motion = () => ({ motion: store.get().motion });
                let leaving = false;
                const render = () => {
                    const { following, newCount } = store.get();
                    const text = newCount > 0 ? newMessages(newCount) : "Jump to latest";
                    if (el.textContent !== text)
                        el.textContent = text;
                    if (following === leaving)
                        return;
                    leaving = following;
                    if (!leaving) {
                        void enter(el, "fade-up", motion());
                        return;
                    }
                    exit(el, "fade-up", motion()).then(() => store.set({ jumpExiting: false }), () => { });
                };
                void enter(el, "fade-up", motion());
                render();
                const unsubscribe = store.subscribe(render);
                const unbindRecovery = part.api.recovery.bind(el, part);
                return () => {
                    unsubscribe();
                    unbindRecovery();
                };
            },
        }),
        empty: slot({
            present: (state) => state.messageCount === 0,
        }),
    }),
    agent: { actions: ["scrollToEnd"] },
});
//# sourceMappingURL=conversation.js.map
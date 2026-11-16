import { cancel, enter, flow, onReducedMotionChange } from "./motion/index.js";
/**
 * Everything but the name of Loader, Thinking Indicator and Typing Indicator: a polite `status` named by its
 * label, and decorative dots that flow with the `"dot-flow"` preset.
 */
export const indicator = (defaultLabel) => {
    const presentation = (options) => ({
        label: options.label ?? defaultLabel,
        motion: options.motion ?? "auto",
    });
    return {
        options: { label: "string", motion: "string" },
        state: presentation,
        sync: presentation,
        api: () => ({}),
        slots: (slot) => ({
            root: slot({
                role: "status",
                attrs: (state) => ({ "aria-label": state.label, "data-motion": state.motion }),
            }),
            label: slot({
                attrs: (state) => ({ "data-motion": state.motion }),
                state: (state) => ({ label: state.label }),
            }),
            dots: slot({
                attrs: (state) => ({ "aria-hidden": "true", "data-motion": state.motion }),
                bind: (el, { store }) => {
                    let { motion } = store.get();
                    let bound = true;
                    // Web parts bind as they connect, before the dots inside have their `data-dot`.
                    queueMicrotask(() => {
                        if (bound)
                            void enter(el, "dot-flow", { motion });
                    });
                    const unsubscribe = store.subscribe(() => {
                        if (store.get().motion === motion)
                            return;
                        motion = store.get().motion;
                        flow(el, { motion });
                    });
                    const unwatch = onReducedMotionChange(() => {
                        if (motion === "auto")
                            flow(el, { motion });
                    });
                    return () => {
                        bound = false;
                        unsubscribe();
                        unwatch();
                        cancel(el);
                    };
                },
            }),
            dot: slot({ attrs: () => ({ "data-dot": "" }) }),
        }),
        agent: { actions: [] },
    };
};
//# sourceMappingURL=indicator.js.map
import { announce, bindPanel, createChange, css, definePrimitive, hiddenAttrs, openAttrs, } from "@ui-sdk/core";
import { nextOpen } from "./auto-open.js";
const ANNOUNCED = {
    "awaiting-input": "needs input",
    complete: "complete",
    error: "failed",
    cancelled: "cancelled",
};
const autoOpened = (options) => options.autoOpen !== "never" && (options.status === "running" || options.status === "awaiting-input");
const presentation = (options) => ({
    status: options.status ?? "pending",
    kind: options.kind,
    durationSeconds: options.durationSeconds,
    motion: options.motion ?? "auto",
});
export const stepPrimitive = definePrimitive({
    name: "kind-step",
    options: {
        status: "string",
        kind: "string",
        title: "string",
        open: "boolean",
        defaultOpen: "boolean",
        onOpenChange: "callback",
        autoOpen: "string",
        durationSeconds: "number",
        motion: "string",
    },
    state: (options) => ({
        ...presentation(options),
        open: options.open ?? options.defaultOpen ?? autoOpened(options),
        userToggled: false,
        exiting: false,
    }),
    sync: (options) => ({
        ...presentation(options),
        ...(options.open === undefined ? {} : { open: options.open }),
    }),
    controlled: ["open", "status"],
    api: (context) => {
        const change = createChange(context);
        let prevStatus = context.store.get().status;
        let wasOpen = context.store.get().open;
        const setOpen = (open, { reason = "imperative", event } = {}) => {
            const auto = reason === "auto";
            const changed = change("open", open, auto ? { reason, source: "programmatic" } : event ? { reason, event } : { reason });
            // Spec §5: only a person or agent toggling stops auto behavior, not a host write.
            if (changed && !auto && reason !== "imperative")
                context.store.set({ userToggled: true });
            return changed;
        };
        const toggledBy = (changed) => {
            if (changed)
                context.store.set({ userToggled: true });
            return changed;
        };
        context.store.subscribe(() => {
            const { open } = context.store.get();
            if (open === wasOpen)
                return;
            wasOpen = open;
            if (!open)
                context.store.set({ exiting: true });
        });
        context.onOptions((options) => {
            const status = options.status ?? "pending";
            if (status === prevStatus)
                return;
            const { open, userToggled } = context.store.get();
            const next = nextOpen({
                status,
                prevStatus,
                open,
                userToggled,
                autoOpen: options.autoOpen ?? "running",
            });
            prevStatus = status;
            if (next !== open)
                setOpen(next, { reason: "auto" });
            const outcome = ANNOUNCED[status];
            const title = options.title ?? context.element("title")?.textContent?.trim();
            if (outcome && title)
                announce(`${title} ${outcome}`, { priority: "polite" });
        });
        return {
            isOpen: () => context.store.get().open,
            setOpen,
            expand: () => toggledBy(setOpen(true)),
            collapse: () => toggledBy(setOpen(false)),
            toggle: (event) => setOpen(!context.store.get().open, { reason: "trigger-press", event }),
        };
    },
    slots: (slot) => ({
        root: slot({
            role: "group",
            attrs: (state, part) => ({
                "aria-labelledby": `${part.id}-title`,
                "data-status": state.status,
                "data-kind": state.kind,
                ...openAttrs(state.open),
                style: css({
                    "--kind-step-duration": state.durationSeconds === undefined ? undefined : `${state.durationSeconds}s`,
                }),
            }),
        }),
        trigger: slot({
            role: "button",
            focus: "native",
            press: ({ api }, event) => api.toggle(event),
            attrs: (state, part) => ({
                type: "button",
                "aria-expanded": String(state.open),
                "aria-controls": `${part.id}-content`,
                "data-status": state.status,
                "data-motion": state.motion,
                ...openAttrs(state.open),
            }),
        }),
        icon: slot({
            attrs: (state) => ({ "aria-hidden": "true", "data-status": state.status, "data-motion": state.motion }),
        }),
        title: slot({
            attrs: (state, part) => ({
                id: `${part.id}-title`,
                "data-status": state.status,
                "data-motion": state.motion,
            }),
        }),
        meta: slot({
            attrs: (state) => ({ "data-status": state.status }),
        }),
        content: slot({
            attrs: (state, part) => ({
                id: `${part.id}-content`,
                "data-status": state.status,
                "data-motion": state.motion,
                ...openAttrs(state.open),
                ...hiddenAttrs(state.open || state.exiting, true),
            }),
            bind: (el, { api, id, store }) => {
                let opening = store.get().open ? "mount" : "animate";
                return bindPanel(el, {
                    size: (panel, height) => panel.style.setProperty("--kind-step-content-height", height),
                    isOpen: () => store.get().open,
                    isExiting: () => store.get().exiting,
                    isFindable: () => true,
                    opening: () => {
                        const current = store.get().motion === "none" ? "instant" : opening;
                        opening = "animate";
                        return current;
                    },
                    reveal: (event) => {
                        opening = "instant";
                        api.setOpen(true, { reason: "find-in-page", event });
                    },
                    trigger: () => el.ownerDocument.querySelector(`[aria-controls="${id}-content"]`) ?? undefined,
                    subscribe: store.subscribe,
                    settled: () => { },
                    exited: () => store.set({ exiting: false }),
                });
            },
        }),
        children: slot({}),
    }),
    agent: { actions: ["expand", "collapse"] },
});
//# sourceMappingURL=step.js.map
import { announce, createChange, createFocusRecovery, createInputHistory, definePrimitive, } from "@ui-sdk/core";
import { createTokenInputController, fromText, toText, } from "@ui-sdk/core/token-input";
import { forwardFileInputEvents } from "../file-input-events.js";
import { memo } from "../memo.js";
import { enter } from "../motion/index.js";
import { draftAfterSettle, emptyDraft, isSubmittable, } from "./draft.js";
const isThenable = (value) => typeof value?.then === "function";
// A token parsed from text has no id until the Token Input holds it.
const tokensOf = (segments) => segments.flatMap((segment, index) => typeof segment !== "string" && (segment.type === "mention" || segment.type === "command")
    ? [{ id: segment.id ?? String(index), kind: segment.type, value: segment.value, label: segment.label }]
    : []);
// The editor counts a token as one offset.
const lengthOf = (segments) => segments.reduce((length, segment) => length + (typeof segment === "string" ? segment.length : 1), 0);
const presentation = (options) => ({
    canStop: options.onStop !== undefined,
    disabled: options.disabled ?? false,
    submitOn: options.submitOn ?? "enter",
    agentConfirm: options.agentConfirm ?? true,
    mentions: options.mentions,
    commands: options.commands,
    accept: options.accept,
    maxSize: options.maxSize,
    motion: options.motion ?? "auto",
});
export const composerPrimitive = definePrimitive({
    name: "kind-composer",
    options: {
        value: "value",
        defaultValue: "value",
        onValueChange: "callback",
        onSubmit: "action",
        onStop: "callback",
        submitOn: "string",
        mentions: "value",
        commands: "value",
        accept: "string",
        maxSize: "number",
        history: "value",
        disabled: "boolean",
        agentConfirm: "boolean",
        motion: "string",
    },
    state: (options) => {
        if (options.value !== undefined && options.defaultValue !== undefined) {
            throw new TypeError("Composer: value and defaultValue are mutually exclusive");
        }
        return {
            ...presentation(options),
            value: options.value ?? options.defaultValue ?? emptyDraft(),
            pending: false,
        };
    },
    sync: (options) => ({
        ...presentation(options),
        ...(options.value === undefined ? {} : { value: options.value }),
    }),
    controlled: ["value"],
    api: (context) => {
        const { store } = context;
        const change = createChange(context);
        const tokenInput = createTokenInputController();
        let destroyed = false;
        context.onDestroy(() => {
            destroyed = true;
        });
        const setValue = (value, event) => {
            const next = typeof value === "string"
                ? { text: value, tokens: tokensOf(fromText(value)), attachments: store.get().value.attachments }
                : value;
            return change("value", next, event ? { reason: "input-change", event } : { reason: "imperative" });
        };
        let nextAttachment = 0;
        const attach = (attachments, reason) => {
            if (attachments.length === 0)
                return;
            const { value } = store.get();
            change("value", { ...value, attachments: [...value.attachments, ...attachments] }, { reason });
        };
        const attachment = (file, error) => ({
            id: `${context.id}-attachment-${nextAttachment++}`,
            file,
            name: file.name,
            size: file.size,
            mediaType: file.type,
            ...(error ? { error } : {}),
        });
        const settle = (submitted, outcome) => {
            if (destroyed)
                return;
            returningFromStop = store.get().canStop;
            store.set({ pending: false });
            if (outcome === "rejected")
                announce("Message not sent", { priority: "polite" });
            const current = store.get().value;
            const next = draftAfterSettle(current, submitted, outcome);
            if (next !== current)
                change("value", next, { reason: "submit" });
        };
        const history = createInputHistory({
            entries: () => context.options().history,
            read: () => store.get().value.text,
            write: (text, event) => change("value", { text, tokens: tokensOf(fromText(text)), attachments: store.get().value.attachments }, { reason: "history-key", event }),
            atEdge: (direction) => {
                const length = lengthOf(tokenInput.getValue());
                // The editor reports no selection until the first `selectionchange` after focus.
                if (length === 0)
                    return true;
                const range = tokenInput.editor.selection();
                if (!range || range.start !== range.end)
                    return false;
                return direction === "up" ? range.start === 0 : range.end === length;
            },
        });
        // Send and Stop take each other's place; focus follows to whichever is shown, else the editor.
        const recovery = createFocusRecovery({
            fallback: () => context.element("stop") ?? context.element("submit") ?? tokenInput.editor.element,
        });
        const intake = {
            accept: (files, reason, cancel) => {
                // The draft holds the files, so File Input keeps none of its own.
                cancel();
                attach(files.map((file) => attachment(file)), reason);
            },
            reject: (rejected, reason) => attach(rejected.map(({ file, reasons }) => attachment(file, reasons.includes("file-type") ? "type" : "size")), reason),
        };
        const removeAttachment = (id, event) => {
            const { value, disabled } = store.get();
            if (disabled || !value.attachments.some((item) => item.id === id))
                return false;
            return change("value", { ...value, attachments: value.attachments.filter((item) => item.id !== id) }, event ? { reason: "remove-press", event } : { reason: "imperative" });
        };
        const initialText = fromText(store.get().value.text);
        let returningFromStop = false;
        const readInput = () => {
            const segments = tokenInput.getValue();
            const { value } = store.get();
            const text = toText(segments);
            if (text === value.text)
                return;
            if (!change("value", { ...value, text, tokens: tokensOf(segments) }, { reason: "input-change" })) {
                tokenInput.setValue(fromText(value.text));
            }
        };
        const writeInput = () => {
            const { text } = store.get().value;
            if (toText(tokenInput.getValue()) !== text)
                tokenInput.setValue(fromText(text));
        };
        let disconnect;
        const connectInput = () => {
            // The controller reads undefined until a Token Input attaches it.
            if (!disconnect && tokenInput.getValue() !== undefined) {
                writeInput();
                const unlisten = tokenInput.editor.subscribe((edit) => {
                    if (edit.type === "input")
                        readInput();
                });
                const unsubscribe = store.subscribe(writeInput);
                disconnect = () => {
                    unlisten();
                    unsubscribe();
                    disconnect = undefined;
                };
            }
            return () => disconnect?.();
        };
        const root = memo((disabled, accept, maxSize) => ({
            fileInput: {
                multiple: true,
                disabled,
                ...(accept === undefined ? {} : { accept }),
                ...(maxSize === undefined ? {} : { maxSize }),
                onValueChange: (_files, details) => intake.accept(details.added, details.reason, details.cancel),
                onReject: (rejected, details) => intake.reject(rejected, details.reason),
            },
        }));
        const input = memo((submitOn, disabled) => ({
            tokenInput: {
                controller: tokenInput,
                defaultValue: initialText,
                submitShortcut: submitOn === "mod-enter" ? "mod+enter" : "enter",
                disabled,
            },
        }));
        const triggerMenu = memo((mentions, commands) => {
            const triggers = [];
            if (mentions)
                triggers.push({ char: "@", type: "mention", items: [...mentions] });
            if (commands)
                triggers.push({ char: "/", boundary: "start", type: "command", items: [...commands] });
            return { triggers };
        });
        const attachments = memo((items, motion, disabled) => ({
            items,
            motion,
            ...(!disabled && { onRemove: (id, details) => void removeAttachment(id, details.event) }),
        }));
        return {
            getValue: () => store.get().value,
            setValue,
            insertToken: ({ kind, value, label }) => tokenInput.insert({ type: kind, value, label }) === true,
            removeAttachment,
            submit: () => {
                const { onSubmit } = context.options();
                const { value, pending, disabled } = store.get();
                if (disabled || pending || !onSubmit || !isSubmittable(value))
                    return;
                history.reset();
                const submission = onSubmit(value);
                if (!isThenable(submission))
                    return settle(value, "resolved");
                store.set({ pending: true });
                announce("Sending", { priority: "polite" });
                submission.then(() => settle(value, "resolved"), () => settle(value, "rejected"));
            },
            get stop() {
                const { pending } = store.get();
                const { onStop } = context.options();
                return pending && onStop ? () => onStop() : undefined;
            },
            tokenInput,
            intake,
            connectInput,
            history,
            recovery,
            enterSubmit: (el) => {
                if (!returningFromStop)
                    return;
                returningFromStop = false;
                void enter(el, "fade", { motion: store.get().motion });
            },
            partState: {
                root: (state) => root(state.disabled, state.accept, state.maxSize),
                input: (state) => input(state.submitOn, state.disabled),
                triggerMenu: (state) => triggerMenu(state.mentions, state.commands),
                attachments: (state) => attachments(state.value.attachments, state.motion, state.disabled),
            },
        };
    },
    slots: (slot) => ({
        root: slot({
            role: "form",
            attrs: (state) => ({
                "data-pending": state.pending ? "" : undefined,
                "data-disabled": state.disabled ? "" : undefined,
                "data-motion": state.motion,
                "aria-busy": state.pending ? "true" : undefined,
                // UI SDK marks a whole component, so every composer action asks the person while it's on.
                "data-agent-confirm": state.agentConfirm ? "Writes and sends a message as you" : undefined,
            }),
            state: (state, { api }) => api.partState.root(state),
            on: {
                submit: (event, { api }) => {
                    event.preventDefault();
                    api.submit(event);
                },
            },
            bind: (el, { api }) => forwardFileInputEvents(el, api.intake),
        }),
        // Wraps the Token Input and hears its keys bubble for ArrowUp history, as the skill's "wrap ours" seam does.
        input: slot({
            attrs: (state) => ({ "data-pending": state.pending ? "" : undefined }),
            state: (state, { api }) => api.partState.input(state),
            on: {
                keydown: (event, { api }) => {
                    if (!event.defaultPrevented)
                        api.history.keydown(event);
                },
            },
            bind: (_el, { api }) => api.connectInput(),
        }),
        "trigger-menu": slot({
            state: (state, { api }) => api.partState.triggerMenu(state),
        }),
        // Stays mounted while empty, so the first attachment plays its entrance like the rest.
        attachments: slot({
            attrs: (state) => ({ "data-empty": state.value.attachments.length === 0 ? "" : undefined }),
            state: (state, { api }) => api.partState.attachments(state),
        }),
        submit: slot({
            role: "button",
            focus: "native",
            present: (state) => !(state.pending && state.canStop),
            press: ({ api }, event) => api.submit(event),
            attrs: (state) => ({
                type: "button",
                "aria-label": "Send",
                "aria-disabled": state.pending || state.disabled || !isSubmittable(state.value) ? "true" : undefined,
                "data-pending": state.pending ? "" : undefined,
                "data-motion": state.motion,
            }),
            // Keeps focus in the editor when a pointer presses it.
            on: { mousedown: (event) => event.preventDefault() },
            bind: (el, part) => {
                part.api.enterSubmit(el);
                return part.api.recovery.bind(el, part);
            },
        }),
        stop: slot({
            role: "button",
            focus: "native",
            present: (state) => state.pending && state.canStop,
            press: ({ api }, event) => api.stop?.(event),
            attrs: (state) => ({ type: "button", "aria-label": "Stop", "data-motion": state.motion }),
            on: { mousedown: (event) => event.preventDefault() },
            bind: (el, part) => part.api.recovery.bind(el, part),
        }),
    }),
    agent: { actions: ["setValue", "insertToken", "removeAttachment", "submit", "stop"] },
});
//# sourceMappingURL=composer.js.map
/**
 * Hands `<ui-file-input>`'s `valuechange` and `reject` events to `intake`, as React's props do.
 * `@ui-sdk/web` fires them on the file input alone, without bubbling, so `container` hears them as they capture.
 */
export function forwardFileInputEvents(container, intake) {
    const fromFileInput = (event) => event.target.localName === "ui-file-input";
    const valueChange = (event) => {
        if (!fromFileInput(event))
            return;
        const { added, reason } = event.detail;
        intake.accept(added, reason, () => event.preventDefault());
    };
    const reject = (event) => {
        if (!fromFileInput(event))
            return;
        const { value, reason } = event.detail;
        intake.reject(value, reason);
    };
    container.addEventListener("valuechange", valueChange, true);
    container.addEventListener("reject", reject, true);
    return () => {
        container.removeEventListener("valuechange", valueChange, true);
        container.removeEventListener("reject", reject, true);
    };
}
//# sourceMappingURL=file-input-events.js.map
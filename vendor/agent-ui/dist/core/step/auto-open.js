/** Spec §5: opens on `running` / `awaiting-input`, closes on `complete`, and stops once someone toggles the step. */
export function nextOpen({ status, prevStatus, open, userToggled, autoOpen }) {
    if (autoOpen === "never" || userToggled || status === prevStatus)
        return open;
    if (status === "running" || status === "awaiting-input")
        return true;
    if (status === "complete")
        return false;
    return open;
}
//# sourceMappingURL=auto-open.js.map
// A part re-renders when its state changes identity, so state built from the same inputs is reused.
export function memo(build) {
    let last;
    return (...args) => {
        if (last?.args.every((arg, index) => Object.is(arg, args[index])))
            return last.value;
        last = { args, value: build(...args) };
        return last.value;
    };
}
//# sourceMappingURL=memo.js.map
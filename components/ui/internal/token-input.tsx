import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "@ui-sdk/react/token-input";
import { withKindClass } from "./kind-class.js";

export const KindTokenInput = TokenInput;
export const KindTokenInputEditor = withKindClass(
  TokenInputEditor,
  "min-h-16 whitespace-pre-wrap w-full rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 py-2 text-sm text-[var(--kind-color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:opacity-50 [&_[data-slot=token-input-host]]:whitespace-nowrap data-empty:before:pointer-events-none data-empty:before:text-[var(--kind-color-muted)] data-empty:before:content-[attr(aria-placeholder)]",
  "KindTokenInputEditor",
);
export const KindTokenInputToken = withKindClass(
  TokenInputToken,
  "inline-flex items-center gap-1 rounded-[calc(var(--kind-radius)/3)] bg-[var(--kind-color-hover)] px-1.5 text-[var(--kind-color-fg)] data-selected:bg-[var(--kind-color-fg)] data-selected:text-[var(--kind-color-surface)] data-unresolved:outline data-unresolved:outline-dashed data-unresolved:outline-[var(--kind-color-muted)]",
  "KindTokenInputToken",
);
export const KindTokenInputTokenRemove = withKindClass(
  TokenInputTokenRemove,
  "inline-flex size-4 cursor-pointer items-center justify-center rounded-[calc(var(--kind-radius)/3)] text-[var(--kind-color-muted)] hover:text-[var(--kind-color-fg)]",
  "KindTokenInputTokenRemove",
);

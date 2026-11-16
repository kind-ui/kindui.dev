import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/react/file-input";
import { withKindClass } from "./kind-class.js";

export const KindFileInput = withKindClass(FileInput, "flex flex-col gap-2", "KindFileInput");
export const KindFileInputTrigger = withKindClass(
  FileInputTrigger,
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] bg-[var(--kind-color-surface)] px-3 text-sm font-medium text-[var(--kind-color-fg)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)] data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pending:cursor-wait",
  "KindFileInputTrigger",
);
export const KindFileInputDropzone = withKindClass(
  FileInputDropzone,
  "flex flex-col items-center gap-2 rounded-[calc(var(--kind-radius)/2)] border border-dashed border-[var(--kind-color-border)] p-4 text-sm text-[var(--kind-color-fg)] data-dragging:border-[var(--kind-color-fg)] data-drag-accept:bg-[var(--kind-color-hover)] data-drag-reject:border-[var(--kind-color-danger)]",
  "KindFileInputDropzone",
);
export const KindFileInputList = withKindClass(FileInputList, "flex flex-col gap-1", "KindFileInputList");
export const KindFileInputItem = withKindClass(
  FileInputItem,
  "flex items-center gap-2 rounded-[calc(var(--kind-radius)/2)] border border-[var(--kind-color-border)] px-2 py-1 text-sm text-[var(--kind-color-fg)]",
  "KindFileInputItem",
);
export const KindFileInputItemRemove = withKindClass(
  FileInputItemRemove,
  "inline-flex size-6 items-center justify-center rounded-[calc(var(--kind-radius)/3)] text-[var(--kind-color-muted)] hover:bg-[var(--kind-color-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kind-color-ring)]",
  "KindFileInputItemRemove",
);

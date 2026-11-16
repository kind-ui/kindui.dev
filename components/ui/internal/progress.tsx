import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress";
import { withKindClass } from "./kind-class.js";

export const KindProgress = withKindClass(Progress, "flex flex-col gap-1 text-sm", "KindProgress");
export const KindProgressLabel = withKindClass(
  ProgressLabel,
  "font-medium text-[var(--kind-color-fg)]",
  "KindProgressLabel",
);
export const KindProgressValue = withKindClass(
  ProgressValue,
  "tabular-nums text-[var(--kind-color-muted)]",
  "KindProgressValue",
);
export const KindProgressTrack = withKindClass(
  ProgressTrack,
  "h-1.5 w-full overflow-hidden rounded-full bg-[var(--kind-color-border)]",
  "KindProgressTrack",
);
export const KindProgressIndicator = withKindClass(
  ProgressIndicator,
  "h-full bg-[var(--kind-color-fg)] data-indeterminate:w-1/3",
  "KindProgressIndicator",
);

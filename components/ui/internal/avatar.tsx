import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar";
import { withKindClass } from "./kind-class.js";

export const KindAvatar = withKindClass(
  Avatar,
  "relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--kind-color-hover)] text-xs font-medium text-[var(--kind-color-fg)]",
  "KindAvatar",
);
export const KindAvatarImage = withKindClass(AvatarImage, "size-full object-cover", "KindAvatarImage");
export const KindAvatarFallback = withKindClass(
  AvatarFallback,
  "flex size-full items-center justify-center",
  "KindAvatarFallback",
);

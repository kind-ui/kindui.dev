"use client";

import { loaderPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(loaderPrimitive, { root: "span", label: "span", dots: "span", dot: "span" });

export type LoaderProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/** A polite status: three flowing dots beside its `label`, "Loading…" by default. */
export function Loader(props: LoaderProps) {
  return (
    <parts.Root {...props}>
      <parts.Dots>
        <parts.Dot />
        <parts.Dot />
        <parts.Dot />
      </parts.Dots>
      <parts.Label>{({ label }) => label}</parts.Label>
    </parts.Root>
  );
}

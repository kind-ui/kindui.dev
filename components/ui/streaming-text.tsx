"use client";

import { streamingTextPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(streamingTextPrimitive, { root: "span", chunk: "span", caret: "span" });

export type StreamingTextProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/** Streamed plain text: each appended chunk fades in, and `caret` shows a caret after it. */
export function StreamingText(props: StreamingTextProps) {
  return (
    <parts.Root {...props}>
      {({ chunks }) => (
        <>
          {chunks.map((chunk) => (
            <parts.Chunk key={chunk.id} value={chunk.id}>
              {chunk.text}
            </parts.Chunk>
          ))}
          <parts.Caret />
        </>
      )}
    </parts.Root>
  );
}

import { markdownTablePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import {
  KindScrollArea,
  KindScrollAreaContent,
  KindScrollAreaScrollbar,
  KindScrollAreaThumb,
  KindScrollAreaViewport,
} from "./internal/scroll-area.js";

const parts = createParts(markdownTablePrimitive, {
  root: "div",
  header: "div",
  copy: "button",
  table: "table",
});

export type MarkdownTableProps = Omit<ComponentProps<typeof parts.Root>, "children"> & {
  /** The table's `thead` and `tbody`. */
  children?: ReactNode;
};

/**
 * A table with a copy button. Name it with `aria-label`. Set `--kind-markdown-table-columns` to the column count
 * so it scrolls sideways rather than squeezing its columns.
 */
export function MarkdownTable({ children, ...props }: MarkdownTableProps) {
  return (
    <parts.Root {...props}>
      <parts.Header>
        <parts.Copy />
      </parts.Header>
      <KindScrollArea>
        <KindScrollAreaViewport>
          <KindScrollAreaContent>
            <parts.Table>{children}</parts.Table>
          </KindScrollAreaContent>
        </KindScrollAreaViewport>
        <KindScrollAreaScrollbar orientation="horizontal">
          <KindScrollAreaThumb />
        </KindScrollAreaScrollbar>
      </KindScrollArea>
    </parts.Root>
  );
}

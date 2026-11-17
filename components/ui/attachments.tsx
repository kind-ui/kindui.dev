"use client";

import { type AttachmentsRootState, attachmentsPrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

const parts = createParts(attachmentsPrimitive, { root: "ul", item: "li", remove: "span" });

export type AttachmentsProps = ComponentProps<typeof parts.Root>;

/**
 * The `items` as chips, one Tab stop with arrow keys between them. Name it with `aria-label`. Without children, each
 * of its `rows` gets an `Attachment`, so a removed chip fades out. To style the chips, pass a function of `{ rows }`
 * that renders an `Attachment` per row, with the item's `id` as its `value`; chips rendered from `items` instead
 * leave at once.
 */
export function Attachments({ children = ROWS, ...props }: AttachmentsProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

const ROWS = ({ rows }: AttachmentsRootState) =>
  rows.map((row) => <Attachment key={row.item.id} value={row.item.id} />);

/** One chip: an image's preview or a file icon, the name, the size or error, and a remove button. */
export function Attachment(props: Omit<ComponentProps<typeof parts.Item>, "children">) {
  return (
    <parts.Item {...props}>
      {({ item, preview, detail }) => (
        <>
          {preview ? <img data-preview="" src={preview} alt="" /> : <span data-icon="" />}
          <span data-name="">{item?.name}</span>
          <span data-detail="">{detail}</span>
          <parts.Remove value={props.value} />
        </>
      )}
    </parts.Item>
  );
}

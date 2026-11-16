import { uploaderPrimitive } from "@kind-ui/agent-ui/core";
import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/react/file-input";
import { createParts } from "@ui-sdk/react/primitive";
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from "@ui-sdk/react/progress";
import type { ComponentProps } from "react";

const parts = createParts(uploaderPrimitive, { root: "div", list: "ul", item: "li", action: "button" });

export type UploaderProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/**
 * A File Input drop zone with a Browse button, then a row per item with its progress, and Cancel or Retry when the
 * host offers them. Name it with `aria-label`.
 */
export function Uploader(props: UploaderProps) {
  return (
    <parts.Root {...props}>
      {({ fileInput }) => (
        <>
          <FileInput {...fileInput}>
            <FileInputDropzone>
              <span data-upload-icon="" />
              <span data-hint="">Drop files here, or</span>
              <FileInputTrigger>browse</FileInputTrigger>
            </FileInputDropzone>
          </FileInput>
          <parts.List>
            {props.items?.map((item) => (
              <UploaderItem key={item.id} value={item.id} />
            ))}
          </parts.List>
        </>
      )}
    </parts.Root>
  );
}

/** One upload: the file's name and progress bar, what it's doing, and its action. */
export function UploaderItem(props: Omit<ComponentProps<typeof parts.Item>, "children">) {
  return (
    <parts.Item {...props}>
      {({ item, detail }) => (
        <>
          <span data-icon="" />
          <Progress value={item?.progress ?? null}>
            <ProgressLabel>{item?.name}</ProgressLabel>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
          <span data-detail="">{detail}</span>
          <parts.Action value={props.value} />
        </>
      )}
    </parts.Item>
  );
}

"use client";

import { generatedImagePrimitive } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress";
import type { ComponentProps } from "react";

const parts = createParts(generatedImagePrimitive, {
  root: "div",
  frame: "div",
  preview: "img",
  progress: "div",
  image: "img",
  error: "div",
  trigger: "button",
  download: "button",
  backdrop: "div",
  content: "div",
  "full-image": "img",
  title: "h2",
  close: "button",
});

export type GeneratedImageProps = ComponentProps<typeof parts.Root>;

/**
 * An image the agent is making: a frame of the image's shape that shows its progress and a blurred preview, then
 * the image, which opens full size. Any `children` replace the frame and the full size view.
 */
export function GeneratedImage({ children = DEFAULT_PARTS, ...props }: GeneratedImageProps) {
  return <parts.Root {...props}>{children}</parts.Root>;
}

export type GeneratedImageFrameProps = ComponentProps<typeof parts.Frame>;

/** Keeps the image's shape in every phase. Holds the preview, progress, image, error, trigger and Download. */
export function GeneratedImageFrame({ children = DEFAULT_FRAME, ...props }: GeneratedImageFrameProps) {
  return <parts.Frame {...props}>{children}</parts.Frame>;
}

/** The `preview`, blurred and sharpening with `progress`, while the image is on its way. */
export const GeneratedImagePreview = parts.Preview;

export type GeneratedImageProgressProps = ComponentProps<typeof parts.Progress>;

/**
 * A UI SDK Progress, read as a quiet corner label like "Creating image · 42%" until the image loads, unless you pass
 * children.
 */
export function GeneratedImageProgress({
  children = ({ value, label }) => (
    <Progress value={value}>
      <ProgressLabel>{label}</ProgressLabel>
      <ProgressValue />
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
  ...props
}: GeneratedImageProgressProps) {
  return <parts.Progress {...props}>{children}</parts.Progress>;
}

/** The image at `src`, which fades in once it loads. */
export const GeneratedImageImage = parts.Image;

export type GeneratedImageErrorProps = ComponentProps<typeof parts.Error>;

/** What went wrong, under a muted image glyph, unless you pass children. */
export function GeneratedImageError({
  children = ({ message }) => message,
  ...props
}: GeneratedImageErrorProps) {
  return <parts.Error {...props}>{children}</parts.Error>;
}

/** "View full size": covers the loaded image and opens it in a dialog. */
export const GeneratedImageTrigger = parts.Trigger;

/** Calls `onDownload`. Rendered while it's set and the image is loaded. */
export const GeneratedImageDownload = parts.Download;

/** Dims the page behind the full size view. */
export const GeneratedImageBackdrop = parts.Backdrop;

export type GeneratedImageDialogProps = ComponentProps<typeof parts.Content>;

/** The full size view: the image, its `alt` as the title, Download and Close, unless you pass children. */
export function GeneratedImageDialog({ children = DEFAULT_DIALOG, ...props }: GeneratedImageDialogProps) {
  return <parts.Content {...props}>{children}</parts.Content>;
}

/** The image at full size, inside the dialog. */
export const GeneratedImageFullImage = parts.FullImage;

export type GeneratedImageTitleProps = ComponentProps<typeof parts.Title>;

/** The `alt`, unless you pass children. Names the dialog. */
export function GeneratedImageTitle({ children = ({ alt }) => alt, ...props }: GeneratedImageTitleProps) {
  return <parts.Title {...props}>{children}</parts.Title>;
}

export type GeneratedImageCloseProps = ComponentProps<typeof parts.Close>;

/** Closes the dialog and returns focus to the trigger. "Close", unless you pass children. */
export function GeneratedImageClose({ children = "Close", ...props }: GeneratedImageCloseProps) {
  return <parts.Close {...props}>{children}</parts.Close>;
}

// Shared, so an update doesn't render the default parts' wrappers again.
const DEFAULT_FRAME = (
  <>
    <GeneratedImagePreview />
    <GeneratedImageImage />
    <GeneratedImageProgress />
    <GeneratedImageError />
    <GeneratedImageTrigger />
    <GeneratedImageDownload />
  </>
);

const DEFAULT_DIALOG = (
  <>
    <GeneratedImageFullImage />
    <div data-generated-image-actions="">
      <GeneratedImageTitle />
      <GeneratedImageDownload>Download</GeneratedImageDownload>
      <GeneratedImageClose />
    </div>
  </>
);

const DEFAULT_PARTS = (
  <>
    <GeneratedImageFrame />
    <GeneratedImageBackdrop />
    <GeneratedImageDialog />
  </>
);

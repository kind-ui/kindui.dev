import { type ComposerTriggerItem, composerPrimitive } from "@kind-ui/agent-ui/core";
import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/react/file-input";
import { createParts } from "@ui-sdk/react/primitive";
import {
  type Token,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "@ui-sdk/react/token-input";
import type { ComponentProps, ReactNode } from "react";
import { Attachments, type AttachmentsProps } from "./attachments.js";
import {
  KindTriggerMenu,
  KindTriggerMenuContent,
  KindTriggerMenuEmpty,
  KindTriggerMenuItem,
  KindTriggerMenuList,
} from "./internal/trigger-menu.js";

const parts = createParts(composerPrimitive, {
  root: "form",
  input: "div",
  "trigger-menu": "div",
  attachments: "div",
  submit: "button",
  stop: "button",
});

export type ComposerProps = Omit<ComponentProps<typeof parts.Root>, "children"> & { children?: ReactNode };

/**
 * A form whose content is a File Input drop zone: files attach by choosing, dropping, or pasting while focus is in it.
 * Name it with `aria-label`.
 */
export function Composer({ children, ...props }: ComposerProps) {
  return (
    <parts.Root {...props}>
      {({ fileInput }) => (
        <FileInput {...fileInput}>
          <FileInputDropzone>{children}</FileInputDropzone>
        </FileInput>
      )}
    </parts.Root>
  );
}

const renderToken = (token: Token) => (
  <TokenInputToken>
    {token.label}
    <TokenInputTokenRemove />
  </TokenInputToken>
);

export type ComposerInputProps = ComponentProps<typeof TokenInputEditor> & { children?: ReactNode };

/**
 * The prompt, a Token Input. Props go to its editor: name it with `aria-label`. Put `ComposerTriggerMenu` inside.
 * To cancel a key, like Enter, use `onKeyDownCapture`: the Token Input handles keys before `onKeyDown` runs.
 */
export function ComposerInput({ children, ...props }: ComposerInputProps) {
  return (
    <parts.Input>
      {({ tokenInput }) => (
        <TokenInput {...tokenInput} renderToken={renderToken}>
          <TokenInputEditor {...props} />
          {children}
        </TokenInput>
      )}
    </parts.Input>
  );
}

/** Suggests `mentions` after `@` and `commands` after `/`; choosing one inserts a token. */
export function ComposerTriggerMenu(props: ComponentProps<typeof KindTriggerMenuContent>) {
  return (
    <parts.TriggerMenu>
      {({ triggers }) => (
        <KindTriggerMenu triggers={triggers}>
          <KindTriggerMenuContent {...props}>
            <KindTriggerMenuEmpty>No matches</KindTriggerMenuEmpty>
            <KindTriggerMenuList>
              {(state) =>
                (state.items as ComposerTriggerItem[]).map((item) => (
                  <KindTriggerMenuItem key={item.value} value={item.value} label={item.label}>
                    <span>{item.label}</span>
                    {item.description ? <span data-description="">{item.description}</span> : null}
                  </KindTriggerMenuItem>
                ))
              }
            </KindTriggerMenuList>
          </KindTriggerMenuContent>
        </KindTriggerMenu>
      )}
    </parts.TriggerMenu>
  );
}

/** The draft's attachments, hidden while there are none. */
export function ComposerAttachments(props: Omit<AttachmentsProps, "items" | "onRemove" | "motion">) {
  return (
    <parts.Attachments>
      {(attachments) => <Attachments aria-label="Attachments" {...props} {...attachments} />}
    </parts.Attachments>
  );
}

/** Opens the file picker. */
export function ComposerAttach(props: ComponentProps<typeof FileInputTrigger>) {
  return <FileInputTrigger aria-label="Attach files" {...props} />;
}

/** Sends the draft. Hidden while Stop shows. */
export const ComposerSubmit = parts.Submit;
/** Shown in Send's place while a submission is pending, when the composer has `onStop`. */
export const ComposerStop = parts.Stop;

import { codeBlockPrimitive, type Token } from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import type { ComponentProps, CSSProperties } from "react";
import {
  KindScrollArea,
  KindScrollAreaContent,
  KindScrollAreaScrollbar,
  KindScrollAreaThumb,
  KindScrollAreaViewport,
} from "./internal/scroll-area.js";

const parts = createParts(codeBlockPrimitive, {
  root: "div",
  header: "div",
  language: "span",
  wrap: "button",
  copy: "button",
  code: "pre",
});

const tokenStyle = (token: Token) =>
  token.color ? ({ "--kind-code-block-token": token.color } as CSSProperties) : undefined;

export type CodeBlockProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/** A code block with its language, a wrap toggle and a copy button. Name it with `aria-label`. */
export function CodeBlock(props: CodeBlockProps) {
  return (
    <parts.Root {...props}>
      <parts.Header>
        <parts.Language>{({ language }) => language}</parts.Language>
        <parts.Wrap />
        <parts.Copy />
      </parts.Header>
      <KindScrollArea stickToEnd={props.streaming ?? false}>
        <KindScrollAreaViewport>
          <KindScrollAreaContent>
            <parts.Code>
              {({ lines }) => (
                <code>
                  {lines.map((line, index) => (
                    <span key={index} data-line="">
                      {line.map((token, at) => (
                        <span key={at} data-font-style={token.fontStyle} style={tokenStyle(token)}>
                          {token.content}
                        </span>
                      ))}
                    </span>
                  ))}
                </code>
              )}
            </parts.Code>
          </KindScrollAreaContent>
        </KindScrollAreaViewport>
        <KindScrollAreaScrollbar orientation="horizontal">
          <KindScrollAreaThumb />
        </KindScrollAreaScrollbar>
        <KindScrollAreaScrollbar orientation="vertical">
          <KindScrollAreaThumb />
        </KindScrollAreaScrollbar>
      </KindScrollArea>
    </parts.Root>
  );
}

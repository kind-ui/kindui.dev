"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import AttachmentsExample from "@/examples/attachments/basic";
import CodeBlockExample from "@/examples/code-block/basic";
import ComposerExample from "@/examples/composer/basic";
import ConversationExample from "@/examples/conversation/basic";
import LoaderExample from "@/examples/loader/basic";
import MarkdownExample from "@/examples/markdown/basic";
import MarkdownTableExample from "@/examples/markdown-table/basic";
import MessageExample from "@/examples/message/basic";
import StepExample from "@/examples/step/basic";
import StreamingTextExample from "@/examples/streaming-text/basic";
import ThinkingIndicatorExample from "@/examples/thinking-indicator/basic";
import TypingIndicatorExample from "@/examples/typing-indicator/basic";
import UploaderExample from "@/examples/uploader/basic";
import { docsHref } from "./data";
import { Reveal } from "@/components/reveal";

const tiles: { name: string; slug: string; Example: ComponentType; wide?: boolean }[] = [
  { name: "Conversation", slug: "conversation", Example: ConversationExample, wide: true },
  { name: "Step", slug: "step", Example: StepExample },
  { name: "Message", slug: "message", Example: MessageExample, wide: true },
  { name: "Streaming Text", slug: "streaming-text", Example: StreamingTextExample },
  { name: "Loader", slug: "loader", Example: LoaderExample },
  { name: "Thinking Indicator", slug: "thinking-indicator", Example: ThinkingIndicatorExample },
  { name: "Typing Indicator", slug: "typing-indicator", Example: TypingIndicatorExample },
  { name: "Markdown", slug: "markdown", Example: MarkdownExample, wide: true },
  { name: "Code Block", slug: "code-block", Example: CodeBlockExample },
  { name: "Composer", slug: "composer", Example: ComposerExample, wide: true },
  { name: "Attachments", slug: "attachments", Example: AttachmentsExample },
  { name: "Markdown Table", slug: "markdown-table", Example: MarkdownTableExample, wide: true },
  { name: "Uploader", slug: "uploader", Example: UploaderExample },
];

export function ComponentsGrid() {
  return (
    <div>
      <div className="mt-10 grid gap-3 sm:gap-4 md:grid-cols-3">
        {tiles.map(({ name, slug, Example, wide }, index) => (
          <Reveal key={slug} delay={(index % 3) * 0.06} className={wide ? "md:col-span-2" : undefined}>
            <article className="flex h-full min-w-0 flex-col rounded-[22px] border border-[var(--home-border)] bg-[var(--home-bg)] p-5 shadow-[var(--home-tile-shadow)]">
              <h3 className="text-[13px] text-[var(--home-muted-fg)]">
                <Link
                  href={docsHref(slug)}
                  className="group inline-flex items-center gap-1 transition-colors hover:text-[var(--home-fg)]"
                >
                  {name}
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                  />
                </Link>
              </h3>
              <div className="flex min-h-40 flex-1 items-center justify-center py-6 [&>*]:w-full">
                <Example />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

"use client";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";
import { Reveal } from "@/components/reveal";
import AttachmentsExample from "@/examples/attachments/basic";
import CheckpointExample from "@/examples/checkpoint/basic";
import CodeBlockExample from "@/examples/code-block/basic";
import ComposerExample from "@/examples/composer/basic";
import ConversationExample from "@/examples/conversation/basic";
import FileTreeExample from "@/examples/file-tree/basic";
import LoaderExample from "@/examples/loader/basic";
import MarkdownExample from "@/examples/markdown/basic";
import MessageExample from "@/examples/message/basic";
import PlanExample from "@/examples/plan/basic";
import QuestionExample from "@/examples/question/basic";
import ReasoningExample from "@/examples/reasoning/basic";
import SourcesExample from "@/examples/sources/basic";
import StreamingTextExample from "@/examples/streaming-text/basic";
import TerminalExample from "@/examples/terminal/basic";
import TestResultsExample from "@/examples/test-results/basic";
import ToolExample from "@/examples/tool/basic";
import { docsHref } from "./data";

const tiles: { name: string; slug: string; Example: ComponentType; wide?: boolean }[] = [
  { name: "Conversation", slug: "conversation", Example: ConversationExample, wide: true },
  { name: "Plan", slug: "plan", Example: PlanExample },
  { name: "Message", slug: "message", Example: MessageExample, wide: true },
  { name: "Streaming Text", slug: "streaming-text", Example: StreamingTextExample },
  { name: "Loader", slug: "loader", Example: LoaderExample },
  { name: "Reasoning", slug: "reasoning", Example: ReasoningExample },
  { name: "Checkpoint", slug: "checkpoint", Example: CheckpointExample },
  { name: "Markdown", slug: "markdown", Example: MarkdownExample, wide: true },
  { name: "Code Block", slug: "code-block", Example: CodeBlockExample },
  { name: "Composer", slug: "composer", Example: ComposerExample, wide: true },
  { name: "Attachments", slug: "attachments", Example: AttachmentsExample },
  { name: "Tool", slug: "tool", Example: ToolExample, wide: true },
  { name: "Question", slug: "question", Example: QuestionExample },
  { name: "Terminal", slug: "terminal", Example: TerminalExample, wide: true },
  { name: "Sources", slug: "sources", Example: SourcesExample },
  { name: "File Tree", slug: "file-tree", Example: FileTreeExample },
  { name: "Test Results", slug: "test-results", Example: TestResultsExample, wide: true },
];

export function ComponentsGrid() {
  return (
    <div>
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-4 md:grid-cols-3">
        {tiles.map(({ name, slug, Example, wide }, index) => (
          <Reveal
            key={slug}
            delay={(index % 3) * 0.06}
            className={wide ? "min-w-0 md:col-span-2" : "min-w-0"}
          >
            <article className="flex h-full min-w-0 flex-col rounded-[22px] border border-[var(--home-border)] bg-[var(--home-bg)] p-5 shadow-[var(--home-tile-shadow)]">
              <h3 className="text-[13px] text-[var(--home-muted-fg)]">
                <a
                  href={docsHref(slug)}
                  className="group inline-flex items-center gap-1 transition-colors hover:text-[var(--home-fg)]"
                >
                  {name}
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                  />
                </a>
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

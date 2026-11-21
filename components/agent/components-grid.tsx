"use client";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "motion/react";
import dynamic from "next/dynamic";
import { type ComponentType, useRef } from "react";
import { Reveal } from "@/components/reveal";
import { docsHref } from "./data";

const tiles: { name: string; slug: string; Example: ComponentType; wide?: boolean }[] = [
  {
    name: "Conversation",
    slug: "conversation",
    Example: dynamic(() => import("@/examples/conversation/basic")),
    wide: true,
  },
  { name: "Plan", slug: "plan", Example: dynamic(() => import("@/examples/plan/basic")) },
  {
    name: "Thread List",
    slug: "thread-list",
    Example: dynamic(() => import("@/examples/thread-list/basic")),
  },
  {
    name: "Sidebar",
    slug: "sidebar",
    Example: dynamic(() => import("@/examples/sidebar/basic")),
    wide: true,
  },
  {
    name: "Message",
    slug: "message",
    Example: dynamic(() => import("@/examples/message/basic")),
    wide: true,
  },
  {
    name: "Streaming Text",
    slug: "streaming-text",
    Example: dynamic(() => import("@/examples/streaming-text/basic")),
  },
  { name: "Loader", slug: "loader", Example: dynamic(() => import("@/examples/loader/basic")) },
  { name: "Reasoning", slug: "reasoning", Example: dynamic(() => import("@/examples/reasoning/basic")) },
  { name: "Checkpoint", slug: "checkpoint", Example: dynamic(() => import("@/examples/checkpoint/basic")) },
  {
    name: "Markdown",
    slug: "markdown",
    Example: dynamic(() => import("@/examples/markdown/basic")),
    wide: true,
  },
  { name: "Code Block", slug: "code-block", Example: dynamic(() => import("@/examples/code-block/basic")) },
  {
    name: "Composer",
    slug: "composer",
    Example: dynamic(() => import("@/examples/composer/full")),
    wide: true,
  },
  {
    name: "Attachments",
    slug: "attachments",
    Example: dynamic(() => import("@/examples/attachments/basic")),
  },
  { name: "Tool", slug: "tool", Example: dynamic(() => import("@/examples/tool/basic")), wide: true },
  { name: "Question", slug: "question", Example: dynamic(() => import("@/examples/question/basic")) },
  {
    name: "Terminal",
    slug: "terminal",
    Example: dynamic(() => import("@/examples/terminal/basic")),
    wide: true,
  },
  {
    name: "Inline Citation",
    slug: "inline-citation",
    Example: dynamic(() => import("@/examples/inline-citation/basic")),
  },
  { name: "File Tree", slug: "file-tree", Example: dynamic(() => import("@/examples/file-tree/basic")) },
  {
    name: "Test Results",
    slug: "test-results",
    Example: dynamic(() => import("@/examples/test-results/basic")),
    wide: true,
  },
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
              <LazyExample Example={Example} />
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// Each example's code loads once its tile nears the viewport, so the grid doesn't weigh on the first load.
function LazyExample({ Example }: { Example: ComponentType }) {
  const ref = useRef<HTMLDivElement>(null);
  const isNear = useInView(ref, { once: true, margin: "600px 0px" });
  return (
    <div ref={ref} className="flex min-h-40 flex-1 items-center justify-center py-6 [&>*]:w-full">
      {isNear && <Example />}
    </div>
  );
}

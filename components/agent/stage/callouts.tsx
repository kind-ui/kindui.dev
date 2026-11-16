"use client";
import { type RefObject, useEffect, useState } from "react";
import { docsHref } from "../data";

const targets = [
  { name: "Conversation", slug: "conversation", selector: '[data-slot="kind-conversation"]', side: "left" },
  {
    name: "Thinking Indicator",
    slug: "thinking-indicator",
    selector: '[data-slot="kind-thinking-indicator"]',
    side: "left",
  },
  { name: "Step", slug: "step", selector: '[data-slot="kind-step-list"]', side: "left" },
  { name: "Markdown", slug: "markdown", selector: '[data-slot="kind-markdown"]', side: "left" },
  { name: "Composer", slug: "composer", selector: '[data-slot="kind-composer"]', side: "left" },
  {
    name: "Attachments",
    slug: "attachments",
    selector: '[data-slot="kind-message"] [data-slot="kind-attachments"]',
    side: "right",
  },
  {
    name: "Message",
    slug: "message",
    selector: '[data-slot="kind-message-content"][data-role="user"]',
    side: "right",
  },
  { name: "Code Block", slug: "code-block", selector: '[data-slot="kind-code-block"]', side: "right" },
  {
    name: "Markdown Table",
    slug: "markdown-table",
    selector: '[data-slot="kind-markdown-table"]',
    side: "right",
  },
] as const;

type Callout = { name: string; slug: string; side: "left" | "right"; labelY: number; x: number; y: number };

const gap = 30;

type Layout = { callouts: Callout[]; left: number; right: number; width: number };

function measure(container: HTMLElement, frame: HTMLElement): Layout {
  const box = container.getBoundingClientRect();
  const bounds = frame.getBoundingClientRect();
  const callouts: Callout[] = [];
  for (const target of targets) {
    const el = frame.querySelector(target.selector);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const top = Math.max(rect.top, bounds.top + 12);
    const bottom = Math.min(rect.bottom, bounds.bottom - 12);
    if (bottom - top < 8) continue;
    const y = top + Math.min((bottom - top) / 2, 18);
    callouts.push({
      ...target,
      x: (target.side === "left" ? rect.left : rect.right) - box.left,
      y: y - box.top,
      labelY: y - box.top,
    });
  }
  for (const side of ["left", "right"]) {
    let last = Number.NEGATIVE_INFINITY;
    for (const callout of callouts.filter((c) => c.side === side).sort((a, b) => a.y - b.y)) {
      callout.labelY = Math.max(callout.y, last + gap);
      last = callout.labelY;
    }
  }
  return {
    callouts,
    left: bounds.left - box.left - 16,
    right: bounds.right - box.left + 16,
    width: box.width,
  };
}

/**
 * Hairline labels in the stage's gutters, each pointing at a component inside it and linking to its page. They
 * follow the components as the script plays and the conversation scrolls.
 */
export function Callouts({
  container,
  frame,
  tick,
}: {
  container: RefObject<HTMLElement | null>;
  frame: RefObject<HTMLElement | null>;
  tick: unknown;
}) {
  const [{ callouts, left, right, width }, setLayout] = useState<Layout>({
    callouts: [],
    left: 0,
    right: 0,
    width: 0,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: `tick` changes whenever the stage draws a new frame.
  useEffect(() => {
    const outer = container.current;
    const inner = frame.current;
    if (!outer || !inner) return;
    let request = 0;
    const update = () => {
      cancelAnimationFrame(request);
      request = requestAnimationFrame(() => {
        setLayout(measure(outer, inner));
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(inner);
    inner.addEventListener("scroll", update, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(request);
      observer.disconnect();
      inner.removeEventListener("scroll", update, { capture: true });
    };
  }, [tick, container, frame]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        {callouts.map((c) => {
          const start = c.side === "left" ? left : right;
          const bend = c.side === "left" ? start + 14 : start - 14;
          return (
            <g key={c.slug} className="text-[var(--home-muted-fg)]">
              <path
                d={`M ${start} ${c.labelY} H ${bend} L ${c.x} ${c.y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="3 3"
                className="transition-[d] duration-300"
              />
              <circle cx={c.x} cy={c.y} r={2.5} fill="var(--home-bg)" stroke="currentColor" />
            </g>
          );
        })}
      </svg>
      {callouts.map((c) => (
        <a
          key={c.slug}
          href={docsHref(c.slug)}
          tabIndex={-1}
          style={c.side === "left" ? { top: c.labelY, right: width - left } : { top: c.labelY, left: right }}
          className="pointer-events-auto absolute -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--home-border)] bg-[var(--home-bg)] px-2.5 py-1 font-mono text-[11px] text-[var(--home-muted-fg)] transition-[top,color] duration-300 hover:text-[var(--home-fg)]"
        >
          {c.name}
        </a>
      ))}
    </div>
  );
}

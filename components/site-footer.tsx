import Image from "next/image";
import { siX } from "simple-icons";
import { links } from "@/lib/links";
import { GitHubMark, Wordmark } from "./brand/wordmark";

const agent = (slug: string) => `${links.agentUiDocs}components/${slug}/`;
const chart = (slug: string) => `${links.chartsDocs}components/${slug}/`;

const groups: { title: string; items: [string, string][]; all?: [string, string] }[] = [
  {
    title: "Agent UI",
    items: [
      ["Conversation", agent("conversation")],
      ["Message", agent("message")],
      ["Composer", agent("composer")],
      ["Step", agent("step")],
      ["Markdown", agent("markdown")],
      ["Code Block", agent("code-block")],
      ["Attachments", agent("attachments")],
      ["Thinking Indicator", agent("thinking-indicator")],
    ],
    all: ["View all", links.agentUiDocs],
  },
  {
    title: "Charts",
    items: [
      ["Line Chart", chart("line")],
      ["Bar Chart", chart("bar")],
      ["Area Chart", chart("area")],
      ["Pie Chart", chart("pie")],
      ["Radar Chart", chart("radar")],
      ["Sankey Chart", chart("sankey")],
      ["Heatmap", chart("heatmap")],
      ["Activity Rings", chart("radial")],
    ],
    all: ["View all", links.chartsDocs],
  },
  {
    title: "Guides",
    items: [
      ["Getting started", links.chartsDocs],
      ["Composition", `${links.chartsDocs}building-blocks/chart/`],
      ["Materials", `${links.chartsDocs}guides/materials/`],
      ["Accessibility", `${links.chartsDocs}guides/accessibility/`],
      ["Motion", `${links.chartsDocs}guides/motion/`],
      ["AI agents", links.agents],
      ["AI SDK adapter", `${links.agentUiDocs}adapters/ai-sdk/`],
    ],
  },
  {
    title: "Resources",
    items: [
      ["Agent UI docs", links.agentUiDocs],
      ["Charts docs", links.chartsDocs],
      ["llms.txt", links.llms],
      ["npm package", links.npmCharts],
    ],
  },
  {
    title: "Community",
    items: [
      ["GitHub", links.org],
      ["Agent UI repo", links.agentUiRepo],
      ["Charts repo", links.chartsRepo],
      ["MIT license", `${links.chartsRepo}/blob/main/LICENSE`],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-24 overflow-hidden">
      <Image
        src="/footer-clouds.webp"
        alt=""
        aria-hidden
        width={1920}
        height={280}
        className="footer-art absolute inset-x-0 bottom-0 -z-10 h-[280px] w-full object-cover object-bottom"
      />
      <div className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 sm:px-9">
        <div className="grid gap-14 lg:grid-cols-[minmax(220px,1fr)_3.5fr]">
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-[32px] leading-none">
              <span className="emoji text-2xl" aria-hidden>
                🌸
              </span>
              <Wordmark />
            </a>
            <p className="mt-6 max-w-[260px] text-[15px] leading-[1.8] text-muted-foreground">
              Open-source components for AI interfaces and charts.
            </p>
            <p className="mt-6 max-w-[260px] text-[15px] leading-[1.8] text-muted-foreground">
              Created by{" "}
              <a
                href={links.creator}
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Bhavesh Chowdhury
              </a>
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={links.creator}
                aria-label="Bhavesh Chowdhury on X"
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <XMark />
              </a>
              <a
                href={links.org}
                aria-label="Kind UI on GitHub"
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitHubMark />
              </a>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 xl:grid-cols-5"
          >
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">{g.title}</h2>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  {g.items.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="transition-colors hover:text-foreground">
                        {label}
                      </a>
                    </li>
                  ))}
                  {g.all && (
                    <li>
                      <a href={g.all[1]} className="text-foreground transition-opacity hover:opacity-70">
                        {g.all[0]}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden fill="currentColor">
      <path d={siX.path} />
    </svg>
  );
}

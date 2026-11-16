"use client";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { links } from "@/lib/links";
import { agentNames, BrandIcon } from "./brand-icon";
import { LeadsDonutChart, OrdersBarChart, RingsTile, TrialsLineChart } from "./charts";
import { CopyPrompt } from "./copy-prompt";
import { Install } from "./install";
import { ease } from "./reveal";
import { Stickers } from "./stickers";

type Library = "charts" | "agent";

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto max-w-[1360px] px-5 pt-16 pb-12 text-center sm:pt-[70px] xl:flex xl:min-h-[calc(100svh-84px-150px)] xl:items-center xl:justify-center xl:py-10"
    >
      <Stickers />
      <motion.div
        className="relative"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <h1
          id="hero-title"
          className="mx-auto max-w-[1100px] text-[clamp(32px,4.2vw,58px)] leading-[1.5] font-medium tracking-[-0.055em]"
        >
          <span className="md:whitespace-nowrap">
            Delightful <LibraryPill label="AI interfaces" icon={<ChatGlyph />} href="#agent-ui" /> and{" "}
            <LibraryPill label="charts" icon={<ChartsGlyph />} href="#charts" />,
          </span>{" "}
          <span className="md:whitespace-nowrap">
            ready for <AgentPill />.
          </span>
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
          <a
            href="#agent-ui"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition-opacity hover:opacity-85"
          >
            Browse components
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <CopyPrompt />
        </div>
        <Install />
      </motion.div>
    </section>
  );
}

function LibraryPill({ label, icon, href }: { label: string; icon: React.ReactNode; href: string }) {
  return (
    <a href={href} className="pill">
      <span className="pill-face">
        {icon}
        {label}
      </span>
    </a>
  );
}

function AgentPill() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState<number>();
  const measureRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const name = agentNames[index];

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % agentNames.length);
    }, 2600);
    return () => window.clearInterval(t);
  }, [paused, reduced]);

  // The sizer holds the current name, so observing it re-measures whenever the name changes.
  useLayoutEffect(() => {
    const measure = measureRef.current;
    const button = buttonRef.current;
    if (!measure || !button) return;
    const update = () => {
      const s = getComputedStyle(button);
      const chrome =
        Number.parseFloat(s.paddingLeft) +
        Number.parseFloat(s.paddingRight) +
        Number.parseFloat(s.borderLeftWidth) +
        Number.parseFloat(s.borderRightWidth);
      setWidth(Math.ceil(measure.getBoundingClientRect().width + chrome));
    };
    const observer = new ResizeObserver(update);
    observer.observe(measure);
    void document.fonts.ready.then(update);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className="pill"
      animate={{ width: width ?? "auto" }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
      aria-label={`Switch agent: ${agentNames.join(", ")}`}
      onClick={() => setIndex((i) => (i + 1) % agentNames.length)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span ref={measureRef} className="pill-sizer" aria-hidden>
        <BrandIcon name={name} />
        {name}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={name}
          className="pill-face"
          initial={reduced ? false : { y: "55%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-55%", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease }}
        >
          <BrandIcon name={name} />
          {name}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function ChartsGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="pill-icon">
      <rect x="2.5" y="11" width="5" height="10.5" rx="2.2" fill="#1686ff" />
      <rect x="9.5" y="3" width="5" height="18.5" rx="2.2" fill="#9a63f6" />
      <rect x="16.5" y="7.5" width="5" height="14" rx="2.2" fill="#ff659e" />
    </svg>
  );
}

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="pill-icon">
      <path
        d="M4 3.5h16a2.5 2.5 0 0 1 2.5 2.5v9a2.5 2.5 0 0 1-2.5 2.5h-8.2l-4.6 3.6c-.6.5-1.5 0-1.5-.8v-2.8H4A2.5 2.5 0 0 1 1.5 15V6A2.5 2.5 0 0 1 4 3.5Z"
        fill="#9a63f6"
      />
      <circle cx="7.5" cy="10.5" r="1.6" fill="#fff" />
      <circle cx="12" cy="10.5" r="1.6" fill="#fff" />
      <circle cx="16.5" cy="10.5" r="1.6" fill="#fff" />
    </svg>
  );
}

export function Tile({
  title,
  stat,
  note,
  wide,
  children,
}: {
  title: string;
  stat?: string;
  note?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-[22px] border border-border bg-background/80 p-6 shadow-[inset_0_1px_0_#fff,0_4px_18px_#00000003] backdrop-blur-xl dark:shadow-none ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] text-muted-foreground">{title}</h3>
        {note && <span className="text-[11px] text-muted-foreground">{note}</span>}
      </div>
      {stat && <p className="mt-1 mb-2 text-[28px] leading-tight font-medium tracking-[-0.04em]">{stat}</p>}
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

export function ChartsGrid() {
  return (
    <>
      <Tile title="Orders this week" stat="665" wide>
        <OrdersBarChart />
      </Tile>
      <Tile title="Daily activity">
        <RingsTile />
      </Tile>
      <Tile title="Leads by channel" stat="351">
        <LeadsDonutChart />
      </Tile>
      <Tile title="Trials and paid plans" stat="260" note="Paid in June" wide>
        <TrialsLineChart />
      </Tile>
    </>
  );
}

const more: Record<Library, { names: string[]; href: string }> = {
  charts: {
    names: [
      "Area",
      "Combo",
      "Radar",
      "Radial",
      "Scatter",
      "Heatmap",
      "Waterfall",
      "Sankey",
      "Histogram",
      "Box plot",
    ],
    href: links.chartsDocs,
  },
  agent: {
    names: [
      "Reasoning",
      "Tool",
      "Plan",
      "Task",
      "Subagent",
      "Confirmation",
      "Question",
      "Model Selector",
      "Sources",
      "Inline Citation",
      "Terminal",
      "File Tree",
    ],
    href: links.agentUiDocs,
  },
};

export function MoreRow({ library }: { library: Library }) {
  const reduced = useReducedMotion();
  const { names, href } = more[library];
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-2 pt-5 pb-2 text-xs">
      {names.map((n, i) => (
        <motion.span
          key={n}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.03 }}
          className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-muted-foreground"
        >
          {n}
        </motion.span>
      ))}
      <motion.a
        href={href}
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.1 + names.length * 0.03 }}
        className="group inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 font-medium text-background"
      >
        and more
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </motion.a>
    </div>
  );
}

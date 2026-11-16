"use client";
import { ActivityRings, BarChart } from "@kind-ui/charts";
import { Check } from "lucide-react";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

type Sticker = {
  id: string;
  label: string;
  style: React.CSSProperties;
  rotate: number;
  delay: number;
  render: () => React.ReactNode;
};

const spark = [
  { d: "M", v: 14 },
  { d: "T", v: 22 },
  { d: "W", v: 18 },
  { d: "T", v: 27 },
  { d: "F", v: 33 },
  { d: "S", v: 21 },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/90 p-3 shadow-[inset_0_1px_0_#fff,0_10px_30px_-12px_#0000001f] backdrop-blur-xl dark:shadow-none">
      {children}
    </div>
  );
}

function MiniRings() {
  return (
    <Card>
      <ActivityRings
        rings={[
          { key: "stand", value: 9, domain: [0, 12] },
          { key: "exercise", value: 40, domain: [0, 60] },
          { key: "move", value: 420, domain: [0, 500] },
        ]}
        config={{
          move: { label: "Move", color: "#fa315c" },
          exercise: { label: "Exercise", color: "#a4e936" },
          stand: { label: "Stand", color: "#29cbe0" },
        }}
        barGap={3}
        innerRadius="30%"
        outerRadius="95%"
        frameProps={{ className: "chart-root" }}
        style={{ width: 92, height: 92 }}
        aria-label="Activity rings"
      >
        <ActivityRings.Series cornerRadius={20} background={{ fill: "var(--accent)" }} />
      </ActivityRings>
    </Card>
  );
}

function MiniBars() {
  return (
    <Card>
      <p className="mb-1 text-[11px] text-muted-foreground">Orders</p>
      <p className="text-lg leading-none font-medium tracking-[-0.04em]">980</p>
      <BarChart
        data={spark}
        config={{ v: { label: "Orders", color: "var(--blue)" } }}
        frameProps={{ className: "chart-root" }}
        style={{ width: 130, height: 54 }}
        margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
        aria-label="Orders this week"
      >
        <BarChart.Series dataKey="v" radius={3} maxBarSize={14} />
      </BarChart>
    </Card>
  );
}

function Bubble() {
  return (
    <div className="rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm text-background whitespace-nowrap shadow-[0_10px_30px_-12px_#00000040]">
      Round the bars a bit more
    </div>
  );
}

function Approved() {
  return (
    <Card>
      <div className="flex items-center gap-2 text-[13px]">
        <span className="grid size-5 place-items-center rounded-full bg-[#a4e936]/30">
          <Check className="size-3" />
        </span>
        <code className="font-mono">npm test</code>
        <span className="text-muted-foreground">approved</span>
      </div>
    </Card>
  );
}

function Thinking() {
  return (
    <div className="rounded-full border border-border bg-background/90 px-3 py-1.5 text-[13px] backdrop-blur-xl">
      <ThinkingIndicator />
    </div>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Kindness"
      tabIndex={-1}
      onPointerDownCapture={(e) => e.stopPropagation()}
      onClick={() => setOn((v) => !v)}
      className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${on ? "bg-[#9a63f6]" : "bg-accent"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`size-6 rounded-full bg-white shadow ${on ? "ml-auto" : ""}`}
      />
    </button>
  );
}

const stickers: Sticker[] = [
  { id: "rings", label: "<ActivityRings />", style: { left: "12vw", bottom: "3%" }, rotate: -6, delay: 0, render: MiniRings },
  { id: "bubble", label: "<Message />", style: { left: "3vw", top: "40%" }, rotate: 4, delay: 0.6, render: Bubble },
  { id: "thinking", label: "<ThinkingIndicator />", style: { left: "9vw", top: "6%" }, rotate: -3, delay: 1.2, render: Thinking },
  { id: "bars", label: "<BarChart />", style: { right: "8vw", bottom: "2%" }, rotate: 5, delay: 0.3, render: MiniBars },
  { id: "toggle", label: "<Switch />", style: { right: "12vw", top: "7%" }, rotate: -8, delay: 0.9, render: Toggle },
  { id: "approved", label: "<ToolApproval />", style: { right: "3vw", top: "42%" }, rotate: 3, delay: 1.5, render: Approved },
];

export function Stickers() {
  const reduced = useReducedMotion();
  const bounds = useRef<HTMLDivElement>(null);
  return (
    <div ref={bounds} aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-screen -translate-x-1/2 xl:block">
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className="pointer-events-auto absolute"
          style={s.style}
          initial={reduced ? false : { opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.35 + s.delay * 0.25 }}
        >
          <motion.div
            drag
            dragConstraints={bounds}
            dragSnapToOrigin
            dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
            whileDrag={{ scale: 1.06, rotate: 0, cursor: "grabbing" }}
            whileHover={{ scale: 1.03 }}
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 5 + s.delay, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
            className="group cursor-grab touch-none select-none"
          >
            {s.render()}
            <span className="mt-1.5 block text-center font-mono text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

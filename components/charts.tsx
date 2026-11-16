"use client";
import { ActivityRings, AreaChart, BarChart, LineChart, PieChart, RadarChart } from "@kind-ui/charts";
import { useReducedMotion } from "motion/react";

const axis = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: "var(--chart-axis)" },
} as const;
const number = (v: unknown) => (typeof v === "number" ? v.toLocaleString("en-US") : String(v));

const orders = [
  { day: "Mon", orders: 88 },
  { day: "Tue", orders: 97 },
  { day: "Wed", orders: 112 },
  { day: "Thu", orders: 104 },
  { day: "Fri", orders: 121 },
  { day: "Sat", orders: 74 },
  { day: "Sun", orders: 69 },
];

export function OrdersBarChart() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <BarChart
        data={orders}
        config={{ orders: { label: "Orders", color: "var(--blue)", formatValue: number } }}
        frameProps={{ className: "chart-root" }}
        animate={!reduced}
        accessibilityLayer
        responsive
        style={{ width: "100%", height: 190 }}
        margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
        aria-label="Orders per day this week"
      >
        <BarChart.Grid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
        <BarChart.XAxis dataKey="day" {...axis} tickMargin={8} />
        <BarChart.Series dataKey="orders" radius={6} maxBarSize={28} />
        <BarChart.Tooltip
          cursor={{ fill: "#a4a8be", fillOpacity: 0.09 }}
          {...(reduced ? {} : { valueAnimation: "shuffle" as const })}
        />
      </BarChart>
    </div>
  );
}

const customers = [
  { month: "Mar", new: 42, returning: 58 },
  { month: "Apr", new: 51, returning: 63 },
  { month: "May", new: 47, returning: 71 },
  { month: "Jun", new: 63, returning: 76 },
  { month: "Jul", new: 58, returning: 88 },
  { month: "Aug", new: 66, returning: 93 },
];

export function StackedBarTile() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <BarChart
        data={customers}
        config={{
          returning: { label: "Returning", color: "var(--purple)", formatValue: number },
          new: { label: "New", color: "var(--purple-soft)", formatValue: number },
        }}
        interaction={{ kind: "series", mode: "focus", eligibleKeys: ["returning", "new"] }}
        frameProps={{ className: "chart-root" }}
        animate={!reduced}
        accessibilityLayer
        responsive
        style={{ width: "100%", height: 210 }}
        margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
        aria-label="New and returning customers, March to August"
      >
        <BarChart.Grid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
        <BarChart.XAxis dataKey="month" {...axis} tickMargin={8} />
        <BarChart.Series dataKey="returning" stackId="customers" radius={0} maxBarSize={30} />
        <BarChart.Series dataKey="new" stackId="customers" radius={[5, 5, 0, 0]} maxBarSize={30} />
        <BarChart.Tooltip
          cursor={{ fill: "#a4a8be", fillOpacity: 0.09 }}
          {...(reduced ? {} : { valueAnimation: "shuffle" as const })}
        />
        <BarChart.Legend aria-label="Focus a series" />
      </BarChart>
    </div>
  );
}

const skills = [
  { category: "Speed", a: 82, b: 64 },
  { category: "Quality", a: 74, b: 88 },
  { category: "Reach", a: 66, b: 71 },
  { category: "Cost", a: 58, b: 80 },
  { category: "Support", a: 90, b: 62 },
];

export function RadarTile() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <RadarChart
        data={skills}
        config={{
          a: { label: "Plan A", color: "var(--blue)", formatValue: number },
          b: { label: "Plan B", color: "var(--purple)", formatValue: number },
        }}
        interaction={{ kind: "series", mode: "focus", eligibleKeys: ["a", "b"] }}
        frameProps={{ className: "chart-root" }}
        animate={!reduced}
        accessibilityLayer
        responsive
        outerRadius="72%"
        style={{ width: "100%", height: 230 }}
        aria-label="Plan A and Plan B compared across five qualities"
      >
        <RadarChart.Grid gridType="polygon" stroke="var(--chart-grid)" />
        <RadarChart.AngleAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--chart-axis)" }} tickLine={false} />
        <RadarChart.Series dataKey="a" strokeWidth={2.5} fillOpacity={0.18} />
        <RadarChart.Series dataKey="b" strokeWidth={2.5} fillOpacity={0.18} />
        <RadarChart.Tooltip />
        <RadarChart.Legend aria-label="Focus a plan" />
      </RadarChart>
    </div>
  );
}

const growth = [
  { month: "Jan", orders: 120 },
  { month: "Feb", orders: 180 },
  { month: "Mar", orders: 260 },
  { month: "Apr", orders: 310 },
  { month: "May", orders: 420 },
  { month: "Jun", orders: 560 },
  { month: "Jul", orders: 640 },
];

export function MiniAreaChart() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <AreaChart
        data={growth}
        config={{ orders: { label: "Orders", color: "var(--blue)", formatValue: number } }}
        frameProps={{ className: "chart-root" }}
        animate={!reduced}
        accessibilityLayer
        responsive
        style={{ width: "100%", height: 150 }}
        margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
        aria-label="Orders per month, January to July"
      >
        <AreaChart.XAxis dataKey="month" hide />
        <AreaChart.Series
          dataKey="orders"
          type="monotone"
          material="glow"
          fill="var(--purple)"
          fillOpacity={0.18}
          strokeWidth={2.5}
        />
        <AreaChart.Tooltip cursor={{ stroke: "#8d8e9b", strokeDasharray: "3 4" }} />
      </AreaChart>
    </div>
  );
}

const conversions = [
  { month: "Jan", trials: 320, paid: 90 },
  { month: "Feb", trials: 380, paid: 120 },
  { month: "Mar", trials: 350, paid: 140 },
  { month: "Apr", trials: 460, paid: 170 },
  { month: "May", trials: 520, paid: 230 },
  { month: "Jun", trials: 610, paid: 260 },
];

export function TrialsLineChart() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <LineChart
        data={conversions}
        config={{
          trials: { label: "Trial starts", color: "var(--blue)", formatValue: number },
          paid: { label: "Paid", color: "var(--pink)", formatValue: number },
        }}
        interaction={{ kind: "series", mode: "focus", eligibleKeys: ["trials", "paid"] }}
        frameProps={{ className: "chart-root" }}
        animate={!reduced}
        accessibilityLayer
        responsive
        style={{ width: "100%", height: 200 }}
        margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
        aria-label="Trial starts and paid conversions, January to June"
      >
        <LineChart.Grid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
        <LineChart.XAxis dataKey="month" {...axis} tickMargin={8} />
        <LineChart.Series dataKey="trials" type="monotone" dot={false} strokeWidth={3} />
        <LineChart.Series dataKey="paid" type="monotone" dot={false} strokeWidth={3} />
        <LineChart.Tooltip
          cursor={{ stroke: "#8d8e9b", strokeDasharray: "3 4" }}
          {...(reduced ? {} : { valueAnimation: "shuffle" as const })}
        />
        <LineChart.Legend aria-label="Focus a series" />
      </LineChart>
    </div>
  );
}

const channels = [
  { id: "email", value: 128 },
  { id: "search", value: 92 },
  { id: "social", value: 74 },
  { id: "referral", value: 57 },
];

export function LeadsDonutChart() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <PieChart
        config={{
          email: { label: "Email", color: "var(--blue)", formatValue: number },
          search: { label: "Search", color: "var(--purple)", formatValue: number },
          social: { label: "Social", color: "var(--pink)", formatValue: number },
          referral: { label: "Referral", color: "var(--amber)", formatValue: number },
        }}
        interaction={{
          kind: "category",
          mode: "focus",
          eligibleKeys: ["email", "search", "social", "referral"],
        }}
        frameProps={{ className: "chart-root" }}
        animate={!reduced}
        accessibilityLayer
        responsive
        style={{ width: "100%", height: 210 }}
        aria-label="Leads by channel"
      >
        <PieChart.Series
          categoryKey="id"
          data={channels}
          dataKey="value"
          nameKey="id"
          innerRadius="56%"
          outerRadius="88%"
          cornerRadius={6}
          paddingAngle={2}
        />
        <PieChart.Tooltip itemKey={(entry) => String(entry.payload.id)} />
        <PieChart.Legend aria-label="Focus a channel" />
      </PieChart>
    </div>
  );
}

export function RingsTile() {
  const reduced = useReducedMotion();
  return (
    <div className="chart-card">
      <ActivityRings
        rings={[
          { key: "stand", value: 9, domain: [0, 12] },
          { key: "exercise", value: 38, domain: [0, 60] },
          { key: "move", value: 410, domain: [0, 500] },
        ]}
        config={{
          move: { label: "Move", color: "#fa315c", formatValue: (v: unknown) => `${v} kcal` },
          exercise: { label: "Exercise", color: "#a4e936", formatValue: (v: unknown) => `${v} min` },
          stand: { label: "Stand", color: "#29cbe0", formatValue: (v: unknown) => `${v} hours` },
        }}
        animate={!reduced}
        barGap={5}
        innerRadius="30%"
        outerRadius="92%"
        frameProps={{ className: "chart-root" }}
        responsive
        style={{ width: "100%", height: 210 }}
        aria-label="Daily activity"
      >
        <ActivityRings.Series cornerRadius={20} background={{ fill: "var(--accent)" }} />
        <ActivityRings.Tooltip {...(reduced ? {} : { valueAnimation: "shuffle" as const })} />
        <ActivityRings.Legend />
      </ActivityRings>
    </div>
  );
}

"use client";
import { CornerDownLeft, Search as SearchIcon } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { links } from "@/lib/links";

type Entry = { title: string; group: string; href: string };

const agentDocs = links.agentUiDocs;
const chartsDocs = links.chartsDocs;
const agentComponents = [
  "Conversation",
  "Message",
  "Step",
  "Streaming Text",
  "Loader",
  "Thinking Indicator",
  "Typing Indicator",
  "Markdown",
  "Code Block",
  "Composer",
  "Attachments",
  "Markdown Table",
  "Uploader",
];
const chartTypes = [
  ["Line", "line"],
  ["Area", "area"],
  ["Bar", "bar"],
  ["Combo", "combo"],
  ["Pie / Donut", "pie"],
  ["Radar", "radar"],
  ["Radial / Activity rings", "radial"],
  ["Scatter / Bubble", "scatter"],
  ["Heatmap", "heatmap"],
  ["Histogram", "histogram"],
  ["Box plot", "box-plot"],
  ["Sankey", "sankey"],
  ["Waterfall", "waterfall"],
] as const;
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const entries: Entry[] = [
  { title: "Agent UI docs", group: "Docs", href: agentDocs },
  { title: "AI SDK adapter", group: "Docs", href: `${agentDocs}adapters/ai-sdk/` },
  { title: "Charts docs", group: "Docs", href: chartsDocs },
  { title: "Agents", group: "Docs", href: links.agents },
  ...agentComponents.map((c) => ({
    title: c,
    group: "Agent UI",
    href: `${agentDocs}components/${slug(c)}/`,
  })),
  ...chartTypes.map(([t, s]) => ({ title: t, group: "Charts", href: `${chartsDocs}components/${s}/` })),
];

export function Search() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [shortcut, setShortcut] = useState("⌘K");
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("Ctrl K");
  }, []);

  // Arrow keys move real focus between the input and the result links, so screen readers announce each one.
  const move = (from: number, step: 1 | -1) => {
    const links = list.current?.querySelectorAll("a");
    const next = from + step;
    if (next < 0) input.current?.focus();
    else links?.[Math.min(next, (links?.length ?? 1) - 1)]?.focus();
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? entries.filter((e) => `${e.title} ${e.group}`.toLowerCase().includes(q)) : entries;
  }, [query]);

  const open = useCallback(() => {
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search docs"
        className="flex h-9 items-center gap-2 rounded-full border border-border bg-background/85 pr-1.5 pl-3 text-[13px] text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground max-sm:w-9 max-sm:justify-center max-sm:p-0"
      >
        <SearchIcon size={14} aria-hidden />
        <span className="max-sm:hidden">Search</span>
        <kbd className="ml-6 rounded-md border border-border px-1.5 py-0.5 font-sans text-[11px] max-sm:hidden">
          {shortcut}
        </kbd>
      </button>
      <dialog
        ref={dialog}
        aria-label="Search docs"
        onPointerDown={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="mx-auto mt-[12vh] w-[min(560px,calc(100vw-32px))] rounded-[20px] border border-border bg-background p-0 text-foreground shadow-[0_30px_80px_-20px_#00000040] backdrop:bg-black/30 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <SearchIcon size={15} className="text-muted-foreground" aria-hidden />
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                move(-1, 1);
              } else if (e.key === "Enter" && results[active]) {
                location.href = results[active].href;
              }
            }}
            enterKeyHint="go"
            aria-label="Search components and docs"
            aria-describedby={listId}
            placeholder="Search components and docs"
            className="h-12 flex-1 bg-transparent text-[15px] outline-none focus-visible:outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        <p id={listId} aria-live="polite" className="sr-only">
          {results.length === 1 ? "1 result" : `${results.length} results`}
        </p>
        <ul ref={list} aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results</li>
          )}
          {results.map((r, i) => (
            <li key={r.href}>
              <a
                href={r.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    move(i, e.key === "ArrowDown" ? 1 : -1);
                  }
                }}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${i === active ? "bg-muted" : ""}`}
              >
                <span>{r.title}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {r.group}
                  {i === active && <CornerDownLeft size={12} aria-hidden />}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}

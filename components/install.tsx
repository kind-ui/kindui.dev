"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
} from "@ui-sdk/react/select";
import { Check, ChevronDown, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import type { InstallItems } from "@/lib/registry-items";
import { useCopy } from "@/lib/use-copy";
import { ease } from "./reveal";

type Library = "agent" | "charts";
const managers = ["npm", "pnpm", "yarn", "bun", "shadcn"] as const;
type Manager = (typeof managers)[number];

const libraries: { key: Library; label: string; pkg: string }[] = [
  { key: "agent", label: "Agent UI", pkg: "@kind-ui/agent-ui" },
  { key: "charts", label: "Charts", pkg: "@kind-ui/charts" },
];

const verbs: Record<Exclude<Manager, "shadcn">, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

function command(lib: (typeof libraries)[number], manager: Manager, item: string) {
  return manager === "shadcn" ? `npx shadcn@latest add @kind-ui/${item}` : `${verbs[manager]} ${lib.pkg}`;
}

const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

export function Install({ items }: { items: InstallItems }) {
  const reduced = useReducedMotion();
  const id = useId();
  const [library, setLibrary] = useState<Library>("agent");
  const [manager, setManager] = useState<Manager>("npm");
  const { copied, copy, reset } = useCopy(1800);
  const [itemIndex, setItemIndex] = useState(0);
  const [pickedItem, setPickedItem] = useState<string | null>(null);
  const lib = libraries.find((l) => l.key === library) ?? libraries[0];
  const libraryItems = items[library];
  const item = pickedItem ?? libraryItems[itemIndex % libraryItems.length];
  const text = command(lib, manager, item);
  const isShadcn = manager === "shadcn";
  const cycling = isShadcn && pickedItem === null;

  const panel = useRef<HTMLDivElement>(null);

  // Pauses while the panel is hovered, keyboard-focused or its list is open, so the command doesn't change under
  // the reader.
  useEffect(() => {
    if (!cycling || reduced) return;
    const t = window.setInterval(() => {
      if (
        !document.hidden &&
        !panel.current?.matches(":hover, :has(:focus-visible), :has([aria-expanded=true])")
      )
        setItemIndex((i) => i + 1);
    }, 1800);
    return () => window.clearInterval(t);
  }, [cycling, reduced]);

  return (
    <div className="mx-auto mt-10 w-full max-w-[460px] text-left">
      <fieldset className="mx-auto mb-3 flex w-fit gap-1 rounded-full bg-[#141414] p-1 text-[13px] text-white shadow-[0_8px_24px_#00000026] dark:border dark:border-border">
        <legend className="sr-only">Library</legend>
        {libraries.map((l) => (
          <label
            key={l.key}
            className="relative cursor-pointer rounded-full px-4 py-1.5 text-white/60 transition-colors has-checked:text-white has-focus-visible:outline has-focus-visible:outline-white"
          >
            <input
              type="radio"
              name={`${id}-library`}
              value={l.key}
              checked={library === l.key}
              onChange={() => {
                setLibrary(l.key);
                setItemIndex(0);
                setPickedItem(null);
                reset();
              }}
              className="sr-only"
            />
            {library === l.key && (
              <motion.span
                layoutId={`${id}-library`}
                className="absolute inset-0 rounded-full bg-white/15"
                transition={reduced ? { duration: 0 } : spring}
              />
            )}
            <span className="relative">{l.label}</span>
          </label>
        ))}
      </fieldset>

      <div ref={panel} className="install-panel rounded-[18px] border border-border px-4 pt-2.5 pb-4">
        <div className="flex items-center justify-between">
          <fieldset className="flex gap-0.5">
            <legend className="sr-only">Installation option</legend>
            {managers.map((m) => (
              <label
                key={m}
                className="relative flex h-[30px] cursor-pointer items-center rounded-full px-[9px] text-[13px] text-muted-foreground transition-colors has-checked:text-foreground has-focus-visible:outline has-focus-visible:outline-foreground"
              >
                <input
                  type="radio"
                  name={`${id}-manager`}
                  value={m}
                  checked={manager === m}
                  onChange={() => {
                    setManager(m);
                    reset();
                  }}
                  className="sr-only"
                />
                {manager === m && (
                  <motion.span
                    layoutId={`${id}-manager`}
                    className="install-tab-active absolute inset-0 rounded-full border border-border"
                    transition={reduced ? { duration: 0 } : spring}
                  />
                )}
                <span className="relative">{m}</span>
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            onClick={() => copy(text)}
            aria-label={copied ? "Install command copied" : "Copy install command"}
            className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="size-[13px]" /> : <Copy className="size-[13px]" />}
          </button>
        </div>
        <div className="mt-2 overflow-x-auto px-1.5 [scrollbar-width:none]">
          <span className="sr-only">{isShadcn ? "npx shadcn@latest add @kind-ui/" : text}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.code
              key={isShadcn ? `${library}-shadcn` : text}
              initial={reduced ? false : { opacity: 0, y: 6, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, y: -6, filter: "blur(3px)" }}
              transition={{ duration: 0.22, ease }}
              className="flex items-center font-mono text-sm whitespace-nowrap"
            >
              <span className="text-muted-foreground" aria-hidden>
                $&nbsp;
              </span>
              <span aria-hidden>{isShadcn ? "npx shadcn@latest add @kind-ui/" : text}</span>
              {isShadcn && (
                <Select
                  value={item}
                  onValueChange={(value) => {
                    if (value === null) return;
                    setPickedItem(value);
                    reset();
                  }}
                >
                  <SelectLabel className="sr-only">Component</SelectLabel>
                  <SelectTrigger className="-my-0.5 inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors outline-none hover:bg-muted focus-visible:outline focus-visible:outline-foreground data-open:bg-muted">
                    <span className="sr-only">{item}</span>
                    <span aria-hidden className="relative inline-flex overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={item}
                          initial={reduced ? false : { y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
                          transition={{ duration: 0.28, ease }}
                        >
                          {item}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <ChevronDown aria-hidden className="size-3 text-muted-foreground" />
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    sideOffset={6}
                    className="z-50 max-h-[min(240px,var(--available-height))] min-w-44 origin-[var(--transform-origin)] overflow-y-auto rounded-xl border border-border bg-background p-1 font-mono text-[13px] shadow-[0_8px_24px_#0000001a] transition-[opacity,scale] duration-150 outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0"
                  >
                    {libraryItems.map((name) => (
                      <SelectItem
                        key={name}
                        value={name}
                        className="flex cursor-default items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-muted-foreground data-highlighted:bg-muted data-highlighted:text-foreground data-selected:text-foreground"
                      >
                        {name}
                        <SelectItemIndicator>
                          <Check className="size-3" />
                        </SelectItemIndicator>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.code>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

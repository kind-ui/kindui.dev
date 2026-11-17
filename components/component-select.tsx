"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
} from "@ui-sdk/react/select";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ease } from "./reveal";

export const addCommandPrefix = "npx shadcn@latest add @kind-ui/";

export function ComponentSelect({
  items,
  value,
  onValueChange,
}: {
  items: string[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      <SelectLabel render={<span aria-hidden />} className="sr-only">
        Component
      </SelectLabel>
      <SelectTrigger className="-my-0.5 inline-flex items-center gap-1 rounded-md py-0.5 pr-1 transition-colors outline-none hover:bg-muted focus-visible:outline focus-visible:outline-foreground data-open:bg-muted">
        <span className="sr-only">{value}</span>
        <span aria-hidden className="relative inline-flex overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={reduced ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
              transition={{ duration: 0.28, ease }}
            >
              {value}
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
        {items.map((name) => (
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
  );
}

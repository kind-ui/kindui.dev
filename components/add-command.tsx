"use client";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/use-copy";
import { addCommandPrefix, ComponentSelect } from "./component-select";

export function AddCommand({ items, initial, label }: { items: string[]; initial: string; label: string }) {
  const { copied, copy, reset } = useCopy();
  const [pickedItem, setPickedItem] = useState<string | null>(null);
  const item = pickedItem ?? initial;
  const command = `${addCommandPrefix}${item}`;
  const commandRow = useRef<HTMLElement>(null);

  // Long item names overflow the row, so keep its end, and the picker, in view.
  // biome-ignore lint/correctness/useExhaustiveDependencies: each item changes the row's width.
  useEffect(() => {
    commandRow.current?.scrollTo({ left: commandRow.current.scrollWidth });
  }, [item]);

  return (
    <div className="group flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 font-mono text-[13px]">
      <span aria-hidden className="select-none text-muted-foreground">
        $
      </span>
      <code
        ref={commandRow}
        // The picker's hidden label and value would land in a selection's text.
        onCopy={(event) => {
          event.preventDefault();
          event.clipboardData.setData("text/plain", command);
        }}
        className="flex min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap [scrollbar-width:none]"
      >
        {addCommandPrefix}
        <ComponentSelect
          items={items}
          value={item}
          onValueChange={(value) => {
            setPickedItem(value);
            reset();
          }}
        />
      </code>
      <button
        type="button"
        onClick={() => copy(command)}
        className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={copied ? "Copied" : `Copy ${label}`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

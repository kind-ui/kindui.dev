"use client";
import { Check, Copy, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useCopy } from "@/lib/use-copy";
import { ease } from "./reveal";

type Choice = "agent" | "charts";

const agentPrompt = `Set up Kind UI's Agent UI in this project.

1. If the project has no components.json, run: npx shadcn@latest init
2. Add the @kind-ui registry to components.json:
   "registries": { "@kind-ui": "https://kindui.dev/r/{name}.json" }
3. Add a component with: npx shadcn@latest add @kind-ui/conversation
   For Web Components, add the -web version, for example @kind-ui/conversation-web.
4. The CLI writes an AGENTS.md next to the components. Follow it, and read https://kindui.dev/docs/agent-ui/llms.txt before using a component.`;

const chartsPrompt = `Set up Kind UI Charts in this React project. It uses Tailwind CSS v4.

1. Install @kind-ui/charts with the project's package manager.
2. In the Tailwind entry CSS, after @import "tailwindcss", add a line so Tailwind scans the package (the path is relative to the CSS file):
   @source "../node_modules/@kind-ui/charts/dist";
3. If you support skills, run: npx skills add kind-ui/charts --skill kind-ui-charts
4. Add a note to AGENTS.md, creating it if needed: before using Kind UI Charts, follow the kind-ui-charts skill if it's installed, and read https://kindui.dev/docs/charts/llms.txt.`;

const prompts: Record<Choice, string> = {
  agent: `${agentPrompt}\n\nWhen you're done, ask me what I'd like to build.`,
  charts: `${chartsPrompt}\n\nWhen you're done, ask me what I'd like to build.`,
};

const choices: { key: Choice; label: string }[] = [
  { key: "agent", label: "Agent UI" },
  { key: "charts", label: "Charts" },
];

export function CopyPrompt() {
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pillId = useId();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<Choice>("agent");
  const { copied, copy, reset } = useCopy();

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 font-medium transition-colors hover:bg-muted"
      >
        Copy prompt
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-auto w-[min(640px,calc(100vw-32px))] rounded-[24px] border border-border bg-background p-0 text-left text-foreground shadow-[0_30px_80px_-20px_#00000040] backdrop:bg-black/30 backdrop:backdrop-blur-sm"
      >
        <div className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-xl font-medium tracking-[-0.03em]">
                Copy prompt
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a library, then paste this prompt into your coding agent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
          <fieldset className="flex w-fit gap-1 rounded-full bg-muted p-1 text-[13px]">
            <legend className="sr-only">Library</legend>
            {choices.map((c) => (
              <label
                key={c.key}
                className="relative cursor-pointer rounded-full px-4 py-1.5 text-muted-foreground transition-colors has-checked:text-foreground has-focus-visible:outline has-focus-visible:outline-foreground"
              >
                <input
                  type="radio"
                  name={pillId}
                  value={c.key}
                  checked={choice === c.key}
                  onChange={() => {
                    setChoice(c.key);
                    reset();
                  }}
                  className="sr-only"
                />
                {choice === c.key && (
                  <motion.span
                    layoutId={pillId}
                    className="install-tab-active absolute inset-0 rounded-full border border-border"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="relative rounded-2xl border border-border bg-muted/60">
            <AnimatePresence mode="wait" initial={false}>
              <motion.pre
                key={choice}
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease }}
                className="max-h-[50vh] overflow-auto p-4 pr-12 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap"
              >
                {prompts[choice]}
              </motion.pre>
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => copy(prompts[choice])}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy prompt"}
          </button>
        </div>
      </dialog>
    </>
  );
}

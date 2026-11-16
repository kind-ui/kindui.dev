"use client";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { links } from "@/lib/links";
import { ease, Reveal } from "./reveal";

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is Kind UI?",
    a: "A family of open-source component libraries. Agent UI covers AI interfaces like conversations, messages and composers, and Charts covers data visualization. Both share one look, so they work well together.",
  },
  {
    q: "Is it free to use?",
    a: "Yes. Both libraries are open source under the MIT license, so you can use them in personal and commercial projects.",
  },
  {
    q: "Which frameworks are supported?",
    a: "Agent UI works in React, Vue, Svelte, Solid and Web Components, the same as UI SDK. Charts is for React, built on Recharts and Motion. Both use Tailwind CSS v4 for styling.",
  },
  {
    q: "How do I install a component?",
    a: (
      <>
        Install the package from npm, or run <code className="font-mono text-foreground">npx shadcn@latest add</code>{" "}
        with a component name to copy its source into your project. The copied code is yours to edit.
      </>
    ),
  },
  {
    q: "What does ready for agents mean?",
    a: (
      <>
        Each library comes with an agent skill and an{" "}
        <a href={links.llms} className="text-foreground underline underline-offset-4">
          llms.txt
        </a>{" "}
        file, so your coding agent knows how to use it. Agent UI components also expose their state and actions
        through UI SDK, so an agent can read a page and use the controls directly.
      </>
    ),
  },
  {
    q: "Does Agent UI work with the AI SDK?",
    a: "Yes. Agent UI includes an adapter that maps AI SDK messages, tool calls and approvals to its components. It doesn't call the SDK itself, so you keep your own backend and model.",
  },
  {
    q: "How do I theme the components?",
    a: "Colors, radius and fonts come from CSS variables. Set your own values in your stylesheet, and light and dark mode follow automatically.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-[760px] px-5 pt-20 sm:px-9 sm:pt-32">
      <Reveal>
        <h2
          id="faq-title"
          className="text-center text-[clamp(32px,4vw,52px)] leading-[1.1] font-medium tracking-[-0.055em]"
        >
          FAQ
        </h2>
      </Reveal>
      <div className="mt-14 border-t border-border">
        {faqs.map((f) => (
          <Item key={f.q} {...f} />
        ))}
      </div>
    </section>
  );
}

function Item({ q, a }: { q: string; a: React.ReactNode }) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg tracking-[-0.02em]"
        >
          {q}
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
            className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"
          >
            <Plus size={14} aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="max-w-[620px] pb-6 text-base leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

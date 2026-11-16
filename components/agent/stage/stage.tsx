"use client";
import { RotateCcw } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ease } from "@/components/reveal";
import { Callouts } from "./callouts";
import { ReactStage } from "./react-stage";
import { frameAt, scriptEnd } from "./script";

const tick = 40;

/** Plays the script once the stage scrolls into view; reduced motion jumps to its end. */
function useScript(inView: boolean) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduced) setT(scriptEnd);
    else setPlaying(true);
  }, [inView, reduced]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (!document.hidden) setT((t) => Math.min(t + tick, scriptEnd));
    }, tick);
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (t >= scriptEnd) setPlaying(false);
  }, [t]);

  const replay = () => {
    setT(reduced ? scriptEnd : 0);
    setPlaying(!reduced);
  };
  return { t, replay };
}

export function Stage() {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.4 });
  const { t, replay } = useScript(inView);
  const frame = useMemo(() => frameAt(t), [t]);

  return (
    <section aria-labelledby="stage-title">
      <h3 id="stage-title" className="sr-only">
        Live components
      </h3>
      <div ref={container} className="relative lg:px-[180px]">
        <div className="mb-3 flex justify-end px-2 text-[13px] text-[var(--home-muted-fg)]">
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-[var(--home-muted)] hover:text-[var(--home-fg)]"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Replay
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.8, ease }}
          className="rounded-[32px] border border-[var(--home-border)] bg-[var(--home-stage)] p-3 sm:p-4"
        >
          <div
            ref={frameRef}
            className="relative h-[600px] overflow-hidden rounded-[22px] border border-[var(--home-border)] bg-[var(--home-bg)] shadow-[var(--home-tile-shadow)]"
          >
            <ReactStage frame={frame} />
          </div>
        </motion.div>
        <Callouts container={container} frame={frameRef} tick={t} />
      </div>
    </section>
  );
}

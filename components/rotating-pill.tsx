"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ease } from "./reveal";

export function RotatingPill({
  items,
  label,
  hint,
  face = (item) => item,
}: {
  items: readonly string[];
  /** What a screen reader reads in place of the rotating face. */
  label: string;
  /** Describes what a click does. */
  hint: string;
  face?: (item: string) => React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState<number>();
  const measureRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const item = items[index];
  const hintId = useId();

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % items.length);
    }, 2600);
    return () => window.clearInterval(t);
  }, [paused, reduced, items.length]);

  // The sizer holds the current item, so observing it re-measures whenever the item changes.
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
      aria-describedby={hintId}
      onClick={() => setIndex((i) => (i + 1) % items.length)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="sr-only">{label}</span>
      <span id={hintId} hidden>
        {hint}
      </span>
      <span ref={measureRef} className="pill-sizer" aria-hidden>
        {face(item)}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={item}
          aria-hidden
          className="pill-face"
          initial={reduced ? false : { y: "55%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-55%", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease }}
        >
          {face(item)}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

/** Copies text and reports `copied` for `ms`. A blocked clipboard leaves `copied` false. */
export function useCopy(ms = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), ms);
  };
  const reset = () => {
    window.clearTimeout(timer.current);
    setCopied(false);
  };
  return { copied, copy, reset };
}

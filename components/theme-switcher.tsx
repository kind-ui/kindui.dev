"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
const options: { key: Theme; label: string; Icon: typeof Sun }[] = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "system", label: "System", Icon: Monitor },
];

// Runs before paint (see layout) so the page never flashes the wrong theme.
export const themeScript = `(()=>{try{const t=localStorage.getItem("theme")||"system";const d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch{}})()`;

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function ThemeSwitcher() {
  const reduced = useReducedMotion();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((localStorage.getItem("theme") as Theme | null) ?? "system");
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const pick = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    apply(t);
  };

  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-full border border-border bg-background/85 p-[3px] backdrop-blur-md">
      {options.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={theme === key}
          aria-label={label}
          onClick={() => pick(key)}
          className="relative grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground aria-checked:text-foreground"
        >
          {theme === key && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 rounded-full bg-muted"
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <Icon size={14} className="relative" aria-hidden />
        </button>
      ))}
    </div>
  );
}

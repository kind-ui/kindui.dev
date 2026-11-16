"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

const options = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="theme">
      {children}
    </NextThemeProvider>
  );
}

export function ThemeSwitcher() {
  const reduced = useReducedMotion();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <fieldset className="flex rounded-full border border-border bg-background/85 p-[3px] backdrop-blur-md">
      <legend className="sr-only">Theme</legend>
      {options.map(({ key, label, Icon }) => {
        const checked = mounted && theme === key;
        return (
          <label
            key={key}
            title={label}
            className="relative grid size-7 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground has-checked:text-foreground has-focus-visible:outline has-focus-visible:outline-foreground"
          >
            <input
              type="radio"
              name="theme"
              value={key}
              checked={checked}
              onChange={() => setTheme(key)}
              aria-label={label}
              className="sr-only"
            />
            {checked && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-muted"
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon size={14} className="relative" aria-hidden />
          </label>
        );
      })}
    </fieldset>
  );
}

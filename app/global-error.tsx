"use client";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { BrokenPage } from "@/components/broken-page";
import { ThemeProvider } from "@/components/theme-switcher";
import "./(home)/globals.css";

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <title>Something broke — Kind UI</title>
        <link rel="icon" href="/cherry-blossom.png" />
        <ThemeProvider>
          <BrokenPage retry={retry} />
        </ThemeProvider>
      </body>
    </html>
  );
}

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ErrorPage, primaryButton } from "@/components/error-page";
import { ThemeProvider } from "@/components/theme-switcher";
import "./(home)/globals.css";

export const metadata: Metadata = {
  title: "Page not found — Kind UI",
  icons: { icon: "/cherry-blossom.png", apple: "/cherry-blossom.png" },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ThemeProvider>
          <ErrorPage
            lead="This page went"
            excuses={{ missing: "🫥", "for a walk": "🚶", "off the chart": "📈", "to lunch": "🍜" }}
            description="We looked everywhere. Here are some pages that do exist."
            action={
              <a href="/" className={primaryButton}>
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Back home
              </a>
            }
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

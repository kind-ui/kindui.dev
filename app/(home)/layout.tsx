import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { themeScript } from "@/components/theme-switcher";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kindui.dev"),
  title: "Kind UI — Components for AI interfaces and charts",
  description:
    "Open-source, accessible components for AI interfaces and charts.",
  icons: { icon: "/cherry-blossom.png", apple: "/cherry-blossom.png" },
  openGraph: {
    title: "Kind UI",
    description: "Open-source components for AI interfaces and charts.",
    url: "https://kindui.dev",
    siteName: "Kind UI",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static theme bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

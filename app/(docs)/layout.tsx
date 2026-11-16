import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { SectionBody } from "@/components/docs-body";
import { Provider } from "@/components/docs-provider";
import { appName, origin } from "@/lib/shared";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { template: `%s | ${appName}`, default: appName },
  icons: { icon: "/cherry-blossom.png", apple: "/cherry-blossom.png" },
};

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
      suppressHydrationWarning
    >
      <SectionBody>
        <Provider>{children}</Provider>
      </SectionBody>
    </html>
  );
}

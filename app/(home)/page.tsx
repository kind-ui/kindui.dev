import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { AgentSection, ChartsSection } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Together } from "@/components/together";
import { installItems } from "@/lib/registry-items";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Hero installItems={installItems()} />
        <AgentSection />
        <ChartsSection />
        <Together />
        <Features />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}

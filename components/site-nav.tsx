import { links } from "@/lib/links";
import { GitHubMark, Wordmark } from "./brand/wordmark";
import { Search } from "./search";
import { ThemeSwitcher } from "./theme-switcher";

const navLinks = [
  ["Docs", links.docs],
  ["Agent UI", links.agentUiDocs],
  ["Charts", links.chartsDocs],
  ["Agents", links.agents],
] as const;

export function SiteNav() {
  return (
    <header className="mx-auto flex h-[84px] max-w-[1260px] items-center justify-between gap-5 px-5 sm:px-9">
      <div className="flex items-center gap-10">
        <a
          href="/"
          aria-label="Kind UI home"
          className="inline-flex items-center gap-2 text-[28px] max-sm:text-[23px]"
        >
          <span className="emoji text-2xl max-sm:text-xl" aria-hidden>
            🌸
          </span>
          <Wordmark />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} className="transition-colors hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Search />
        <ThemeSwitcher />
        <a
          href={links.agentUiRepo}
          aria-label="Agent UI on GitHub"
          className="grid size-9 place-items-center rounded-full border border-border bg-background/85 backdrop-blur-md transition-colors hover:bg-muted"
        >
          <GitHubMark />
        </a>
      </div>
    </header>
  );
}

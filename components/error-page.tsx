"use client";
import { links } from "@/lib/links";
import { RotatingPill } from "./rotating-pill";
import { SiteNav } from "./site-nav";

const ways = [
  ["Docs", links.docs],
  ["Agent UI", links.agentUiDocs],
  ["Charts", links.chartsDocs],
] as const;

export function ErrorPage({
  lead,
  excuses,
  description,
  action,
}: {
  lead: string;
  /** Each excuse and its emoji. The first excuse is what a screen reader reads. */
  excuses: Record<string, string>;
  description: string;
  /** The primary button. */
  action: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1360px] px-5 pt-16 pb-24 text-center sm:pt-[70px]">
        <div className="hero-rise">
          <h1 className="text-[clamp(32px,4.2vw,58px)] leading-[1.5] font-medium tracking-[-0.055em]">
            <span className="hero-sentence">
              {lead}{" "}
              <span className="pill-slot">
                <RotatingPill
                  items={Object.keys(excuses)}
                  label={Object.keys(excuses)[0]}
                  hint="Shows another excuse"
                  face={(excuse) => (
                    <>
                      <span className="emoji">{excuses[excuse]}</span>
                      {excuse}
                    </>
                  )}
                />
                .
              </span>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">{description}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-2 text-sm">
            {action}
            {ways.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full border border-border bg-background/85 px-5 py-2.5 font-medium transition-colors hover:bg-muted"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export const primaryButton =
  "group inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition-opacity hover:opacity-85";

import { ArrowRight } from "lucide-react";
import { CopyCommand } from "./copy-command";
import { Reveal } from "./reveal";

export function Chapter({
  id,
  index,
  name,
  title,
  body,
  command,
  docs,
  children,
  first,
}: {
  first?: boolean;
  id: string;
  index: string;
  name: string;
  title: React.ReactNode;
  body: string;
  command: string;
  docs: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`mx-auto max-w-[1260px] scroll-mt-8 px-5 sm:px-9 ${first ? "pt-6" : "pt-20 sm:pt-32"}`}
    >
      <Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 border-t border-border pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {index} · {name}
            </p>
            <h2
              id={`${id}-title`}
              className="mt-4 max-w-[640px] text-[clamp(32px,4vw,52px)] leading-[1.08] font-medium tracking-[-0.055em]"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-[560px] text-lg leading-snug tracking-[-0.01em] text-muted-foreground">
              {body}
            </p>
          </div>
          <div className="space-y-3">
            <CopyCommand command={command} label={`${name} install command`} />
            <a
              href={docs}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Read the {name} docs
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
      <div className="mt-14">{children}</div>
    </section>
  );
}

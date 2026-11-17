import { Accessibility, Blocks, Bot, MoonStar, PackageOpen, Waves } from "lucide-react";
import { Reveal } from "./reveal";

const features = [
  {
    icon: Accessibility,
    title: "Accessible",
    body: "Use a keyboard or a screen reader. Every component has labels and a visible focus ring.",
  },
  {
    icon: Blocks,
    title: "Composable",
    body: "Each component is made of small parts you can rearrange, restyle or leave out.",
  },
  {
    icon: PackageOpen,
    title: "Yours to own",
    body: "Install the package from npm, or copy a component's source into your project with shadcn.",
  },
  {
    icon: Waves,
    title: "Calm motion",
    body: "Animations stay short, and they stop when someone turns on reduced motion.",
  },
  {
    icon: MoonStar,
    title: "Light and dark",
    body: "Colors come from CSS variables, so each theme works without extra setup.",
  },
  {
    icon: Bot,
    title: "Ready for agents",
    body: "Agent skills and an llms.txt file show your coding agent how to use each library.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[920px] scroll-mt-8 px-5 py-20 sm:px-9 sm:py-32">
      <Reveal>
        <h2 className="text-center text-[clamp(32px,4vw,52px)] leading-[1.1] font-medium tracking-[-0.055em]">
          What every library includes.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-x-16 gap-y-10 sm:mt-20 sm:grid-cols-2 sm:gap-y-14">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 2) * 0.08}>
            <f.icon className="size-7 text-muted-foreground" strokeWidth={1.4} aria-hidden />
            <h3 className="mt-6 text-xl font-medium tracking-[-0.03em]">{f.title}</h3>
            <p className="mt-1.5 text-lg leading-snug tracking-[-0.01em] text-muted-foreground">{f.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

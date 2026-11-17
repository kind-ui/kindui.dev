import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/ui/tabs";
import { Children, type ReactNode } from "react";

const trigger =
  "h-7 rounded-md border border-transparent px-2.5 font-mono text-[11px] text-fd-muted-foreground uppercase tracking-wider transition-colors hover:text-fd-foreground data-[active]:border-fd-border data-[active]:text-fd-foreground";

/**
 * A live example over its source, switched by Preview and Code buttons, with a plain-text `caption` below:
 * `<Example caption="…"><StepExample /><include …>./examples/step/basic.tsx</include></Example>`.
 * Agent UI previews sit on its surface color at a message's width; Charts previews fill the page's width.
 */
export function Example({ caption, children }: { caption?: string; children: ReactNode }) {
  const [preview, code] = Children.toArray(children);
  return (
    <figure className="not-prose my-6">
      <Tabs defaultValue="preview" className="overflow-hidden rounded-xl border">
        <TabsList className="flex gap-1 border-b p-2">
          <TabsTrigger value="preview" className={trigger}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className={trigger}>
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          className="flex min-h-72 items-center justify-center bg-fd-background p-8 in-[.agent-ui]:bg-[var(--kind-color-surface)] in-[.agent-ui]:text-[var(--kind-color-fg)]"
        >
          <div className="w-full in-[.agent-ui]:max-w-lg">{preview}</div>
        </TabsContent>
        <TabsContent
          value="code"
          className="[&_.fd-scroll-container]:max-h-72 [&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:bg-transparent [&_figure]:shadow-none"
        >
          {code}
        </TabsContent>
      </Tabs>
      {caption && <figcaption className="mt-2 px-1 text-fd-muted-foreground text-sm">{caption}</figcaption>}
    </figure>
  );
}

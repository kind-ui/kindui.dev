import { links } from "@/lib/links";
import type { InstallItems } from "@/lib/registry-items";
import { ComponentsGrid } from "./agent/components-grid";
import { Stage } from "./agent/stage/stage";
import { Chapter } from "./chapter";
import { ChartsGrid, MoreRow } from "./hero";
import { UiSdkLogo } from "./ui-sdk-logo";

export function AgentSection({ items }: { items: InstallItems["agent"] }) {
  return (
    <Chapter
      first
      id="agent-ui"
      index="01"
      name="Agent UI"
      title={
        <>
          Agent-ready UI, built on{" "}
          <span className="whitespace-nowrap">
            <a href={links.uiSdk} className="transition-opacity hover:opacity-70">
              <UiSdkLogo className="align-baseline" />
            </a>
            .
          </span>
        </>
      }
      body="Messages, the steps an agent took, the sources it cited and the code it ran, answers that stream in, and a composer to reply, with controls for the model and effort, approval mode and dictation. Your agent can read every component and use its controls, without screenshots. Works in React, Vue, Svelte, Solid and Web Components."
      items={items}
      initialItem="conversation"
      docs={links.agentUiDocs}
    >
      <Stage />
      <ComponentsGrid />
      <div className="mt-4 rounded-[32px] border border-border bg-stage p-3 sm:p-4">
        <MoreRow library="agent" />
      </div>
    </Chapter>
  );
}

export function ChartsSection({ items }: { items: InstallItems["charts"] }) {
  return (
    <Chapter
      id="charts"
      index="02"
      name="Charts"
      title="Interactive charts, built on Recharts and Motion."
      body="Hover a bar to read it, or tab in and use the arrow keys. Tap a legend to focus one series. Bar, line, pie, radar, sankey and more."
      items={items}
      initialItem="bar-chart"
      docs={links.chartsDocs}
    >
      <div className="rounded-[32px] border border-border bg-stage p-3 sm:p-4">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-4 md:grid-cols-3 md:[grid-auto-rows:minmax(330px,auto)]">
          <ChartsGrid />
        </div>
        <MoreRow library="charts" />
      </div>
    </Chapter>
  );
}

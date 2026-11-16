import { commands, links } from "@/lib/links";
import { ComponentsGrid } from "./agent/components-grid";
import { Stage } from "./agent/stage/stage";
import { Chapter } from "./chapter";
import { ChartsGrid, MoreRow } from "./hero";
import { UiSdkLogo } from "./ui-sdk-logo";

export function AgentSection() {
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
      body="Messages, the steps an agent took, answers that stream in, and a composer to reply. Your agent can read every component and use its controls, without screenshots. Works in React, Vue, Svelte, Solid and Web Components."
      command={commands.agentUiAdd}
      docs={`${links.agentUiDocs}/`}
    >
      <Stage />
      <ComponentsGrid />
      <div className="mt-4 rounded-[32px] border border-border bg-stage p-3 sm:p-4">
        <MoreRow library="agent" />
      </div>
    </Chapter>
  );
}

export function ChartsSection() {
  return (
    <Chapter
      id="charts"
      index="02"
      name="Charts"
      title="Interactive charts, built on Recharts and Motion."
      body="Hover a bar to read it, or tab in and use the arrow keys. Tap a legend to focus one series. Bar, line, pie, radar, sankey and more."
      command={commands.npm}
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

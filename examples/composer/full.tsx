"use client";
import type { EffortLevel, ModelOption, SettingsEntry, SettingsValues } from "@kind-ui/agent-ui";
import type { DictationEvent, DictationSource } from "@kind-ui/agent-ui/core";
import { type ReactElement, useRef, useState } from "react";
import { AddMenu } from "@/components/ui/add-menu";
import { ApprovalMode } from "@/components/ui/approval-mode";
import { Composer, ComposerInput, ComposerSubmit } from "@/components/ui/composer";
import { ContextBar } from "@/components/ui/context-bar";
import { Dictation } from "@/components/ui/dictation";
import { ModelControl } from "@/components/ui/model-control";
import { SettingsMenu } from "@/components/ui/settings-menu";
import { AnthropicLogo, OpenAILogo } from "../model-selector/logos";

const addItems = [
  { id: "client", label: "Open file", description: "src/lib/client.ts" },
  { id: "tests", label: "Test folder", description: "src/__tests__" },
];

const additions: Record<string, { id: string; label: string; kind: string }> = {
  client: { id: "client", label: "src/lib/client.ts", kind: "file" },
  tests: { id: "tests", label: "src/__tests__", kind: "folder" },
};

const models: ModelOption<ReactElement>[] = [
  { id: "claude-sonnet-5.5", name: "Claude Sonnet 5.5", group: "Anthropic", icon: <AnthropicLogo /> },
  { id: "gpt-6.1-sol", name: "GPT-6.1 Sol", group: "OpenAI", icon: <OpenAILogo /> },
];

const levels: EffortLevel[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const modes = [
  { value: "ask", label: "Ask every time", description: "Approve each tool call" },
  { value: "edits", label: "Allow edits", description: "Edit files without asking" },
  { value: "full", label: "Full access", description: "Run anything without asking", danger: true },
];

const settings: SettingsEntry<ReactElement>[] = [
  { type: "toggle", id: "search", label: "Web search" },
  { type: "toggle", id: "memory", label: "Memory" },
];

const context = [
  { id: "layout", label: "src/app/layout.tsx", kind: "file" },
  { id: "auth", label: "Lines 12–40 of auth.ts", kind: "selection" },
  { id: "docs", label: "nextjs.org/docs/app/routing", kind: "url" },
];

const words = "Add a retry with backoff to the fetch client".split(" ");
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Plays back a recording instead of opening the microphone, so the example runs without a speech service.
const demoSource: DictationSource = {
  async *start(signal): AsyncGenerator<DictationEvent> {
    let heard = 0;
    for (let tick = 0; !signal.aborted; tick++) {
      const speaking = heard < words.length;
      yield { level: speaking ? 0.25 + 0.6 * Math.abs(Math.sin(tick * 1.7)) : 0.05 };
      if (speaking && tick % 5 === 4) {
        heard++;
        yield { text: words.slice(0, heard).join(" "), final: false };
      }
      await wait(80);
    }
    if (heard === 0 || signal.reason === "cancel") return;
    await wait(600);
    yield { text: words.slice(0, heard).join(" "), final: true };
  },
};

export default function FullComposerExample() {
  const [chips, setChips] = useState(context);
  const [model, setModel] = useState<string | null>("claude-sonnet-5.5");
  const [effort, setEffort] = useState("medium");
  const [mode, setMode] = useState("ask");
  const [values, setValues] = useState<SettingsValues>({ search: true, memory: false });
  const editor = useRef<HTMLDivElement>(null);

  return (
    <Composer aria-label="Message" onSubmit={() => new Promise<void>((resolve) => setTimeout(resolve, 1000))}>
      <ContextBar
        chips={chips}
        onRemove={(id) => setChips((current) => current.filter((chip) => chip.id !== id))}
        focusFallback={() => editor.current}
      />
      <ComposerInput ref={editor} aria-label="Prompt" placeholder="Ask anything" />
      <div className="flex min-w-0 flex-wrap items-center gap-1.5" style={{ gridArea: "attach" }}>
        <AddMenu
          items={addItems}
          onAction={(id) =>
            setChips((current) =>
              current.some((chip) => chip.id === id) ? current : [...current, additions[id]],
            )
          }
        />
        <ModelControl
          models={models}
          model={model}
          onModelChange={setModel}
          levels={levels}
          effort={effort}
          onEffortChange={setEffort}
        />
        <ApprovalMode modes={modes} value={mode} onValueChange={setMode} />
        <SettingsMenu settings={settings} values={values} onValuesChange={setValues} />
      </div>
      <Dictation source={demoSource} />
      <ComposerSubmit />
    </Composer>
  );
}

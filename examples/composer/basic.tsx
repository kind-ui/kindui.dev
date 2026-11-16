"use client";
import { useRef } from "react";
import {
  Composer,
  ComposerAttach,
  ComposerAttachments,
  ComposerInput,
  ComposerStop,
  ComposerSubmit,
  ComposerTriggerMenu,
} from "@/components/ui/composer";

const mentions = [
  { value: "src/client.ts", label: "client.ts", description: "src" },
  { value: "src/retry.ts", label: "retry.ts", description: "src" },
];

const commands = [
  { value: "explain", label: "explain", description: "Explain the selected code" },
  { value: "test", label: "test", description: "Write tests" },
];

export default function ComposerExample() {
  const finish = useRef<() => void>(undefined);
  const send = () =>
    new Promise<void>((resolve) => {
      finish.current = resolve;
      setTimeout(resolve, 3000);
    });

  return (
    <Composer
      aria-label="Message"
      mentions={mentions}
      commands={commands}
      onSubmit={send}
      onStop={() => finish.current?.()}
    >
      <ComposerAttachments />
      <ComposerInput aria-label="Prompt" placeholder="Ask anything. Type @ to mention, / for commands">
        <ComposerTriggerMenu />
      </ComposerInput>
      <ComposerAttach />
      <ComposerSubmit />
      <ComposerStop />
    </Composer>
  );
}

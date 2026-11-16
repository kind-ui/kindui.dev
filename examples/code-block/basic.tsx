"use client";
import { CodeBlock } from "@/components/ui/code-block";

const code = `async function retry<T>(run: () => Promise<T>, tries = 4): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (error) {
      if (attempt + 1 >= tries) throw error;
      await sleep(2 ** attempt * 250);
    }
  }
}`;

export default function CodeBlockExample() {
  return <CodeBlock aria-label="retry.ts" code={code} language="ts" lineNumbers />;
}

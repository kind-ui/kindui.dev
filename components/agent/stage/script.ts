import type { StepStatus } from "@kind-ui/agent-ui";

export const question = "The nightly billing export keeps failing. Can you fix it?";
export const attachment = { id: "log", name: "export-log.txt", size: 18_400, mediaType: "text/plain" };

export const answer = `Every failed run stopped after 30 seconds waiting on the reports service, which slowed from 4 to 41 seconds. I added a retry with backoff:

\`\`\`ts
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    return await fetchPage(cursor);
  } catch {
    await sleep(2 ** attempt * 250);
  }
}
\`\`\`

| Attempt | Wait |
| ------: | ---: |
| 1 | 500 ms |
| 2 | 1 s |
| 3 | 2 s |

The pull request also alerts when a run takes longer than an hour.
`;

const steps = [
  {
    id: "read",
    title: "Read export-log.txt",
    body: "Three runs timed out after 30 seconds.",
    start: 1400,
    end: 2300,
    meta: "1s",
  },
  {
    id: "find",
    title: "Find the slow call",
    body: "The reports service p50 went from 4 s to 41 s.",
    start: 2300,
    end: 3300,
    meta: "1s",
  },
  {
    id: "fix",
    title: "Add a retry with backoff",
    body: "Edited src/export.ts and its test.",
    start: 3300,
    end: 4300,
    meta: "1s",
  },
];

const thinkingFrom = 400;
const streamFrom = 4500;
const charsPerMs = 0.14;

export const scriptEnd = streamFrom + Math.ceil(answer.length / charsPerMs) + 300;

export type StageStep = { id: string; title: string; body: string; status: StepStatus; meta?: string };

export type Frame = {
  thinking: boolean;
  steps: StageStep[];
  text: string;
  streaming: boolean;
};

/** What the stage shows `t` milliseconds into the script. */
export function frameAt(t: number): Frame {
  const chars = Math.max(0, Math.floor((t - streamFrom) * charsPerMs));
  return {
    thinking: t >= thinkingFrom && t < (steps[0]?.start ?? 0),
    steps: steps
      .filter((step) => t >= step.start)
      .map(({ id, title, body, end, meta }) =>
        t >= end ? { id, title, body, status: "complete", meta } : { id, title, body, status: "running" },
      ),
    text: answer.slice(0, chars),
    streaming: t >= streamFrom && chars < answer.length,
  };
}

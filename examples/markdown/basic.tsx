"use client";
import { Markdown } from "@/components/ui/markdown";

const source = `### Retry with backoff

Wait a little longer after each failure, and give up after a few tries. Retry only **idempotent** requests.

\`\`\`ts
await sleep(2 ** attempt * 250);
\`\`\`

| Attempt | Delay |
| ------: | ----: |
| 1 | 250 ms |
| 2 | 500 ms |
| 3 | 1 s |

> Read the \`Retry-After\` header first when the server sends one.
`;

export default function MarkdownExample() {
  return <Markdown source={source} />;
}

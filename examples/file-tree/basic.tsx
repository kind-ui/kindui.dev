"use client";
import { FileTree } from "@/components/ui/file-tree";

const entries = [
  { path: "src/index.ts", change: "modified" as const, additions: 12, deletions: 3 },
  { path: "src/lib/format.ts", change: "added" as const, additions: 40 },
  { path: "src/lib/parse.ts" },
  { path: "src/routes/old.tsx", change: "deleted" as const, deletions: 18 },
  { path: "src/routes/home.tsx", change: "renamed" as const },
  { path: "package.json", change: "modified" as const, additions: 1, deletions: 1 },
  { path: "README.md" },
];

export default function FileTreeExample() {
  return <FileTree entries={entries} defaultExpanded={["src", "src/lib"]} className="w-full max-w-sm" />;
}

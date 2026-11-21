"use client";
import type { Thread } from "@kind-ui/agent-ui";
import { useState } from "react";
import { ThreadList } from "@/components/ui/thread-list";

const now = "2026-11-18T12:00:00Z";

const initialThreads: Thread[] = (
  [
    { id: "release", title: "Release checklist", updatedAt: "2026-11-10T09:00:00Z", pinned: true },
    { id: "style", title: "Style guide notes", updatedAt: "2026-10-02T15:00:00Z", pinned: true },
    { id: "login", title: "Fix the login redirect", updatedAt: "2026-11-18T10:30:00Z", status: "running" },
    { id: "launch", title: "Draft the launch post", updatedAt: "2026-11-18T08:00:00Z", unread: true },
    { id: "query", title: "Speed up the search query", updatedAt: "2026-11-18T07:15:00Z" },
    { id: "build", title: "Why the build is slow", updatedAt: "2026-11-17T16:00:00Z" },
    { id: "tests", title: "Flaky checkout tests", updatedAt: "2026-11-17T09:20:00Z" },
    { id: "offsite", title: "Plan the offsite", updatedAt: "2026-11-14T12:00:00Z" },
    { id: "pricing", title: "Compare pricing tiers", updatedAt: "2026-11-13T18:40:00Z" },
    { id: "onboarding", title: "Onboarding email copy", updatedAt: "2026-11-12T11:00:00Z" },
    { id: "schema", title: "Migrate the user schema", updatedAt: "2026-09-21T14:00:00Z" },
    { id: "retro", title: "Sprint retro summary", updatedAt: "2026-09-08T10:00:00Z" },
  ] satisfies Thread[]
).map((thread) => ({ ...thread, href: `#${thread.id}` }));

export default function ThreadListExample() {
  const [threads, setThreads] = useState(initialThreads);
  const [current, setCurrent] = useState("login");
  const update = (id: string, change: Partial<Thread>) =>
    setThreads((threads) => threads.map((thread) => (thread.id === id ? { ...thread, ...change } : thread)));

  return (
    <div style={{ height: 420, width: 280 }}>
      <ThreadList
        threads={threads}
        value={current}
        now={now}
        onSelect={(id, details) => {
          details.cancel();
          setCurrent(id);
          update(id, { unread: false });
        }}
        onNew={() => {
          const id = crypto.randomUUID();
          setThreads((threads) => [{ id, title: "New chat", updatedAt: now, href: `#${id}` }, ...threads]);
          setCurrent(id);
        }}
        onRename={(id, { title }) => update(id, { title })}
        onPinChange={(id, { pinned }) => update(id, { pinned })}
        onDelete={(id) => setThreads((threads) => threads.filter((thread) => thread.id !== id))}
      />
    </div>
  );
}

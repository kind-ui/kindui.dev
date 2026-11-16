"use client";
import type { UploadItem } from "@kind-ui/agent-ui/core";
import { useState } from "react";
import { Uploader } from "@/components/ui/uploader";

const uploads: UploadItem[] = [
  { id: "report", name: "quarterly-report.pdf", size: 2_400_000, progress: 42, status: "uploading" },
  { id: "photo", name: "team-offsite.jpg", size: 3_100_000, progress: 100, status: "done" },
  { id: "dataset", name: "training-set.csv", size: 48_000_000, progress: 63, status: "error" },
];

export default function UploaderExample() {
  const [items, setItems] = useState(uploads);
  const update = (id: string, change: Partial<UploadItem>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));

  return (
    <Uploader
      aria-label="Uploads"
      items={items}
      onFiles={(files) =>
        setItems((current) => [
          ...current,
          ...files.map((file) => ({
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            progress: 0,
            status: "queued" as const,
          })),
        ])
      }
      onCancel={(id) => update(id, { status: "cancelled" })}
      onRetry={(id) => update(id, { status: "uploading", progress: 0 })}
    />
  );
}

"use client";
import { useState } from "react";
import { Attachments } from "@/components/ui/attachments";

const files = [
  { id: "spec", name: "retry-spec.pdf", size: 482_000, mediaType: "application/pdf" },
  { id: "notes", name: "notes.md", size: 812, mediaType: "text/markdown" },
  { id: "dump", name: "heap.zip", size: 92_000_000, mediaType: "application/zip", error: "size" as const },
];

export default function AttachmentsExample() {
  const [items, setItems] = useState(files);

  return (
    <Attachments
      aria-label="Attachments"
      items={items}
      onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
    />
  );
}

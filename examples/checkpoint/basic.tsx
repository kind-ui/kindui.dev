"use client";
import { useState } from "react";
import { Checkpoint } from "@/components/ui/checkpoint";

export default function CheckpointExample() {
  const [restored, setRestored] = useState(false);
  return (
    <Checkpoint
      className="w-full max-w-md"
      description="Before editing auth.ts"
      restored={restored}
      onRestore={() => new Promise<void>((resolve) => setTimeout(resolve, 800)).then(() => setRestored(true))}
    />
  );
}

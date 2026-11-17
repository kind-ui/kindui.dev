"use client";
import { RotateCw } from "lucide-react";
import { ErrorPage, primaryButton } from "./error-page";

export function BrokenPage({ retry }: { retry: () => void }) {
  return (
    <ErrorPage
      lead="Something"
      excuses={{ broke: "💥", tripped: "🍌", "went sideways": "🦀", "fell over": "🙃" }}
      description="Not your fault. Try again, or head somewhere that works."
      action={
        <button type="button" onClick={retry} className={primaryButton}>
          <RotateCw size={14} className="transition-transform group-hover:rotate-45" />
          Try again
        </button>
      }
    />
  );
}

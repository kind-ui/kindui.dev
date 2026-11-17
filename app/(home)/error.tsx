"use client";
import { BrokenPage } from "@/components/broken-page";

export default function HomeError({ retry }: { error: unknown; retry: () => void }) {
  return <BrokenPage retry={retry} />;
}

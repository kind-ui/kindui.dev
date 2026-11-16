"use client";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { getSection } from "@/lib/sections";

export function SectionBody({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug?: string[] }>();

  return (
    <body className={`${getSection(slug?.[0]) ?? ""} relative flex min-h-screen flex-col`}>{children}</body>
  );
}

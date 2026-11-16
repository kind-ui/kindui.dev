export const sections = ["agent-ui", "charts"] as const;

export type Section = (typeof sections)[number];

/** The library a docs path belongs to, from its first segment; the overview has none. */
export function getSection(path: string | undefined): Section | undefined {
  const [dir] = path?.split("/", 1) ?? [];
  return sections.find((section) => section === dir);
}

import { createGetUrl } from "fumadocs-core/source";

export const appName = "Kind UI";
export const origin = "https://kindui.dev";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

export const gitConfig = {
  user: "kind-ui",
  repo: "kindui.dev",
  branch: "main",
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];

  return { segments, url: getImageUrl(segments, page.locale) };
}

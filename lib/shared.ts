import { createGetUrl } from "fumadocs-core/source";
import libraries from "@/libraries.json";

export const appName = "Kind UI";
export const origin = "https://kindui.dev";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

export const gitConfig = {
  user: "kind-ui",
  repo: "kindui.dev",
  branch: "main",
};

/** Where a page's source lives: this repo, or a library's docs app at its pinned release. */
export function sourceUrl(type: string, path: string) {
  const library = libraries[type as keyof typeof libraries];
  if (!library)
    return `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`;
  const tag = library.tag.replace("{version}", library.version);
  return `https://github.com/${library.repo}/blob/${tag}/${library.docs}/content/docs/${path.slice(type.length + 1)}`;
}

/** The library a page belongs to, for its title; the overview's pages have none. */
export function libraryTitle(type: string) {
  return libraries[type as keyof typeof libraries]?.title;
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];

  return { segments, url: getImageUrl(segments, page.locale) };
}

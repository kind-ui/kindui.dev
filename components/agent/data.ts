export const links = {
  charts: "/docs/charts",
  home: "/",
  org: "https://github.com/kind-ui",
  repo: "https://github.com/kind-ui/agent-ui",
  license: "https://github.com/kind-ui/agent-ui/blob/main/LICENSE",
  uiSdk: "https://ui-sdk.dev",
};

export const frameworks = ["React", "Vue", "Svelte", "Solid"] as const;

export const agents = ["Codex", "Claude", "Gemini", "Copilot", "Cursor", "your agents"] as const;

export const addCommand = "npx shadcn@latest add @kind-ui/conversation";

export const docsHref = (slug: string) => `/docs/agent-ui/components/${slug}`;

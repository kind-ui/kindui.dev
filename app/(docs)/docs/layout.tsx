import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import { DocsLayout } from "fumadocs-ui/layouts/spacious";
import type { CSSProperties } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { getSection } from "@/lib/sections";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = source.getPageTree();
  const tabs = getLayoutTabs(tree, {
    transform(option, node) {
      const meta = source.getNodeMeta(node);
      const section = getSection(meta?.path);
      if (!section || !node.icon) return option;

      return {
        ...option,
        icon: (
          <div
            className="text-(--tab-color)"
            style={{ "--tab-color": `var(--${section}-color)` } as CSSProperties}
          >
            {node.icon}
          </div>
        ),
      };
    },
  });

  return (
    <DocsLayout {...baseOptions()} tree={tree} tabs={tabs}>
      {children}
    </DocsLayout>
  );
}

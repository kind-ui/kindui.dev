import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Wordmark } from "@/components/wordmark";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span className="font-[Apple_Color_Emoji,Segoe_UI_Emoji,Noto_Color_Emoji,sans-serif]" aria-hidden>
            🌸
          </span>
          <Wordmark className="text-xl" />
        </>
      ),
    },
    githubUrl: "https://github.com/kind-ui",
  };
}

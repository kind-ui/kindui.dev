import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import logo from "@/public/cherry-blossom.png";
import { appName } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src={logo} alt="" className="size-5" />
          <span className="font-medium">{appName}</span>
        </>
      ),
    },
    githubUrl: "https://github.com/kind-ui",
  };
}

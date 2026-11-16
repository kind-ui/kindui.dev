import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  // Writes `docs/index.html`, so a static host serves each page at the path it was rendered for.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Agent UI's render files import `./name.js` for `name.tsx`, which Turbopack doesn't map, so build with webpack.
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = { ".js": [".ts", ".tsx", ".js"] };
    return webpackConfig;
  },
};

export default withMDX(config);

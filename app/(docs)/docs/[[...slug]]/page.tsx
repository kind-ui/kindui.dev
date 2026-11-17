import Link from "fumadocs-core/link";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/spacious/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { getMDXComponents } from "@/components/mdx";
import { getPageImageUrl, libraryTitle, sourceUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `/llms.mdx${page.url}.md`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={encodeURI(sourceUrl(page.type, page.path))}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page, FileLink),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

// A file like `/llms.txt` isn't a route, so the client router would 404 on it; load it with a plain link.
function FileLink(props: ComponentProps<typeof Link>) {
  if (/\.(txt|md|json)$/.test(props.href ?? "")) return <a {...props} />;
  return <Link {...props} />;
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    // The overview's title is the site name, so it skips the root layout's `%s | Kind UI` template;
    // a library's pages name the library, since each has its own "Get Started".
    title:
      page.slugs.length === 0
        ? { absolute: page.data.title }
        : { absolute: `${page.data.title} | ${libraryTitle(page.type) ?? "Kind UI"}` },
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": `/llms.mdx${page.url}.md` },
    },
    openGraph: {
      url: page.url,
      images: getPageImageUrl(page).url,
    },
  };
}

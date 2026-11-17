"use client";
import { Sources } from "@/components/ui/sources";

const sources = [
  {
    id: "rate-limits",
    title: "Rate limits for the REST API",
    url: "https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api",
    snippet: "Primary rate limits cap how many requests you can make in an hour.",
  },
  {
    id: "retry-after",
    title: "Retry-After header",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After",
    favicon: "https://developer.mozilla.org/favicon-48x48.png",
    snippet: "How long to wait before making the next request.",
  },
  {
    id: "rfc",
    title: "RFC 9110: HTTP Semantics",
    url: "https://www.rfc-editor.org/rfc/rfc9110",
  },
];

export default function SourcesExample() {
  return <Sources sources={sources} className="w-full max-w-md" />;
}

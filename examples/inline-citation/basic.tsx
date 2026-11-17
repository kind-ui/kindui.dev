"use client";
import { InlineCitation } from "@/components/ui/inline-citation";
import { Message, MessageContent } from "@/components/ui/message";

const limits = [
  {
    id: "rate-limits",
    title: "Rate limits for the REST API",
    url: "https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api",
    snippet: "Primary rate limits cap how many requests you can make in an hour.",
  },
  {
    id: "best-practices",
    title: "Best practices for using the REST API",
    url: "https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api",
    snippet: "Wait at least one minute before retrying when you hit a secondary rate limit.",
  },
];

const retryAfter = [
  {
    id: "retry-after",
    title: "Retry-After header",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After",
    snippet: "How long the user agent should wait before making a follow-up request.",
  },
];

export default function InlineCitationExample() {
  return (
    <Message aria-label="Assistant message" messageRole="assistant" className="w-full max-w-xl">
      <MessageContent>
        <p>
          The API allows 5,000 requests an hour for a signed-in user{" "}
          <InlineCitation sources={limits} label="1" />. When you hit the limit, wait as long as the{" "}
          <code>Retry-After</code> header says before trying again{" "}
          <InlineCitation sources={retryAfter} label="2" />.
        </p>
      </MessageContent>
    </Message>
  );
}

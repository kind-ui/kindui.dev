"use client";
import type { CSSProperties } from "react";
import { MarkdownTable } from "@/components/ui/markdown-table";

const rows = [
  { region: "us-east-1", requests: "18,204,113", errors: "1,204", p99: "380 ms" },
  { region: "eu-west-1", requests: "9,881,402", errors: "312", p99: "295 ms" },
  { region: "ap-south-1", requests: "4,117,950", errors: "2,871", p99: "1.2 s" },
];

export default function MarkdownTableExample() {
  return (
    <MarkdownTable
      aria-label="Latency by region"
      style={{ "--kind-markdown-table-columns": 4 } as CSSProperties}
    >
      <thead>
        <tr>
          <th>Region</th>
          <th data-align="right">Requests</th>
          <th data-align="right">Errors</th>
          <th data-align="right">p99</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.region}>
            <td>{row.region}</td>
            <td data-align="right">{row.requests}</td>
            <td data-align="right">{row.errors}</td>
            <td data-align="right">{row.p99}</td>
          </tr>
        ))}
      </tbody>
    </MarkdownTable>
  );
}

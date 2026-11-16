import {
  type Highlight,
  type MarkdownBlock,
  type MdNode,
  markdownViewPrimitive,
} from "@kind-ui/agent-ui/core";
import { createParts } from "@ui-sdk/react/primitive";
import { type ComponentProps, type CSSProperties, memo, type ReactNode } from "react";
import { CodeBlock } from "./code-block.js";
import { MarkdownTable } from "./markdown-table.js";

const parts = createParts(markdownViewPrimitive, { root: "div" });

type Context = { highlight: Highlight | undefined; streaming: boolean };
type Row = { children: MdNode[] };
type Align = Extract<MdNode, { type: "table" }>["align"];

// Nodes have no identity but their place in a parsed block, so they're keyed by index.
const children = (node: { children: MdNode[] }, context: Context): ReactNode[] =>
  node.children.map((child, index) => render(child, index, context));

const row = (node: Row, align: Align, Cell: "th" | "td", key: number) => (
  <tr key={key}>
    {node.children.map((cell, index) => (
      <Cell key={index} data-align={align[index] ?? undefined}>
        {cell.type === "tableCell" ? children(cell, { highlight: undefined, streaming: false }) : null}
      </Cell>
    ))}
  </tr>
);

function render(node: MdNode, key: number, context: Context): ReactNode {
  switch (node.type) {
    case "text":
      return node.value;
    case "paragraph":
      return <p key={key}>{children(node, context)}</p>;
    case "heading": {
      const Heading = `h${node.depth}` as const;
      return <Heading key={key}>{children(node, context)}</Heading>;
    }
    case "emphasis":
      return <em key={key}>{children(node, context)}</em>;
    case "strong":
      return <strong key={key}>{children(node, context)}</strong>;
    case "delete":
      return <del key={key}>{children(node, context)}</del>;
    case "blockquote":
      return <blockquote key={key}>{children(node, context)}</blockquote>;
    case "inlineCode":
      return <code key={key}>{node.value}</code>;
    case "code":
      return (
        <CodeBlock
          key={key}
          aria-label="Code"
          code={node.value}
          language={node.lang}
          highlight={context.highlight}
          streaming={context.streaming}
        />
      );
    case "link":
      return node.url === null ? (
        <span key={key}>{children(node, context)}</span>
      ) : (
        <a key={key} href={node.url}>
          {children(node, context)}
        </a>
      );
    case "image":
      return node.url === null ? (
        <span key={key}>{node.alt}</span>
      ) : (
        <img key={key} src={node.url} alt={node.alt} />
      );
    case "list":
      return node.ordered ? (
        <ol key={key} start={node.start}>
          {children(node, context)}
        </ol>
      ) : (
        <ul key={key}>{children(node, context)}</ul>
      );
    case "listItem":
      return (
        <li key={key} data-task={node.checked === undefined ? undefined : ""}>
          {node.checked === undefined ? null : (
            <input type="checkbox" checked={node.checked} disabled readOnly />
          )}
          {children(node, context)}
        </li>
      );
    case "table": {
      const [head, ...body] = node.children as Row[];
      return (
        <MarkdownTable
          key={key}
          aria-label="Table"
          style={{ "--kind-markdown-table-columns": node.align.length } as CSSProperties}
        >
          <thead>{head && row(head, node.align, "th", 0)}</thead>
          <tbody>{body.map((bodyRow, index) => row(bodyRow, node.align, "td", index))}</tbody>
        </MarkdownTable>
      );
    }
    case "thematicBreak":
      return <hr key={key} />;
    case "break":
      return <br key={key} />;
    default:
      return null;
  }
}

// A final block is the same object on every append, so it never renders again. Code blocks read `highlight`
// when they ask for tokens, so a new function each render doesn't render them again either.
const Block = memo(
  function Block({ block, ...context }: { block: MarkdownBlock } & Context) {
    return <div data-block-key={block.key}>{children(block.node as { children: MdNode[] }, context)}</div>;
  },
  (before, after) => before.block === after.block && before.streaming === after.streaming,
);

export type MarkdownProps = Omit<ComponentProps<typeof parts.Root>, "children">;

/** Renders `source` as it streams in, with code blocks and tables. */
export function Markdown(props: MarkdownProps) {
  return (
    <parts.Root {...props}>
      {({ blocks, highlight, streaming }) =>
        blocks.map((block, index) => (
          // Keyed by place, not `block.key`, which changes with the streaming tail's text, so the tail updates in place.
          <Block key={index} block={block} highlight={highlight} streaming={streaming && !block.final} />
        ))
      }
    </parts.Root>
  );
}

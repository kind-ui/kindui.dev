import type { Root } from "mdast";
type Parent<T extends string> = {
    type: T;
    children: MdNode[];
};
export type MdNode = Parent<"root" | "paragraph" | "emphasis" | "strong" | "delete" | "blockquote" | "tableRow" | "tableCell"> | (Parent<"heading"> & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
}) | {
    type: "text" | "inlineCode";
    value: string;
} | {
    type: "code";
    lang?: string;
    value: string;
} | (Parent<"link"> & {
    url: string | null;
}) | {
    type: "image";
    url: string | null;
    alt: string;
} | (Parent<"list"> & {
    ordered: boolean;
    start?: number;
}) | (Parent<"listItem"> & {
    checked?: boolean;
}) | (Parent<"table"> & {
    align: ("left" | "right" | "center" | null)[];
}) | {
    type: "thematicBreak" | "break";
};
export declare function toMdNode(tree: Root): MdNode;
export {};
//# sourceMappingURL=ast.d.ts.map
import { type MdNode } from "./ast.js";
export interface MarkdownBlock {
    key: string;
    final: boolean;
    node: MdNode;
}
export interface MarkdownEngine {
    set(source: string, streaming: boolean): MarkdownBlock[];
    stats(): {
        parses: number;
    };
}
export declare function createMarkdownEngine(): MarkdownEngine;
//# sourceMappingURL=engine.d.ts.map
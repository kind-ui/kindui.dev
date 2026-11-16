import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { gfm } from "micromark-extension-gfm";
import remend from "remend";
import { toMdNode } from "./ast.js";
import { countFinalBlocks, splitBlocks } from "./split.js";
function fnv1a32hex(value) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
}
export function createMarkdownEngine() {
    let parses = 0;
    let split;
    let nodes = new Map();
    let blocks = [];
    return {
        set(source, streaming) {
            const previousSources = split?.blocks ?? [];
            split = splitBlocks(source, split);
            const sources = split.blocks;
            const finalCount = streaming ? countFinalBlocks(sources) : sources.length;
            const next = new Map();
            blocks = sources.map((block, index) => {
                const final = index < finalCount;
                const previous = blocks[index];
                if (final && previous?.final && previousSources[index] === block)
                    return previous;
                const key = `${index}:${fnv1a32hex(block)}`;
                // Trailing blank lines don't change a block's tree, so a block that just ended is not parsed again.
                const trimmed = block.replace(/\n+$/, "");
                // remend never touches final blocks (spec §6).
                const text = streaming && index === sources.length - 1
                    ? remend(trimmed, { katex: false, linkMode: "text-only" })
                    : trimmed;
                let node = nodes.get(text) ?? next.get(text);
                if (!node) {
                    parses += 1;
                    node = toMdNode(fromMarkdown(text, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] }));
                }
                next.set(text, node);
                return previous?.key === key && previous.final === final && previous.node === node
                    ? previous
                    : { key, final, node };
            });
            nodes = next;
            return blocks;
        },
        stats: () => ({ parses }),
    };
}
//# sourceMappingURL=engine.js.map
// Adapted from Apache-2.0 code; see THIRD_PARTY_NOTICES.md. No HTML or math merging:
// raw HTML renders as text and math is not supported.
import { Lexer, Tokenizer } from "marked";
const footnoteDefinition = /^ {0,3}\[\^[^\]\s]+\]:/;
// marked has no footnotes and would take `[^x]: word` as a link definition, dropping its text.
// micromark (gfm) never does, so leave it to the paragraph rule.
class FootnoteTokenizer extends Tokenizer {
    def(src) {
        return footnoteDefinition.test(src) ? undefined : super.def(src);
    }
}
// Returns null when the document has link definitions, which must share one parse with their references.
// The lexer records only definitions outside code. Footnote definitions split like other blocks,
// keeping their indented continuation, which marked lexes as indented code.
function lexBlocks(markdown) {
    const lexer = new Lexer({ gfm: true, tokenizer: new FootnoteTokenizer() });
    const tokens = lexer.blockTokens(markdown);
    if (Object.keys(lexer.tokens.links).length > 0)
        return null;
    const blocks = [];
    for (const token of tokens) {
        const last = blocks.length - 1;
        const continues = token.type === "space" ||
            (token.type === "code" &&
                token.codeBlockStyle === "indented" &&
                footnoteDefinition.test(blocks[last] ?? ""));
        if (continues && last >= 0)
            blocks[last] += token.raw;
        else
            blocks.push(token.raw);
    }
    return blocks;
}
// Appended text can still change the last two blocks: a lone "#" ends the paragraph above it, "2." extends a list.
export function countFinalBlocks(blocks) {
    for (let i = blocks.length - 3; i >= 0; i -= 1) {
        if (blocks[i]?.endsWith("\n\n"))
            return i + 1;
    }
    return 0;
}
function reuse(previous, input) {
    if (input.length <= previous.input.length || !input.startsWith(previous.input))
        return null;
    const finalCount = countFinalBlocks(previous.blocks);
    if (finalCount === 0)
        return null;
    let { verifiedCount, verifiedLength } = previous;
    // A setext underline can pull blocks together, so the final region may have shrunk.
    if (verifiedCount > finalCount) {
        verifiedCount = 0;
        verifiedLength = 0;
    }
    // marked trims some raws (a bare "- " lexes to "-\n"), so check offsets before trusting them.
    while (verifiedCount < finalCount) {
        const block = previous.blocks[verifiedCount];
        if (block === undefined || !input.startsWith(block, verifiedLength))
            return null;
        verifiedLength += block.length;
        verifiedCount += 1;
    }
    const tail = lexBlocks(input.slice(verifiedLength));
    if (!tail)
        return null;
    return { input, blocks: previous.blocks.slice(0, finalCount).concat(tail), verifiedCount, verifiedLength };
}
export function splitBlocks(source, previous) {
    const input = source.replace(/\r\n?/g, "\n");
    if (previous?.input === input)
        return previous;
    const reused = previous ? reuse(previous, input) : null;
    if (reused)
        return reused;
    const blocks = lexBlocks(input) ?? (input ? [input] : []);
    return { input, blocks, verifiedCount: 0, verifiedLength: 0 };
}
//# sourceMappingURL=split.js.map
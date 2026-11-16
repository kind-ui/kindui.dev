import { definitions } from "mdast-util-definitions";
import { sanitizeUri } from "micromark-util-sanitize-uri";
const safeProtocol = /^(https?|mailto)$/i;
// micromark's own check: relative URLs pass, any other scheme must be allowed. Unsafe URLs render as their label.
function sanitizeUrl(url) {
    return sanitizeUri(url, safeProtocol) === "" ? null : url;
}
export function toMdNode(tree) {
    const define = definitions(tree);
    const children = (node) => node.children.flatMap(convert);
    function convert(node) {
        switch (node.type) {
            case "paragraph":
            case "emphasis":
            case "strong":
            case "delete":
            case "blockquote":
            case "tableRow":
            case "tableCell":
                return [{ type: node.type, children: children(node) }];
            case "heading":
                return [{ type: "heading", depth: node.depth, children: children(node) }];
            case "text":
            case "inlineCode":
                return [{ type: node.type, value: node.value }];
            case "html":
                return [{ type: "text", value: node.value }];
            case "code":
                return [
                    node.lang
                        ? { type: "code", lang: node.lang, value: node.value }
                        : { type: "code", value: node.value },
                ];
            case "link":
                return [{ type: "link", url: sanitizeUrl(node.url), children: children(node) }];
            case "linkReference":
                return [
                    { type: "link", url: sanitizeUrl(define(node.identifier)?.url ?? ""), children: children(node) },
                ];
            case "image":
                return [{ type: "image", url: sanitizeUrl(node.url), alt: node.alt ?? "" }];
            case "imageReference":
                return [{ type: "image", url: sanitizeUrl(define(node.identifier)?.url ?? ""), alt: node.alt ?? "" }];
            case "list":
                return [
                    node.ordered && typeof node.start === "number"
                        ? { type: "list", ordered: true, start: node.start, children: children(node) }
                        : { type: "list", ordered: node.ordered === true, children: children(node) },
                ];
            case "listItem":
                return [
                    typeof node.checked === "boolean"
                        ? { type: "listItem", checked: node.checked, children: children(node) }
                        : { type: "listItem", children: children(node) },
                ];
            case "table":
                return [{ type: "table", align: node.align ?? [], children: children(node) }];
            case "thematicBreak":
            case "break":
                return [{ type: node.type }];
            case "footnoteReference":
                return [{ type: "text", value: `[^${node.label ?? node.identifier}]` }];
            case "footnoteDefinition":
                return children(node);
            default:
                return [];
        }
    }
    return { type: "root", children: children(tree) };
}
//# sourceMappingURL=ast.js.map
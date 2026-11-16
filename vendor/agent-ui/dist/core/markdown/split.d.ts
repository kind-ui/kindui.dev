export interface Split {
    input: string;
    blocks: string[];
    verifiedCount: number;
    verifiedLength: number;
}
export declare function countFinalBlocks(blocks: string[]): number;
export declare function splitBlocks(source: string, previous?: Split): Split;
//# sourceMappingURL=split.d.ts.map
export interface Source {
    id: string;
    title: string;
    url?: string;
    snippet?: string;
    mediaType?: string;
}
export interface TaskItem {
    id: string;
    title: string;
    status: "pending" | "running" | "complete" | "error";
    files?: string[];
}
export interface PlanItem {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "running" | "complete" | "skipped";
}
export interface TestCase {
    id: string;
    name: string;
    status: "pass" | "fail" | "skip";
    durationMs?: number;
    error?: {
        message: string;
        stack?: string;
    };
}
export interface TestSuite {
    id: string;
    name: string;
    tests: TestCase[];
}
//# sourceMappingURL=records.d.ts.map
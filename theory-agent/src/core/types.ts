export type Domain = "tactical" | "strength";

export type Category = {
    id: string;
    domain: Domain;
    name: string;
    createdAt: number;
    updatedAt: number;
};

export type RuleChunk = {
    id: string;
    domain: Domain;
    categoryId: string;
    title: string;
    body: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
};

export type Citation = {
    ruleId: string;
    title: string;
    snippet: string;
};

export type PanelRun = {
    id: string;
    domain: Domain;
    question: string;
    answer: string;
    citations: Citation[];
    createdAt: number;
    latencyMs: number;
};
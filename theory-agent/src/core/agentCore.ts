import type { Citation, Domain, PanelRun, RuleChunk } from "./types";
import { retrieveTopRules } from "./retriever";

function makeId(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function summarizeFromRules(question: string, rules: RuleChunk[]) {
    if (rules.length === 0) {
        return `Question: ${question}\n\nI do not have enough rules saved for this domain yet. Add more rules, then try again.`
    }

    const top = rules.slice(0,3);
    const matchedTitles = top.map((r) => r.title).join(" ");

    const bullets = top
        .map((r) => `• ${r.title}: ${r.body.slice(0, 140)}...`)
        .join("\n");

    return `Question: ${question}\nMatched rules: ${matchedTitles}\n\n${bullets}\n\nNext step: add an example for this question so the agent can answer more specifically.`;

}

function citationsFromRules(rules: RuleChunk[]): Citation[] {
    return rules.slice(0, 5).map((r) => ({
        ruleId: r.id,
        title: r.title,
        snippet: r.body.slice(0,160),
    }));
}

export async function runDomainAnswer(args: {
    domain: Domain;
    question: string;
    rules: RuleChunk[];
}): Promise<PanelRun> {
    const start = performance.now();
    const topRules = retrieveTopRules(args.rules, args.domain, args.question, 5);

    const answer = summarizeFromRules(args.question, topRules);
    const citations = citationsFromRules(topRules);

    const end = performance.now();

    return {
        id: makeId("run"),
        domain: args.domain,
        question: args.question,
        answer,
        citations,
        createdAt: Date.now(),
        latencyMs: Math.round(end - start),
    };
}

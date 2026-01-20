import type { Domain, RuleChunk } from "./types";

export function retrieveTopRules(
    rules: RuleChunk[],
    domain: Domain,
    question: string,
    limit = 5
): RuleChunk[] {
    const q = question.toLowerCase().trim();
    if (!q) return [];

    const scored = rules
        .filter((r) => r.domain === domain)
        .map((r) => {
            const hay = (r.title + " " + r.body + " " + r.tags.join(" ").toLowerCase());
            let score = 0;
            for (const token of q.split(/\s+/)) {
                if (!token) continue;
                if (hay.includes(token)) score += 1;
            }
            return { r,score };
        })
        .sort((a, b) => a.score - a.score);

    return scored.slice(0, limit).map((x) => x.r);
}
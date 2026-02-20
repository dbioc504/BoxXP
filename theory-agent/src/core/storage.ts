import type { Category, Domain, RuleChunk } from "./types.ts";
import * as tty from "node:tty";

const KEYS = {
    rules: "theoryAgent.rules",
    categories: "theoryAgent.categories",
    schemaVersion: "theoryAgent.schemaVersion",
} as const;

const SCHEMA_VERSION = 1;

type AppState = {
    rules: RuleChunk[];
    categories: Category[];
};

function now() {
    return Date.now();
}

function makeId(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function safeParse<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function createCategory(domain: Domain, name: string): Category {
    const ts = now();
    return {
        id: makeId("cat"),
        domain,
        name,
        createdAt: ts,
        updatedAt: ts,
    };
}

function defaultCategories(): Category[] {
    return [
        // Tactical
        createCategory("tactical", "Offense"),
        createCategory("tactical", "Defense"),
        createCategory("tactical", "Footwork"),
        createCategory("tactical", "Time and Space"),
        createCategory("tactical", "Uncategorized"),

        // Strength
        createCategory("strength", "Conditioning"),
        createCategory("strength", "Strengths"),
        createCategory("strength", "Mobility"),
        createCategory("strength", "Recovery"),
        createCategory("strength", "Uncategorized"),
    ];
}

function findCategoryIdByName(
    categories: Category[],
    domain: Domain,
    name: string
): string | undefined {
    return categories.find(
        (c) => c.domain === domain && c.name.toLowerCase() === name.toLowerCase()
    )?.id;
}

function uncategorizedId(categories: Category[], domain: Domain): string {
    const found = findCategoryIdByName(categories, domain, "Uncategorized");
    if (found) return found;

    const created = createCategory(domain, "Uncategorized");
    categories.push(created);
    return created.id;
}

function migrateRules(
    rawRules: unknown[],
    categories: Category[]
): RuleChunk[] {
    return rawRules
        .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
        .map((r) => {
            const domain = (r.domain === "strength" ? "strength" : "tactical") as Domain;
            const createdAt =
                typeof r.createdAt === "number" ? r.createdAt : now();
            const updatedAt =
                typeof r.updatedAt === "number" ? r.updatedAt : createdAt;

            const existingCategoryId =
                typeof r.categoryId === "string" ? r.categoryId : undefined;

            let categoryId = existingCategoryId;

            if (!categoryId) {
                if (domain === "tactical") {
                    categoryId =
                        findCategoryIdByName(categories, "tactical", "Offense") ??
                        uncategorizedId(categories, "tactical");
                } else {
                    categoryId =
                        findCategoryIdByName(categories, "strength", "Conditioning") ??
                        uncategorizedId(categories, "strength");
                }
            }

            return {
                id: typeof r.id === "string" ? r.id : makeId("rule"),
                domain,
                categoryId,
                title: typeof r.title === "string" ? r.title : "Untitled rule",
                body: typeof r.body === "string" ? r.body : "",
                tags: Array.isArray(r.tags)
                    ? r.tags.filter((t): t is string => typeof t === "string")
                    : [],
                createdAt,
                updatedAt,
            };
        })
        .filter((r) => r.body.trim().length > 0 || r.title.trim().length > 0);
}

export function loadAppState(): AppState {
    const savedCategories = safeParse<Category[]>(
        localStorage.getItem(KEYS.categories),
        []
    );

    const categories =
        savedCategories.length > 0 ? savedCategories : defaultCategories();

    const rawRules = safeParse<unknown[]>(localStorage.getItem(KEYS.rules), []);
    const rules = migrateRules(rawRules, categories);

    // Persist migrated/seeded data immediately so future loads are clean
    saveAppState({ rules, categories });

    return { rules, categories };
}

export function saveAppState(state: AppState): void {
    localStorage.setItem(KEYS.rules, JSON.stringify(state.rules));
    localStorage.setItem(KEYS.categories, JSON.stringify(state.categories));
    localStorage.setItem(KEYS.schemaVersion, String(SCHEMA_VERSION));
}

export function getUncategorizedCategoryId(
    categories: Category[],
    domain: Domain
): string {
    return uncategorizedId(categories, domain);
}

export function createRule(input: {
    domain: Domain;
    categoryId: string;
    title: string;
    body: string;
    tags?: string[];
}): RuleChunk {
    const ts = now();
    return {
        id: makeId("rule"),
        domain: input.domain,
        categoryId: input.categoryId,
        title: input.title.trim(),
        body: input.body.trim(),
        tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
        createdAt: ts,
        updatedAt: ts,
    };
}

export function createNewCategory(domain: Domain, name: string): Category {
    return createCategory(domain, name.trim());
}


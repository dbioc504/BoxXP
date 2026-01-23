import { useEffect, useMemo, useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { DomainPanel } from "../components/DomainPanel";
import { ChatComposer } from "../components/ChatComposer";
import { RuleModal } from "../components/RuleModal";
import type { PanelRun, RuleChunk } from "../core/types";
import { runDomainAnswer } from "../core/agentCore";

function loadRules(): RuleChunk[] {
    try {
        const raw = localStorage.getItem("theoryAgent.rules");
        if (!raw) return [];
        return JSON.parse(raw) as RuleChunk[];
    } catch {
        return [];
    }
}

function saveRules(rules: RuleChunk[]) {
    localStorage.setItem("theoryAgent.rules", JSON.stringify(rules));
}

export function TheoryAgentPage() {
    const [tacticalRun, setTacticalRun] = useState<PanelRun | null>(null);
    const [strengthRun, setStrengthRun] = useState<PanelRun | null>(null);

    const [rules, setRules] = useState<RuleChunk[]>(() => {
        const existing = loadRules();
        if (existing.length > 0) return existing;

        return [
            {
                id: "r1",
                domain: "tactical",
                title: "Win the lead hand battle",
                body: "Fight for outside foot control, whenever inside fill the gaps with responsible jabs low-high",
                tags: ["jab", "range", "open stance"],
                createdAt: Date.now(),
            },
            {
                id: "r2",
                domain: "strength",
                title: "Conditioning supports technique",
                body:
                    "Any boxer 18+ is required to be able to perform a 2 mile run, 20+ minutes of jumproping, and 15 minutes of shuffling before learning a lick of technique.",
                tags: ["conditioning", "aerobic", "anaerobic"],
                createdAt: Date.now(),
            },
        ];
    });

    useEffect(() => {
        saveRules(rules);
    }, [rules]);

    const tacticalTags = useMemo(
        () => rules.filter((r) => r.domain === "tactical").flatMap((r) => r.tags),
        [rules],
    );

    const strengthTags = useMemo(
        () => rules.filter((r) => r.domain === "strength").flatMap((r) => r.tags),
        [rules],
    );

    const [showTacModal, setShowTacModal] = useState(false);
    const [showStrModal, setShowStrModal] = useState(false);

    function addRule(rule: RuleChunk) {
        setRules((prev) => [rule, ...prev]);
    }

    async function handleSubmit(question: string) {
        try {
            const [tac, str] = await Promise.all([
                runDomainAnswer({ domain: "tactical", question, rules }),
                runDomainAnswer({ domain: "strength", question, rules }),
            ]);

            setTacticalRun(tac);
            setStrengthRun(str);
        } catch (err) {
            console.error("Agent run failed:", err);
            setTacticalRun({
                id: "error_tac",
                domain: "tactical",
                question,
                answer: "Something went wrong generating tactical answer. Check console.",
                citations: [],
                createdAt: Date.now(),
                latencyMs: 0,
            });
            setStrengthRun({
                id: "error_str",
                domain: "strength",
                question,
                answer: "Something went wrong generating strength answer. Check console.",
                citations: [],
                createdAt: Date.now(),
                latencyMs: 0,
            });
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: 24,
                background: "radial-gradient(circle at top, rgba(35,35,55,0.9), rgba(10,10,15,1))",
            }}
        >
            <HeaderBar />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                    alignItems: "stretch",
                }}
            >
                <DomainPanel title="TACTICAL" run={tacticalRun}>
                    <button
                        onClick={() => setShowTacModal(true)}
                        style={{
                            position: "absolute",
                            left: 16,
                            bottom: 16,
                            borderRadius: 12,
                            padding: "8px 12px",
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(0,0,0,0.25)",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        Save Rule
                    </button>

                    {showTacModal && (
                        <RuleModal
                            domain="tactical"
                            existingTags={tacticalTags}
                            onSave={addRule}
                            onClose={() => setShowTacModal(false)}
                        />
                    )}
                </DomainPanel>

                <DomainPanel title="STRENGTH AND CONDITIONING" run={strengthRun}>
                    <button
                        onClick={() => setShowStrModal(true)}
                        style={{
                            position: "absolute",
                            left: 16,
                            bottom: 16,
                            borderRadius: 12,
                            padding: "8px 12px",
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(0,0,0,0.25)",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        Save Rule
                    </button>

                    {showStrModal && (
                        <RuleModal
                            domain="strength"
                            existingTags={strengthTags}
                            onSave={addRule}
                            onClose={() => setShowStrModal(false)}
                        />
                    )}
                </DomainPanel>
            </div>

            <ChatComposer onSubmit={handleSubmit} />
        </div>
    );
}

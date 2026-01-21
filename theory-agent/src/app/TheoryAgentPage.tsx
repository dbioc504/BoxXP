import { useMemo, useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { DomainPanel } from "../components/DomainPanel";
import { ChatComposer } from "../components/ChatComposer";
import type { PanelRun, RuleChunk } from "../core/types";
import { runDomainAnswer } from "../core/agentCore";

export function TheoryAgentPage() {
    const [tacticalRun, setTacticalRun] = useState<PanelRun | null>(null);
    const [strengthRun, setStrengthRun] = useState<PanelRun | null>(null);

    const rules = useMemo<RuleChunk[]>(
        () => [
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
                body: "Any boxer 18+ is required to be able to perform a 2 mile run, 20+ minutes of jumproping, and 15 minutes of shuffling" +
                    "before learning a lick of technique.",
                tags: ["conditioning", "aerobic", "anaerobic"],
                createdAt: Date.now(),
            },
        ],
        [],
    );

    async function handleSubmit(question: string) {
        const [tac, str] = await Promise.all([
            runDomainAnswer({ domain: "tactical", question, rules }),
            runDomainAnswer({ domain: "strength", question, rules }),
        ]);

        setTacticalRun(tac);
        setStrengthRun(str);
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
                    alignItems: "stretch"
                }}
            >
                <DomainPanel title="TACTICAL" run={tacticalRun} />
                <DomainPanel title="STRENGTH AND CONDITIONING" run={strengthRun}/>
            </div>

            <ChatComposer onSubmit={handleSubmit} />
        </div>
    );
}
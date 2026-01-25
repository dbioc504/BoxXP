import type { PanelRun } from "../core/types";
import "../styles/ui.css";

export function DomainPanel(props: {
    title: string;
    run: PanelRun | null;
    children?: React.ReactNode;
}) {
    if (!props.run) {
        return (
            <div className="card" style={{ minHeight: 420 }}>
                <div className="centerRow" style={{ marginBottom: 14 }}>
                    <div className="pill" style={{ marginBottom: 14 }}>
                        {props.title}
                    </div>
                </div>

                <div style={{ opacity: 0.7, lineHeight: 1.5 }}>
                    Ask a question to generate an answer for this domain.
                </div>

                {props.children}
            </div>
        );
    }

    const run = props.run;

    return (
        <div className="card" style={{ minHeight: 420 }}>
            <div className="centerRow" style={{ marginBottom: 14 }}>
                <div className="pill" style={{ marginBottom: 14 }}>
                    {props.title}
                </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{run.answer}</div>

                <div style={{ opacity: 0.85 }}>
                    <div style={{ fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>
                        CITATIONS
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                        {run.citations.map((c) => (
                            <li key={`${run.id}_${c.ruleId}`} style={{ fontSize: 13, lineHeight: 1.35 }}>
                                <strong>{c.title}</strong>
                                <div style={{ opacity: 0.75 }}>{c.snippet}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ fontSize: 12, opacity: 0.7 }}>Latency: {run.latencyMs} ms</div>
            </div>

            {props.children}
        </div>
    );
}

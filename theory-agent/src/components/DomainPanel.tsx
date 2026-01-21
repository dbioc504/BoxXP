import type { PanelRun } from "../core/types";

export function DomainPanel(props: {
    title: string;
    run: PanelRun | null;
}) {
    return (
        <div
            style={{
                borderRadius: 14,
                background: "rgba(30,30,45,0.65)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: 16,
                minHeight: 420,
                color: "white",
            }}
        >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <div
                    style={{
                        padding: "6px 14px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(0,0,0,0.25)",
                        fontSize: 14,
                        letterSpacing: 1,
                    }}
                >
                    {props.title}
                </div>
            </div>

            {!props.run ? (
                <div style={{ opacity: 0.7, lineHeight: 1.5 }}>
                    Ask a question to generate an answer for this domain.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{props.run.answer}</div>

                    <div style={{ opacity: 0.85 }}>
                        <div style={{ fontSize: 12, letterSpacing: 1, opacity: 0.9, marginBottom: 6 }}>
                            CITATIONS
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                            {props.run.citations.map((c) => (
                                <li key={c.ruleId} style={{ fontSize: 13, lineHeight: 1.35 }}>
                                    <strong>{c.title}</strong>
                                    <div style={{ opacity: 0.75 }} ></div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Latency: {props.run.latencyMs} ms
                    </div>
                </div>
            )}

        </div>
    );
}
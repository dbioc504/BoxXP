import { useMemo, useState } from "react";
import type { Domain, RuleChunk } from "../core/types";

function makeId(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function RuleModal(props: {
    domain: Domain;
    existingTags: string[];
    onSave: (rule: RuleChunk) => void;
    onClose: () => void;
}) {
    const tagOptions = useMemo(() => {
        const unique = Array.from(new Set(props.existingTags.map((t) => t.trim()).filter(Boolean)));
        unique.sort((a, b) => a.localeCompare(b));
        return unique;
    }, [props.existingTags]);

    const [selectedTag, setSelectedTag] = useState(tagOptions[0] ?? "general");
    const [newTag, setNewTag] = useState("");
    const [body, setBody] = useState("");

    function addTag() {
        const t = newTag.trim();
        if (!t) return;
        setSelectedTag(t);
        setNewTag("");
    }

    function save() {
        const trimmedBody = body.trim();
        if (!trimmedBody) return;

        const title = trimmedBody.split("\n")[0].slice(0, 60) || "Untitled rule";

        props.onSave({
            id: makeId("rule"),
            domain: props.domain,
            title,
            body: trimmedBody,
            tags: [selectedTag],
            createdAt: Date.now(),
        });

        props.onClose();
    }

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 70,
                background: "rgba(0,0,0,1)",
                borderRadius: 14,
            }}
        >
            <div
                style={{
                    width: "78%",
                    maxWidth: 520,
                    borderRadius: 12,
                    background: "rgba(120,110,170,0.55)",
                    // border: "1px solid rgba(255,255,255,0.16)",
                    padding: 14,
                    // color: "white",
                }}
            >
                <div style={{ textAlign: "center", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                    SAVE RULE
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ opacity: 0.85 }}>Category:</div>

                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            style={{
                                flex: 1,
                                borderRadius: 10,
                                padding: "6px 10px",
                                background: "rgba(0,0,0,0.25)",
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "white",
                            }}
                        >
                            {tagOptions.length === 0 ? (
                                <option value="general">general</option>
                            ) : (
                                tagOptions.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))
                            )}
                        </select>

                        <input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="new"
                            style={{
                                width: 110,
                                borderRadius: 10,
                                padding: "6px 10px",
                                background: "rgba(0,0,0,0.25)",
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "white",
                            }}
                        />
                        <button
                            onClick={addTag}
                            style={{
                                borderRadius: 10,
                                padding: "6px 10px",
                                border: "1px solid rgba(255,255,255,0.18)",
                                background: "rgba(0,0,0,0.25)",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            +ADD
                        </button>
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                        <div style={{ opacity: 0.85 }}>Rule:</div>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={5}
                            style={{
                                width: "100%",
                                borderRadius: 10,
                                padding: 10,
                                background: "rgba(0,0,0,0.25)",
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "white",
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 4 }}>
                        <button
                            onClick={save}
                            style={{
                                borderRadius: 12,
                                padding: "8px 16px",
                                border: "1px solid rgba(255,255,255,0.18)",
                                background: "rgba(255,255,255,0.12)",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            SAVE
                        </button>
                        <button
                            onClick={props.onClose}
                            style={{
                                borderRadius: 12,
                                padding: "8px 16px",
                                border: "1px solid rgba(255,255,255,0.18)",
                                background: "rgba(0,0,0,0.25)",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

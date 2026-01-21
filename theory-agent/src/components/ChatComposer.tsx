import { useState } from "react";

export function ChatComposer(props: {
    onSubmit: (text: string) => void;
}) {
    const [text, setText] = useState("");

    function submit() {
        const v = text.trim();
        if (!v) return;
        props.onSubmit(v);
        setText("");
    }

    return (
        <div
            style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(20,20,28,0.7)",
                display: "flex",
                gap: 12,
                alignItems: "center",
            }}
        >
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Chat here"
                style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    fontSize: 16,
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                    }
                }}
            />
            <button
                onClick={submit}
                style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.25)",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Send
            </button>
        </div>
    );
}

import { useState } from "react";
import "./ChatComposer.css";

export function ChatComposer(props: {
    onSubmit: (text: string) => void;
}) {
    const [text, setText] = useState("");

    function submit() {
        const v = text.trim();
        console.log("submit:", v);
        if (!v) return;
        props.onSubmit(v);
        setText("");
    }

    return (
        <div className="promptBox">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Chat here"
                className="userText"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                    }
                }}
            />
            <button
                onClick={submit}
                className="submitBtn"
            >
                Send
            </button>
        </div>
    );
}

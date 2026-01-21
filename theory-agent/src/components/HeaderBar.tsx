export function HeaderBar() {
    return (
        <div style={{ display: "flex", justifyContent: "center", padding: 18}}>
            <div
                style={{
                    padding: "10px 18px",
                    borderRadius: 12,
                    border: "1 px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(20,20,28,0.7)",
                    color: "white",
                    fontSize: 18,
                    letterSpacing: 1
                }}
            >
                THEORY AGENT
            </div>
        </div>
    );
}
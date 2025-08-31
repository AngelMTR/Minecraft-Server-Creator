export default function ServerControls({ onStart, onStop }) {
    return (
        <div>
            <button onClick={onStart}>Start Server</button>
            <button onClick={onStop}>Stop Server</button>
        </div>
    );
}

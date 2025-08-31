export default function CommandBox({ command, setCommand, onSend }) {
    return (
        <div>
            <input
                type="text"
                placeholder="Enter Command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
            />
            <button onClick={onSend}>Send Command</button>
        </div>
    );
}

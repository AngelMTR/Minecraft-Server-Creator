export default function StatusBanner({ status }) {
    return (
        <h2>
            Server Status: {status ? (status.running ? '🟢 Running' : '🔴 Stopped') : '⏳ Loading...'}
        </h2>
    );
}

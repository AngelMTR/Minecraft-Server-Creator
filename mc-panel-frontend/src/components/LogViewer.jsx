export default function LogViewer({ logs, onRefresh }) {
    return (
        <div>
            <button onClick={onRefresh}>View Logs</button>
            <pre>{logs.join('\n')}</pre>
        </div>
    );
}

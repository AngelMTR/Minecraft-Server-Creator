import { useEffect, useState } from 'react';
import { startServer, stopServer, getStatus, sendCommand, getLogs } from '../api/mc';
import StatusBanner from '../components/StatusBanner';
import ServerControls from '../components/ServerControls';
import CommandBox from '../components/CommandBox';
import LogViewer from '../components/LogViewer';

export default function Dashboard() {
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [command, setCommand] = useState('');

    useEffect(() => {
        getStatus().then(setStatus);
    }, []);

    return (
        <div>
            <StatusBanner status={status} />
            <ServerControls
                onStart={() => startServer().then(() => setStatus({ running: true }))}
                onStop={() => stopServer().then(() => setStatus({ running: false }))}
            />
            <CommandBox command={command} setCommand={setCommand} onSend={() => sendCommand(command)} />
            <LogViewer logs={logs} onRefresh={() => getLogs().then(setLogs)} />
        </div>
    );
}
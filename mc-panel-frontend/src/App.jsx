import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [command, setCommand] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (!token) return;
        axios.get('http://localhost:3000/mc/status', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setStatus(response.data))
            .catch(err => console.error(err));
    }, [token]);

    const handleLogin = (username, password) => {
        axios.post('http://localhost:3000/auth/login', { username, password })
            .then(response => {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
            })
            .catch(err => console.error('Login error', err));
    };

    const handleStartServer = () => {
        axios.post('http://localhost:3000/mc/start', {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log(response.data);
        }).catch(err => console.error(err));
    };

    const handleStopServer = () => {
        axios.post('http://localhost:3000/mc/stop', {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log(response.data);
        }).catch(err => console.error(err));
    };

    const handleSendCommand = () => {
        axios.post('http://localhost:3000/mc/command', { command }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log(response.data);
        }).catch(err => console.error(err));
    };

    const handleViewLogs = () => {
        axios.get('http://localhost:3000/mc/logs', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setLogs(response.data.logs);
        }).catch(err => console.error(err));
    };

    return (
        <div>
            {!token ? (
                <div>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button onClick={() => handleLogin('Dana', 'admin123')}>Login</button>
                </div>
            ) : (
                <div>
                    <h2>Server Status: {status ? (status.running ? 'Running' : 'Stopped') : 'Loading...'}</h2>
                    <button onClick={handleStartServer}>Start Server</button>
                    <button onClick={handleStopServer}>Stop Server</button>
                    <div>
                        <button onClick={handleViewLogs}>View Logs</button>
                        <pre>{logs}</pre>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter Command"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                    />
                    <button onClick={handleSendCommand}>Send Command</button>
                </div>
            )}
        </div>
    );
};

export default App;

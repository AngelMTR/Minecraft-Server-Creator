import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('Dana');
    const [password, setPassword] = useState('admin123');

    const handleLogin = async () => {
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch {
            alert('Login failed');
        }
    };

    return (
        <div>
            <input value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
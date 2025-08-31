import axios from './axios';

export const startServer = () => axios.post('/mc/start');
export const stopServer = () => axios.post('/mc/stop');
export const getStatus = () => axios.get('/mc/status').then(res => res.data);
export const sendCommand = (command) => axios.post('/mc/command', { command });
export const getLogs = () => axios.get('/mc/logs').then(res => res.data.logs);

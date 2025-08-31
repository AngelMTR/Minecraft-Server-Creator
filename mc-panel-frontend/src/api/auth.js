import axios from './axios';

export const login = async (username, password) => {
    const res = await axios.post('/auth/login', { username, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    return token;
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

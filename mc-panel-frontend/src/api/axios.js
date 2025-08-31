import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

instance.interceptors.response.use(
    res => res,
    err => {
        if (err.response && [401, 403].includes(err.response.status)) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default instance;
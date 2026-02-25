import client from './client';

export const authApi = {
    register: (email, password) =>
        client.post('/api/auth/register', { email, password }),

    login: (email, password) =>
        client.post('/api/auth/login', { email, password }),

    getMe: () =>
        client.get('/api/auth/me'),
};

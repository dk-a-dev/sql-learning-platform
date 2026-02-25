import client from './client';

export const assignmentsApi = {
    getAll: () =>
        client.get('/api/assignments'),

    getById: (id) =>
        client.get(`/api/assignments/${id}`),

    seed: () =>
        client.post('/api/assignments/seed'),
};

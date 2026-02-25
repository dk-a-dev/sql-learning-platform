import client from './client';

export const executeApi = {
    run: (query) =>
        client.post('/api/execute', { query }),

    submit: (query, assignmentId) =>
        client.post('/api/execute/submit', { query, assignmentId }),
};

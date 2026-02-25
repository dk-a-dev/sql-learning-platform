import client from './client';

export const attemptsApi = {
    save: (assignmentId, querySubmitted, status) =>
        client.post('/api/attempts', { assignmentId, querySubmitted, status }),

    getByAssignment: (assignmentId) =>
        client.get(`/api/attempts/assignment/${assignmentId}`),

    getMine: () =>
        client.get('/api/attempts/me'),
};

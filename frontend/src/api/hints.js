import client from './client';

export const hintsApi = {
    getHint: (question, schema, attempt) =>
        client.post('/api/hints', { question, schema, attempt }),
};

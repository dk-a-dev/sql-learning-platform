import { create } from 'zustand';
import { executeApi, hintsApi, attemptsApi } from '../api';

const useWorkspaceStore = create((set, get) => ({
    // ─── State ─────────────────────────────────────────────────
    query: 'SELECT * FROM users;\n',
    results: null,
    executing: false,
    error: null,

    hint: '',
    hintLoading: false,

    attempts: [],
    attemptsLoading: false,

    // ─── Query Actions ─────────────────────────────────────────
    setQuery: (query) => set({ query }),

    executeQuery: async () => {
        const { query } = get();
        set({ executing: true, error: null, results: null });
        try {
            const { data } = await executeApi.run(query);
            set({ results: data, executing: false });
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.details ||
                err.response?.data?.error ||
                err.message;
            set({ error: errorMsg, executing: false });
            return null;
        }
    },

    // Submit query for correctness check against solution
    submitQuery: async (assignmentId) => {
        const { query } = get();
        set({ executing: true, error: null, results: null });
        try {
            const { data } = await executeApi.submit(query, assignmentId);
            set({ results: data, executing: false });
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.details ||
                err.response?.data?.error ||
                err.message;
            set({ error: errorMsg, executing: false });
            return null;
        }
    },

    // ─── Hint Actions ──────────────────────────────────────────
    getHint: async (question, schema) => {
        const { query } = get();
        set({ hintLoading: true });
        try {
            const { data } = await hintsApi.getHint(question, schema, query);
            set({ hint: data.hint, hintLoading: false });
        } catch {
            set({ hint: 'Failed to get hint. Please try again.', hintLoading: false });
        }
    },

    clearHint: () => set({ hint: '' }),

    // ─── Attempt Actions ──────────────────────────────────────
    saveAttempt: async (assignmentId, status) => {
        const { query } = get();
        try {
            await attemptsApi.save(assignmentId, query, status);
        } catch (err) {
            console.error('Failed to save attempt:', err.message);
        }
    },

    fetchAttempts: async (assignmentId) => {
        set({ attemptsLoading: true });
        try {
            const { data } = await attemptsApi.getByAssignment(assignmentId);
            set({ attempts: data, attemptsLoading: false });
        } catch {
            set({ attemptsLoading: false });
        }
    },

    // ─── Reset ─────────────────────────────────────────────────
    resetWorkspace: () =>
        set({
            query: 'SELECT * FROM users;\n',
            results: null,
            executing: false,
            error: null,
            hint: '',
            hintLoading: false,
            attempts: [],
        }),
}));

export default useWorkspaceStore;

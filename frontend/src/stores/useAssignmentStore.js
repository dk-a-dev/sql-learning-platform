import { create } from 'zustand';
import { assignmentsApi } from '../api';

const useAssignmentStore = create((set) => ({
    // ─── State ─────────────────────────────────────────────────
    assignments: [],
    currentAssignment: null,
    loading: false,
    error: null,

    // ─── Actions ───────────────────────────────────────────────
    fetchAssignments: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await assignmentsApi.getAll();
            set({ assignments: data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.error || 'Failed to load assignments',
                loading: false,
            });
        }
    },

    fetchAssignmentById: async (id) => {
        set({ loading: true, error: null, currentAssignment: null });
        try {
            const { data } = await assignmentsApi.getById(id);
            set({ currentAssignment: data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.error || 'Assignment not found',
                loading: false,
            });
        }
    },

    clearCurrentAssignment: () => set({ currentAssignment: null }),
}));

export default useAssignmentStore;

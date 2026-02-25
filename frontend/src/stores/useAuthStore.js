import { create } from 'zustand';
import { authApi } from '../api';

const useAuthStore = create((set) => ({
    // ─── State ─────────────────────────────────────────────────
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    // ─── Actions ───────────────────────────────────────────────
    register: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await authApi.register(email, password);
            localStorage.setItem('token', data.token);
            set({ token: data.token, isAuthenticated: true, loading: false });
            return true;
        } catch (err) {
            set({
                error: err.response?.data?.error || 'Registration failed',
                loading: false,
            });
            return false;
        }
    },

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await authApi.login(email, password);
            localStorage.setItem('token', data.token);
            set({ token: data.token, isAuthenticated: true, loading: false });
            return true;
        } catch (err) {
            set({
                error: err.response?.data?.error || 'Login failed',
                loading: false,
            });
            return false;
        }
    },

    fetchUser: async () => {
        try {
            const { data } = await authApi.getMe();
            set({ user: data });
        } catch {
            // Token invalid or expired
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;

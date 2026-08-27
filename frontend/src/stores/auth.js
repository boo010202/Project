import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: localStorage.getItem('accessToken') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
    },
    actions: {
        async login(username, password) {
            try {
                const res = await api.post('/auth/login', { username, password });
                this.accessToken = res.data.accessToken;
                this.user = res.data.user;
                localStorage.setItem('accessToken', this.accessToken);
                return true;
            } catch (err) {
                throw new Error(err.response?.data?.message || 'การเข้าสู่ระบบล้มเหลว');
            }
        },
        logout() {
            this.user = null;
            this.accessToken = null;
            localStorage.removeItem('accessToken');
        }
    }
});
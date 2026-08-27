import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'admin',
    userRole: (state) => state.user?.role || 'staff',
    fullName: (state) => state.user?.full_name || ''
  },

  actions: {
    setAccessToken(token) {
      this.accessToken = token;
    },

    setUser(user) {
      this.user = user;
    },

    async login(username, password) {
      this.loading = true;
      try {
        const data = await authService.login(username, password);
        this.accessToken = data.accessToken;
        this.user = data.user;
        return data;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch (err) {
        console.error('Logout request failed:', err);
      } finally {
        this.clearAuth();
      }
    },

    clearAuth() {
      this.accessToken = null;
      this.user = null;
    },

    // Try to silently refresh token on app initialization
    async initialize() {
      if (this.initialized) return;
      
      try {
        const data = await authService.refresh();
        this.accessToken = data.accessToken;
        this.user = data.user;
      } catch (error) {
        console.log('No active session / cookie not present');
        this.clearAuth();
      } finally {
        this.initialized = true;
      }
    }
  }
});

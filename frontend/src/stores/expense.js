import { defineStore } from 'pinia';
import api from '../services/api';

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [],
    currentExpense: null,
    dashboardSummary: null,
    categoryChartData: [],
    budgetChartData: [],
    compareChartData: null,
    loading: false,
    meta: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10
    },
    error: null
  }),

  actions: {
    async fetchExpenses(params = {}) {
      this.loading = true;
      try {
        const response = await api.get('/expenses', { params });
        this.expenses = response.data.data;
        this.meta = response.data.meta;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch expenses';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchExpenseById(id) {
      this.loading = true;
      try {
        const response = await api.get(`/expenses/${id}`);
        this.currentExpense = response.data.data;
        return response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch expense details';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createExpense(formData) {
      try {
        const response = await api.post('/expenses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to create expense record';
      }
    },

    async updateExpense(id, formData) {
      try {
        const response = await api.put(`/expenses/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to update expense record';
      }
    },

    async deleteExpense(id) {
      try {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete expense record';
      }
    },

    async fetchDashboardSummary(year) {
      try {
        const response = await api.get('/dashboard/summary', { params: { year } });
        this.dashboardSummary = response.data.data;
      } catch (err) {
        console.error('Failed to fetch dashboard summary', err);
      }
    },

    async fetchCategoryChartData(year) {
      try {
        const response = await api.get('/dashboard/by-category', { params: { year } });
        this.categoryChartData = response.data.data;
      } catch (err) {
        console.error('Failed to fetch category chart data', err);
      }
    },

    async fetchBudgetChartData(year) {
      try {
        const response = await api.get('/dashboard/by-budget', { params: { year } });
        this.budgetChartData = response.data.data;
      } catch (err) {
        console.error('Failed to fetch budget chart data', err);
      }
    },

    async fetchCompareChartData(year1, year2) {
      try {
        const response = await api.get('/dashboard/compare', { params: { year1, year2 } });
        this.compareChartData = response.data.data;
      } catch (err) {
        console.error('Failed to fetch comparison chart data', err);
      }
    }
  }
});

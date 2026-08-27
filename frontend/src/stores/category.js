import { defineStore } from 'pinia';
import api from '../services/api';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    expenseCategories: [],
    budgetCategories: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchExpenseCategories() {
      this.loading = true;
      try {
        const response = await api.get('/expense-categories');
        this.expenseCategories = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch expense categories';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createExpenseCategory(categoryData) {
      try {
        const response = await api.post('/expense-categories', categoryData);
        await this.fetchExpenseCategories();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to create expense category';
      }
    },

    async updateExpenseCategory(id, categoryData) {
      try {
        const response = await api.put(`/expense-categories/${id}`, categoryData);
        await this.fetchExpenseCategories();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to update expense category';
      }
    },

    async deleteExpenseCategory(id) {
      try {
        const response = await api.delete(`/expense-categories/${id}`);
        await this.fetchExpenseCategories();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete expense category';
      }
    },

    async fetchBudgetCategories() {
      this.loading = true;
      try {
        const response = await api.get('/budget-categories');
        this.budgetCategories = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch budget categories';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createBudgetCategory(budgetData) {
      try {
        const response = await api.post('/budget-categories', budgetData);
        await this.fetchBudgetCategories();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to create budget category';
      }
    },

    async updateBudgetCategory(id, budgetData) {
      try {
        const response = await api.put(`/budget-categories/${id}`, budgetData);
        await this.fetchBudgetCategories();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to update budget category';
      }
    },

    async deleteBudgetCategory(id) {
      try {
        const response = await api.delete(`/budget-categories/${id}`);
        await this.fetchBudgetCategories();
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete budget category';
      }
    }
  }
});

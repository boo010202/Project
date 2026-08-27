import { defineStore } from 'pinia';
import api from '../services/api';

export const useExpenseStore = defineStore('expense', {
    state: () => ({
        expenses: [],
        loading: false
    }),
    actions: {
        async fetchExpenses() {
            this.loading = true;
            try {
                const res = await api.get('/expenses');
                this.expenses = res.data;
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                this.loading = false;
            }
        },
        async deleteExpense(id) {
            try {
                await api.delete(`/expenses/${id}`);
                this.expenses = this.expenses.filter(e => e.id !== id);
            } catch (err) {
                throw new Error(err.response?.data?.message || 'ลบข้อมูลไม่สำเร็จ');
            }
        }
    }
});
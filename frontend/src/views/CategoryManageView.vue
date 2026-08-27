<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-slate-100">จัดการประเภทและหมวดเงิน</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- จัดการประเภทค่าใช้จ่าย -->
      <div class="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50">
        <h2 class="text-lg font-semibold mb-4 text-blue-400">ประเภทค่าใช้จ่าย (Expense Categories)</h2>
        <form @submit.prevent="addExpenseCategory" class="flex gap-2 mb-4">
          <input v-model="newExpenseCat.name" placeholder="ชื่อประเภท (เช่น ค่าไฟฟ้า)" required class="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-sm flex-1 text-white outline-none" />
          <input v-model="newExpenseCat.code" placeholder="รหัส (เช่น ELEC)" required class="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-sm w-28 text-white outline-none" />
          <button type="submit" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-medium">เพิ่ม</button>
        </form>
        <ul class="divide-y divide-slate-700/50">
          <li v-for="item in expenseCategories" :key="item.id" class="py-2.5 flex justify-between items-center text-sm">
            <span>{{ item.name }} <span class="text-xs text-slate-400">({{ item.code }})</span></span>
            <button @click="deleteExpenseCat(item.id)" class="text-rose-400 hover:text-rose-300 text-xs">ลบ</button>
          </li>
        </ul>
      </div>

      <!-- จัดการหมวดเงินงบประมาณ -->
      <div class="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50">
        <h2 class="text-lg font-semibold mb-4 text-emerald-400">หมวดเงินงบประมาณ (Budget Categories)</h2>
        <form @submit.prevent="addBudgetCategory" class="flex gap-2 mb-4">
          <input v-model="newBudgetCat.name" placeholder="ชื่อหมวดเงิน (เช่น งบประมาณ ปวช.)" required class="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-sm flex-1 text-white outline-none" />
          <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-sm font-medium">เพิ่ม</button>
        </form>
        <ul class="divide-y divide-slate-700/50">
          <li v-for="item in budgetCategories" :key="item.id" class="py-2.5 flex justify-between items-center text-sm">
            <span>{{ item.name }}</span>
            <button @click="deleteBudgetCat(item.id)" class="text-rose-400 hover:text-rose-300 text-xs">ลบ</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const expenseCategories = ref([]);
const budgetCategories = ref([]);
const newExpenseCat = ref({ name: '', code: '' });
const newBudgetCat = ref({ name: '' });

const loadData = async () => {
  const [resExp, resBud] = await Promise.all([
    api.get('/expense-categories'),
    api.get('/budget-categories')
  ]);
  expenseCategories.value = resExp.data;
  budgetCategories.value = resBud.data;
};

const addExpenseCategory = async () => {
  await api.post('/expense-categories', newExpenseCat.value);
  newExpenseCat.value = { name: '', code: '' };
  loadData();
};

const deleteExpenseCat = async (id) => {
  if (confirm('ยืนยันการลบประเภทนี้?')) {
    await api.delete(`/expense-categories/${id}`);
    loadData();
  }
};

const addBudgetCategory = async () => {
  await api.post('/budget-categories', newBudgetCat.value);
  newBudgetCat.value = { name: '' };
  loadData();
};

const deleteBudgetCat = async (id) => {
  if (confirm('ยืนยันการลบหมวดเงินนี้?')) {
    await api.delete(`/budget-categories/${id}`);
    loadData();
  }
};

onMounted(loadData);
</script>
<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">รายการค่าสาธารณูปโภค</h2>
        <p class="text-slate-500 text-sm">ทั้งหมด {{ expenseStore.meta.totalItems }} รายการ</p>
      </div>
      <router-link
        to="/expenses/create"
        class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2 rounded-xl transition-all text-sm shadow-sm w-fit"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        บันทึกค่าใช้จ่ายใหม่
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1">เดือน</label>
          <select v-model="filters.month" @change="applyFilters" class="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">ทุกเดือน</option>
            <option v-for="(m, i) in MONTHS_FULL" :key="i" :value="i + 1">{{ m }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1">ปี</label>
          <select v-model="filters.year" @change="applyFilters" class="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">ทุกปี</option>
            <option v-for="yr in yearOptions" :key="yr" :value="yr">{{ yr }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1">ประเภทค่าใช้จ่าย</label>
          <select v-model="filters.expense_category_id" @change="applyFilters" class="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">ทุกประเภท</option>
            <option v-for="c in categoryStore.expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1">หมวดเงิน</label>
          <select v-model="filters.budget_category_id" @change="applyFilters" class="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">ทุกหมวด</option>
            <option v-for="b in categoryStore.budgetCategories" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
      </div>
      <button @click="clearFilters" class="mt-2 text-xs text-slate-400 hover:text-slate-700 transition-colors">ล้างตัวกรอง</button>
    </div>

    <!-- Loading -->
    <div v-if="expenseStore.loading" class="flex justify-center py-12">
      <svg class="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Desktop Table -->
    <div v-else-if="expenseStore.expenses.length > 0" class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-slate-100">
        <thead>
          <tr class="bg-slate-50 text-left">
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">เดือน</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ประเภท</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">หมวดเงิน</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">เลขที่บิล</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">จำนวนเงิน</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">วันชำระ</th>
            <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="exp in expenseStore.expenses" :key="exp.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-4 py-3 text-sm text-slate-700">{{ formatBillingMonth(exp.billing_month) }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {{ exp.category?.name || '-' }}
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-slate-600">{{ exp.budget?.name || '-' }}</td>
            <td class="px-4 py-3 text-xs text-slate-500 font-mono">{{ exp.invoice_no || '-' }}</td>
            <td class="px-4 py-3 text-right font-semibold text-slate-800 text-sm">{{ formatCurrency(exp.amount) }}</td>
            <td class="px-4 py-3 text-xs text-slate-500">{{ formatDate(exp.paid_date) }}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <router-link :to="`/expenses/${exp.id}/edit`" class="text-blue-500 hover:text-blue-700 transition-colors p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </router-link>
                <button @click="confirmDelete(exp)" class="text-red-400 hover:text-red-600 transition-colors p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card List -->
    <div v-else-if="!expenseStore.loading && expenseStore.expenses.length > 0" class="md:hidden space-y-3">
      <div v-for="exp in expenseStore.expenses" :key="exp.id" class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{{ exp.category?.name }}</span>
            <p class="text-xs text-slate-500 mt-1">{{ exp.budget?.name }}</p>
          </div>
          <p class="text-lg font-bold text-slate-800">{{ formatCurrency(exp.amount) }}</p>
        </div>
        <div class="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{{ formatBillingMonth(exp.billing_month) }} | ชำระ: {{ formatDate(exp.paid_date) }}</span>
          <div class="flex gap-2">
            <router-link :to="`/expenses/${exp.id}/edit`" class="text-blue-500 hover:text-blue-700">แก้ไข</router-link>
            <button @click="confirmDelete(exp)" class="text-red-400 hover:text-red-600">ลบ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!expenseStore.loading" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-slate-500 font-medium">ไม่พบรายการค่าใช้จ่าย</p>
      <p class="text-slate-400 text-sm">ลองเปลี่ยนตัวกรองหรือบันทึกรายการใหม่</p>
    </div>

    <!-- Pagination -->
    <div v-if="expenseStore.meta.totalPages > 1" class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        หน้า {{ expenseStore.meta.currentPage }} / {{ expenseStore.meta.totalPages }}
        ({{ expenseStore.meta.totalItems }} รายการ)
      </p>
      <div class="flex gap-2">
        <button
          @click="changePage(expenseStore.meta.currentPage - 1)"
          :disabled="expenseStore.meta.currentPage === 1"
          class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >← ก่อนหน้า</button>
        <button
          @click="changePage(expenseStore.meta.currentPage + 1)"
          :disabled="expenseStore.meta.currentPage >= expenseStore.meta.totalPages"
          class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >ถัดไป →</button>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800 text-center mb-2">ยืนยันการลบ</h3>
        <p class="text-slate-500 text-sm text-center mb-6">
          ต้องการลบรายการ <strong>{{ deleteTarget.category?.name }}</strong> จำนวน <strong>{{ formatCurrency(deleteTarget.amount) }}</strong> ใช่หรือไม่?
        </p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm">ยกเลิก</button>
          <button @click="handleDelete" :disabled="deleting" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl transition-colors text-sm disabled:opacity-60">
            {{ deleting ? 'กำลังลบ...' : 'ลบรายการ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useExpenseStore } from '../stores/expense';
import { useCategoryStore } from '../stores/category';

const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

const MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const yearOptions = computed(() => {
  const cur = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => cur - i);
});

const filters = reactive({
  month: '',
  year: new Date().getFullYear(),
  expense_category_id: '',
  budget_category_id: '',
  page: 1,
  limit: 10
});

const deleteTarget = ref(null);
const deleting = ref(false);

const formatCurrency = (v) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('th-TH') : '-';
const formatBillingMonth = (d) => {
  if (!d) return '-';
  const dt = new Date(d);
  return `${MONTHS_FULL[dt.getMonth()]} ${dt.getFullYear() + 543}`;
};

const applyFilters = async () => {
  filters.page = 1;
  await expenseStore.fetchExpenses({ ...filters });
};

const clearFilters = () => {
  filters.month = '';
  filters.year = new Date().getFullYear();
  filters.expense_category_id = '';
  filters.budget_category_id = '';
  applyFilters();
};

const changePage = async (page) => {
  filters.page = page;
  await expenseStore.fetchExpenses({ ...filters });
};

const confirmDelete = (exp) => { deleteTarget.value = exp; };

const handleDelete = async () => {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await expenseStore.deleteExpense(deleteTarget.value.id);
    deleteTarget.value = null;
    await applyFilters();
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการลบรายการ');
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchExpenseCategories(),
    categoryStore.fetchBudgetCategories(),
    applyFilters()
  ]);
});
</script>

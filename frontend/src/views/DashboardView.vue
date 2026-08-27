<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">แดชบอร์ดหลัก</h2>
        <p class="text-slate-500 text-sm mt-0.5">ภาพรวมค่าสาธารณูปโภคประจำปี {{ selectedYear }}</p>
      </div>
      <!-- Year Selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-slate-600">เลือกปี:</label>
        <select
          v-model="selectedYear"
          @change="loadData"
          class="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        >
          <option v-for="yr in yearOptions" :key="yr" :value="yr">{{ yr }}</option>
        </select>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="summaryData" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="summaryData.pctChange >= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
            {{ summaryData.pctChange >= 0 ? '+' : '' }}{{ summaryData.pctChange }}%
          </span>
        </div>
        <p class="text-2xl font-bold text-slate-800 truncate">{{ formatCurrency(summaryData.currentMonth.total) }}</p>
        <p class="text-xs text-slate-500 mt-1">ยอดเดือนนี้ ({{ getMonthName(summaryData.currentMonth.month) }})</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-slate-800 truncate">{{ formatCurrency(summaryData.lastMonth.total) }}</p>
        <p class="text-xs text-slate-500 mt-1">ยอดเดือนที่แล้ว ({{ getMonthName(summaryData.lastMonth.month) }})</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" :class="summaryData.pctChange >= 0 ? 'bg-red-100' : 'bg-green-100'">
          <svg class="w-5 h-5" :class="summaryData.pctChange >= 0 ? 'text-red-600' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="summaryData.pctChange >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" />
          </svg>
        </div>
        <p class="text-2xl font-bold truncate" :class="summaryData.pctChange >= 0 ? 'text-red-600' : 'text-green-600'">
          {{ summaryData.pctChange >= 0 ? '+' : '' }}{{ summaryData.pctChange }}%
        </p>
        <p class="text-xs text-slate-500 mt-1">การเปลี่ยนแปลง (MoM)</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-10v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-slate-800 truncate">{{ formatCurrency(summaryData.yearTotal) }}</p>
        <p class="text-xs text-slate-500 mt-1">ยอดรวมปี {{ summaryData.currentMonth.year }}</p>
      </div>
    </div>

    <!-- Loading skeleton for cards -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
        <div class="w-10 h-10 bg-slate-200 rounded-xl mb-3"></div>
        <div class="h-7 bg-slate-200 rounded-lg mb-2 w-3/4"></div>
        <div class="h-3 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Charts Row 1: Monthly bar chart + Doughnut -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Monthly Bar Chart -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-slate-800 mb-4">ยอดรายจ่ายรายเดือน {{ selectedYear }}</h3>
        <div class="h-56">
          <Bar v-if="monthlyChartData.datasets.length" :data="monthlyChartData" :options="barOptions" />
          <div v-else class="h-full flex items-center justify-center text-slate-400 text-sm">ไม่มีข้อมูลสำหรับปีนี้</div>
        </div>
      </div>

      <!-- Doughnut by Category -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-slate-800 mb-4">สัดส่วนตามประเภท</h3>
        <div class="h-48 flex items-center justify-center">
          <Doughnut v-if="doughnutChartData.datasets[0]?.data.length" :data="doughnutChartData" :options="doughnutOptions" />
          <div v-else class="text-slate-400 text-sm">ไม่มีข้อมูล</div>
        </div>
        <!-- Legend -->
        <div class="mt-4 space-y-1.5 max-h-32 overflow-y-auto">
          <div v-for="(label, idx) in doughnutChartData.labels" :key="idx" class="flex items-center gap-2 text-xs text-slate-600">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: doughnutChartData.datasets[0]?.backgroundColor?.[idx] }"></span>
            <span class="truncate">{{ label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stacked Bar Chart by Budget Category -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 class="text-base font-semibold text-slate-800 mb-4">รายจ่ายแยกตามหมวดเงิน {{ selectedYear }}</h3>
      <div class="h-60">
        <Bar v-if="budgetChartData.datasets.length" :data="budgetChartData" :options="stackedBarOptions" />
        <div v-else class="h-full flex items-center justify-center text-slate-400 text-sm">ไม่มีข้อมูลสำหรับปีนี้</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-3">
      <router-link
        to="/expenses/create"
        class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-emerald-500/30 text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        บันทึกค่าใช้จ่ายใหม่
      </router-link>
      <router-link
        to="/expenses"
        class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
      >
        ดูรายการทั้งหมด →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useExpenseStore } from '../stores/expense';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const expenseStore = useExpenseStore();
const selectedYear = ref(new Date().getFullYear());
const summaryData = ref(null);

const yearOptions = computed(() => {
  const cur = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => cur - i);
});

const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(val || 0);
};

const getMonthName = (m) => MONTHS_FULL[(m || 1) - 1] || '';

// Monthly bar chart data
const monthlyChartData = computed(() => {
  const d = summaryData.value?.monthlyChartData || [];
  if (!d.length) return { labels: MONTHS_TH, datasets: [] };
  return {
    labels: MONTHS_TH,
    datasets: [{
      label: 'ยอดรายจ่าย (บาท)',
      data: d,
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1.5,
      borderRadius: 6,
    }]
  };
});

// Doughnut by expense category
const doughnutChartData = computed(() => {
  const cats = expenseStore.categoryChartData;
  if (!cats?.length) return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
  return {
    labels: cats.map(c => c.name),
    datasets: [{
      data: cats.map(c => c.total),
      backgroundColor: COLORS.slice(0, cats.length),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };
});

// Stacked bar by budget
const budgetChartData = computed(() => {
  const buds = expenseStore.budgetChartData;
  if (!buds?.length) return { labels: MONTHS_TH, datasets: [] };
  return {
    labels: MONTHS_TH,
    datasets: buds.map((b, i) => ({
      label: b.name,
      data: b.data,
      backgroundColor: COLORS[i % COLORS.length],
      borderRadius: 4
    }))
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${Number(ctx.raw).toLocaleString('th-TH')} บาท` } } },
  scales: { y: { ticks: { callback: (v) => `${(v/1000).toFixed(0)}K` }, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '65%'
};

const stackedBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('th-TH')} บาท` } } },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, ticks: { callback: (v) => `${(v/1000).toFixed(0)}K` }, grid: { color: '#f1f5f9' } }
  }
};

const loadData = async () => {
  summaryData.value = null;
  await Promise.all([
    expenseStore.fetchDashboardSummary(selectedYear.value),
    expenseStore.fetchCategoryChartData(selectedYear.value),
    expenseStore.fetchBudgetChartData(selectedYear.value)
  ]);
  summaryData.value = expenseStore.dashboardSummary;
};

onMounted(loadData);
</script>

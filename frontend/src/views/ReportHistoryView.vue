<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">รายงานย้อนหลัง &amp; เปรียบเทียบ</h2>
        <p class="text-slate-500 text-sm">วิเคราะห์ค่าใช้จ่ายแยกตามปี</p>
      </div>

      <!-- Year selectors -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-600 whitespace-nowrap">ปี 1:</label>
          <select v-model="year1" @change="loadCompare" class="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option v-for="yr in yearOptions" :key="yr" :value="yr">{{ yr }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-600 whitespace-nowrap">ปี 2:</label>
          <select v-model="year2" @change="loadCompare" class="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
            <option v-for="yr in yearOptions" :key="yr" :value="yr">{{ yr }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Comparison Bar Chart -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-slate-800">เปรียบเทียบรายจ่ายรายเดือน</h3>
        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>{{ year1 }}</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>{{ year2 }}</div>
        </div>
      </div>
      <div class="h-64">
        <Bar v-if="compareData" :data="compareChartData" :options="compareOptions" />
        <div v-else class="h-full flex items-center justify-center">
          <svg class="w-6 h-6 animate-spin text-emerald-400 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span class="text-slate-400 text-sm">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    </div>

    <!-- Summary Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-800">ตารางเปรียบเทียบรายเดือน</h3>
        <span v-if="compareData" class="text-xs text-slate-400">หน่วย: บาท</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead>
            <tr class="bg-slate-50">
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">เดือน</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide">{{ year1 }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-blue-600 uppercase tracking-wide">{{ year2 }}</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">เปลี่ยนแปลง</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100" v-if="compareData">
            <tr v-for="(row, idx) in tableRows" :key="idx" class="hover:bg-slate-50 transition-colors">
              <td class="px-5 py-3 text-sm font-medium text-slate-700">{{ MONTHS_FULL[idx] }}</td>
              <td class="px-5 py-3 text-right text-sm text-slate-700 font-mono">{{ formatNum(row.v1) }}</td>
              <td class="px-5 py-3 text-right text-sm text-slate-700 font-mono">{{ formatNum(row.v2) }}</td>
              <td class="px-5 py-3 text-right">
                <span
                  v-if="row.v1 > 0 || row.v2 > 0"
                  class="text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="row.diff >= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
                >
                  {{ row.diff >= 0 ? '+' : '' }}{{ formatNum(row.diff) }}
                </span>
                <span v-else class="text-slate-300 text-xs">-</span>
              </td>
            </tr>
            <!-- Totals -->
            <tr class="bg-slate-50 font-semibold">
              <td class="px-5 py-3 text-sm text-slate-800">รวมทั้งปี</td>
              <td class="px-5 py-3 text-right text-sm text-emerald-600 font-mono font-bold">{{ formatNum(totalYear1) }}</td>
              <td class="px-5 py-3 text-right text-sm text-blue-600 font-mono font-bold">{{ formatNum(totalYear2) }}</td>
              <td class="px-5 py-3 text-right">
                <span
                  class="text-sm font-bold"
                  :class="totalYear2 - totalYear1 >= 0 ? 'text-red-600' : 'text-green-600'"
                >
                  {{ totalYear2 - totalYear1 >= 0 ? '+' : '' }}{{ formatNum(totalYear2 - totalYear1) }}
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="px-5 py-10 text-center text-slate-400 text-sm">กำลังโหลดข้อมูล...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Category Breakdown for year1 -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-slate-800">สัดส่วนแต่ละประเภทปี {{ year1 }}</h3>
      </div>
      <div class="h-56">
        <Doughnut v-if="doughnutData.datasets[0]?.data.length" :data="doughnutData" :options="doughnutOptions" />
        <div v-else class="h-full flex items-center justify-center text-slate-400 text-sm">ไม่มีข้อมูล</div>
      </div>
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div v-for="(label, idx) in doughnutData.labels" :key="idx" class="flex items-center gap-2 text-xs text-slate-600">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: COLORS[idx % COLORS.length] }"></span>
          <span class="truncate">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { useExpenseStore } from '../stores/expense';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const expenseStore = useExpenseStore();
const curYear = new Date().getFullYear();
const year1 = ref(curYear);
const year2 = ref(curYear - 1);

const MONTHS_FULL = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const COLORS = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316','#6366f1'];

const yearOptions = computed(() => Array.from({ length: 6 }, (_, i) => curYear - i));

const compareData = ref(null);

const formatNum = (v) => Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 });

const tableRows = computed(() => {
  if (!compareData.value) return [];
  return MONTHS_FULL.map((_, i) => ({
    v1: compareData.value.year1Data?.[i] || 0,
    v2: compareData.value.year2Data?.[i] || 0,
    diff: (compareData.value.year2Data?.[i] || 0) - (compareData.value.year1Data?.[i] || 0)
  }));
});

const totalYear1 = computed(() => (compareData.value?.year1Data || []).reduce((a, b) => a + b, 0));
const totalYear2 = computed(() => (compareData.value?.year2Data || []).reduce((a, b) => a + b, 0));

const compareChartData = computed(() => ({
  labels: MONTHS_FULL,
  datasets: [
    {
      label: String(year1.value),
      data: compareData.value?.year1Data || [],
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: '#10b981',
      borderWidth: 1.5,
      borderRadius: 5
    },
    {
      label: String(year2.value),
      data: compareData.value?.year2Data || [],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: '#3b82f6',
      borderWidth: 1.5,
      borderRadius: 5
    }
  ]
}));

const compareOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { font: { size: 11 } } },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('th-TH')} บาท` } }
  },
  scales: {
    y: { ticks: { callback: (v) => `${(v / 1000).toFixed(0)}K` }, grid: { color: '#f1f5f9' } },
    x: { grid: { display: false } }
  }
};

const doughnutData = computed(() => {
  const cats = expenseStore.categoryChartData;
  if (!cats?.length) return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
  return {
    labels: cats.map(c => c.name),
    datasets: [{ data: cats.map(c => c.total), backgroundColor: COLORS.slice(0, cats.length), borderWidth: 2, borderColor: '#fff' }]
  };
});

const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' };

const loadCompare = async () => {
  compareData.value = null;
  await Promise.all([
    expenseStore.fetchCompareChartData(year1.value, year2.value),
    expenseStore.fetchCategoryChartData(year1.value)
  ]);
  compareData.value = expenseStore.compareChartData;
};

onMounted(loadCompare);
</script>

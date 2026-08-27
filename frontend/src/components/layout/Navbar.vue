<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8">
    <!-- Left Section: Page title / Breadcrumb context -->
    <div>
      <h1 class="text-lg font-bold text-slate-800 tracking-tight">
        {{ getPageTitle() }}
      </h1>
    </div>

    <!-- Right Section: Profile & Logout -->
    <div class="flex items-center space-x-4">
      <div class="hidden sm:flex flex-col text-right">
        <span class="text-sm font-semibold text-slate-800">{{ authStore.user?.full_name }}</span>
        <span class="text-xs text-slate-500 capitalize">{{ authStore.userRole }}</span>
      </div>

      <button 
        @click="handleLogout" 
        class="flex items-center space-x-2 text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
        title="ออกจากระบบ"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="text-sm font-medium hidden md:inline">ออกจากระบบ</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const getPageTitle = () => {
  switch (route.name) {
    case 'dashboard':
      return 'แดชบอร์ดหลัก';
    case 'expenses-list':
      return 'รายการค่าสาธารณูปโภคทั้งหมด';
    case 'expense-create':
      return 'บันทึกค่าใช้จ่ายใหม่';
    case 'expense-edit':
      return 'แก้ไขรายการค่าใช้จ่าย';
    case 'expense-categories':
      return 'ตั้งค่าประเภทค่าสาธารณูปโภค';
    case 'budget-categories':
      return 'ตั้งค่าแหล่งเงินงบประมาณ';
    case 'reports':
      return 'รายงานย้อนหลัง & เปรียบเทียบ';
    default:
      return 'ระบบ e-Utilities';
  }
};

const handleLogout = async () => {
  if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
    await authStore.logout();
    router.push({ name: 'login' });
  }
};
</script>

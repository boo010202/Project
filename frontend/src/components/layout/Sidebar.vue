<template>
  <aside class="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen sticky top-0">
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center px-6 border-b border-slate-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="font-bold text-white tracking-wide text-lg">e-Utilities</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      <router-link 
        to="/" 
        class="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200"
        :class="isActive('/') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 font-medium' : 'hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
        <span>แดชบอร์ด</span>
      </router-link>

      <router-link 
        to="/expenses" 
        class="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200"
        :class="isActive('/expenses') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 font-medium' : 'hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span>รายการค่าใช้จ่าย</span>
      </router-link>

      <router-link 
        to="/reports" 
        class="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200"
        :class="isActive('/reports') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 font-medium' : 'hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-10v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
        </svg>
        <span>รายงานย้อนหลัง</span>
      </router-link>

      <!-- Admin Actions Section Header -->
      <div v-if="authStore.isAdmin" class="pt-6 pb-2 px-4">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">ส่วนผู้ดูแลระบบ</span>
      </div>

      <router-link 
        v-if="authStore.isAdmin"
        to="/settings/expense-categories" 
        class="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200"
        :class="isActive('/settings/expense-categories') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 font-medium' : 'hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>จัดการประเภทค่าใช้จ่าย</span>
      </router-link>

      <router-link 
        v-if="authStore.isAdmin"
        to="/settings/budget-categories" 
        class="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200"
        :class="isActive('/settings/budget-categories') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 font-medium' : 'hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 5h4a2 2 0 012 2v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
        <span>จัดการหมวดเงินงบประมาณ</span>
      </router-link>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-slate-800 flex items-center space-x-3">
      <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold text-emerald-400">
        {{ authStore.user?.full_name?.charAt(0) || 'U' }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate">{{ authStore.user?.full_name }}</p>
        <p class="text-xs text-slate-500 truncate capitalize">{{ authStore.userRole }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>

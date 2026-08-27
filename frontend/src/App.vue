<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
    <!-- Navbar -->
    <nav v-if="authStore.isAuthenticated" class="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-bold text-blue-400">⚡ e-Utilities Cost</h1>
        <div class="flex gap-4 text-sm">
          <router-link to="/" class="hover:text-blue-400 transition" active-class="text-blue-400 font-semibold">Dashboard</router-link>
          <router-link to="/expenses" class="hover:text-blue-400 transition" active-class="text-blue-400 font-semibold">รายการค่าใช้จ่าย</router-link>
          <router-link to="/categories" class="hover:text-blue-400 transition" active-class="text-blue-400 font-semibold">จัดการหมวดหมู่</router-link>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs bg-slate-700 px-3 py-1 rounded-full">👤 {{ authStore.user?.username || 'ผู้ใช้งาน' }}</span>
        <button @click="handleLogout" class="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg text-xs transition">
          ออกจากระบบ
        </button>
      </div>
    </nav>

    <!-- Main Content Dynamic View -->
    <main class="flex-1 max-w-[1280px] w-full mx-auto p-4 md:p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
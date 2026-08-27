<template>
  <div v-if="authStore.isAuthenticated" class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Desktop/Tablet Sidebar -->
    <Sidebar class="hidden md:flex no-print" />

    <!-- Mobile Menu -->
    <MobileMenu class="md:hidden no-print" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 print-content">
      <!-- Navbar -->
      <Navbar class="no-print" />
      
      <!-- Main Content Route -->
      <main class="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
        <router-view />
      </main>
    </div>
  </div>
  <div v-else class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import Sidebar from './components/layout/Sidebar.vue';
import Navbar from './components/layout/Navbar.vue';
import MobileMenu from './components/layout/MobileMenu.vue';

const authStore = useAuthStore();
</script>

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import CategoryManageView from '../views/CategoryManageView.vue';

const routes = [
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/categories', name: 'Categories', component: CategoryManageView, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
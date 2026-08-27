import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses',
    name: 'expenses-list',
    component: () => import('../views/ExpenseListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/create',
    name: 'expense-create',
    component: () => import('../views/ExpenseFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/:id/edit',
    name: 'expense-edit',
    component: () => import('../views/ExpenseFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/expense-categories',
    name: 'expense-categories',
    component: () => import('../views/CategoryManageView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/settings/budget-categories',
    name: 'budget-categories',
    component: () => import('../views/CategoryManageView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/ReportHistoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize user session on first load
  if (!authStore.initialized) {
    await authStore.initialize();
  }

  const isLoggedIn = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    return next({ name: 'login' });
  }

  if (to.meta.guestOnly && isLoggedIn) {
    // If route is guest-only and user is logged in, redirect to dashboard
    return next({ name: 'dashboard' });
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // If route requires admin role and user is not an admin, redirect to dashboard
    return next({ name: 'dashboard' });
  }

  next();
});

export default router;

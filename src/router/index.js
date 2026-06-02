import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Define navigation components
import Home from '../views/Home.vue';
import BlogDetail from '../views/BlogDetail.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/posts/:id',
        name: 'PostDetail',
        component: BlogDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guestOnly: true }
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    // fallback redirect
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

// Guard checks
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Attempt lazy load profile if token exists but no profile load completed yet
    if (authStore.token && !authStore.user) {
        try {
            await authStore.fetchProfile();
        } catch (err) {
            console.error("Token invalid, clearing state:", err);
            authStore.logout();
        }
    }

    const isAuthenticated = !!authStore.token;
    const isAdmin = authStore.user && authStore.user.isAdmin;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.meta.guestOnly && isAuthenticated) {
        next({ name: 'Home' });
    } else if (to.meta.requiresAdmin && !isAdmin) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;

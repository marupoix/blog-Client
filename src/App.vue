<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Clean Modern Navbar -->
    <nav class="navbar navbar-expand-lg py-3">
      <div class="container">
        <!-- Brand logo -->
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
          <i class="bi bi-journal-text fs-4 text-dark"></i>
          <span class="fw-bold tracking-tight text-dark" id="app-brand-title">BlogSpace</span>
        </router-link>

        <!-- Dynamic Mobile Toggle Icon -->
        <button 
          class="navbar-toggler border-0 p-1" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#blogNavbar" 
          aria-controls="blogNavbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <i class="bi bi-list fs-2 text-dark"></i>
        </button>

        <!-- Navbar routes -->
        <div class="collapse navbar-collapse" id="blogNavbar">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-2 mt-2 mt-lg-0">
            <template v-if="authStore.isAuthenticated">
              <li class="nav-item">
                <router-link to="/" class="nav-link text-dark px-3" active-class="fw-semibold">
                  <i class="bi bi-house-door me-1"></i> Home
                </router-link>
              </li>
              
              <li v-if="authStore.user?.isAdmin" class="nav-item">
                <router-link to="/admin" class="nav-link text-dark px-3" active-class="fw-semibold">
                  <i class="bi bi-shield-check me-1"></i> Admin Panel
                </router-link>
              </li>

              <li class="nav-item ms-lg-2">
                <span class="nav-link text-muted d-flex align-items-center gap-1 pe-lg-3 py-1">
                  <span :class="authStore.user?.isAdmin ? 'badge-admin' : 'badge-user'" id="user-role-badge">
                    {{ authStore.user?.isAdmin ? 'Admin' : 'User' }}
                  </span>
                  <strong class="text-dark">@{{ authStore.user?.username }}</strong>
                </span>
              </li>

              <li class="nav-item">
                <button @click="handleLogout" class="btn btn-sm btn-outline-danger px-3 rounded-pill" id="logout-btn">
                  <i class="bi bi-box-arrow-right me-1"></i> Log out
                </button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link to="/login" class="nav-link text-dark px-3" active-class="fw-semibold">
                  Log in
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/register" class="btn btn-sm btn-black px-4 rounded-pill">
                  Register
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Content Router View -->
    <main class="flex-grow-1 py-4 lg:py-5">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Modern Minimal Footer -->
    <footer class="bg-white border-top py-4 mt-auto">
      <div class="container text-center text-md-between d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div class="text-muted small">
          &copy; 2026 <strong>BlogSpace</strong>
        </div>
        <div class="d-flex align-items-center gap-3 text-muted small">
          <span><i class="bi bi-clock me-1"></i> 2026-06-01 UTC</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      authStore,
      handleLogout
    };
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

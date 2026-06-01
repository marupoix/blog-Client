<template>
  <div class="container py-4">
    <div class="row justify-content-center align-items-center" style="min-height: 65vh;">
      <div class="col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <!-- Login Card -->
        <div class="card shadow-sm border p-4 p-md-5 rounded-4 bg-white" id="login-card">
          <div class="text-center mb-4">
            <div class="d-inline-flex align-items-center justify-content-center bg-light text-dark rounded-circle mb-3 border style-icon" style="width: 56px; height: 56px;">
              <i class="bi bi-box-arrow-in-right fs-3"></i>
            </div>
            <h1 class="h3 fw-bold text-dark mb-1">Welcome Back</h1>
            <p class="text-secondary small">Sign in to read and publish incredible thoughts</p>
          </div>

          <form @submit.prevent="handleLogin" id="login-form">
            <!-- Email Input -->
            <div class="mb-3">
              <label for="login-email" class="form-label small fw-semibold text-secondary">Email Address</label>
              <div class="input-group">
                <span class="input-group-text bg-light text-secondary border-end-0"><i class="bi bi-envelope"></i></span>
                <input 
                  v-model="email" 
                  type="email" 
                  class="form-control ps-2 border-start-0 py-2 rounded-end-3" 
                  id="login-email" 
                  placeholder="name@example.com" 
                  required
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-4">
              <label for="login-password" class="form-label small fw-semibold text-secondary">Password</label>
              <div class="input-group">
                <span class="input-group-text bg-light text-secondary border-end-0"><i class="bi bi-lock"></i></span>
                <input 
                  v-model="password" 
                  type="password" 
                  class="form-control ps-2 border-start-0 py-2 rounded-end-3" 
                  id="login-password" 
                  placeholder="Enter your password" 
                  required
                />
              </div>
              <div class="text-end mt-1">
                <span class="text-muted small cursor-pointer" @click="fillDeveloperSecrets" title="Auto-fill credentials for speed evaluation">
                  <i class="bi bi-magic me-1 text-primary"></i> <span class="text-decoration-underline text-secondary">Auto-fill developer creds</span>
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="mb-4">
              <button 
                type="submit" 
                class="btn btn-black w-full d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 w-100" 
                :disabled="loading"
                id="login-submit-btn"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>{{ loading ? 'Securing Entry...' : 'Sign In' }}</span>
              </button>
            </div>

            <!-- Redirect link -->
            <div class="text-center mt-3">
              <p class="small text-secondary mb-0">
                New to BlogSpace? 
                <router-link to="/register" class="fw-semibold text-dark text-decoration-underline ms-1">Register instead</router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLoginForm } from '../hooks/useLoginForm';

export default {
  name: 'Login',
  setup() {
    const { email, password, loading, handleLogin, fillDeveloperSecrets } = useLoginForm();

    return {
      email,
      password,
      loading,
      handleLogin,
      fillDeveloperSecrets
    };
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

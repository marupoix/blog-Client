<template>
  <div class="container py-4">
    <div class="row justify-content-center align-items-center" style="min-height: 65vh;">
      <div class="col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <!-- Register Card -->
        <div class="card shadow-sm border p-4 p-md-5 rounded-4 bg-white" id="register-card">
          <div class="text-center mb-4">
            <div class="d-inline-flex align-items-center justify-content-center bg-light text-dark rounded-circle mb-3 border style-icon" style="width: 56px; height: 56px;">
              <i class="bi bi-person-plus fs-3"></i>
            </div>
            <h1 class="h3 fw-bold text-dark mb-1">Join BlogSpace</h1>
            <p class="text-secondary small">Create an account to participate in modern publication debates</p>
          </div>

          <form @submit.prevent="handleRegister" id="register-form">
            <!-- Username Input -->
            <div class="mb-3">
              <label for="reg-username" class="form-label small fw-semibold text-secondary">Username</label>
              <div class="input-group">
                <span class="input-group-text bg-light text-secondary border-end-0"><i class="bi bi-person"></i></span>
                <input 
                  v-model="username" 
                  type="text" 
                  class="form-control ps-2 border-start-0 py-2 rounded-end-3" 
                  id="reg-username" 
                  placeholder="e.g. johndoe" 
                  required
                />
              </div>
            </div>

            <!-- Email Input -->
            <div class="mb-3">
              <label for="reg-email" class="form-label small fw-semibold text-secondary">Email Address</label>
              <div class="input-group">
                <span class="input-group-text bg-light text-secondary border-end-0"><i class="bi bi-envelope"></i></span>
                <input 
                  v-model="email" 
                  type="email" 
                  class="form-control ps-2 border-start-0 py-2 rounded-end-3" 
                  id="reg-email" 
                  placeholder="name@example.com" 
                  required
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-3">
              <label for="reg-password" class="form-label small fw-semibold text-secondary">Password (min. 8 characters)</label>
              <div class="input-group">
                <span class="input-group-text bg-light text-secondary border-end-0"><i class="bi bi-lock"></i></span>
                <input 
                  v-model="password" 
                  type="password" 
                  class="form-control ps-2 border-start-0 py-2 rounded-end-3" 
                  id="reg-password" 
                  placeholder="Create a strong password" 
                  minlength="8" 
                  required
                />
              </div>
            </div>

            <!-- Admin Privilege Checkbox (Highly useful for testing admin CRUD tools) -->
            <div class="mb-4 bg-light p-3 rounded-3 border">
              <div class="form-check form-switch mb-0">
                <input 
                  v-model="isAdmin" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="reg-is-admin" 
                />
                <label class="form-check-label small fw-semibold text-dark cursor-pointer" for="reg-is-admin">
                  Grant Administrator access
                </label>
              </div>
              <div class="text-muted small mt-1" style="font-size: 0.75rem;">
                Toggle this switch to register as an administrator and test creating/editing/deleting blog posts.
              </div>
            </div>

            <!-- Submit Button -->
            <div class="mb-4">
              <button 
                type="submit" 
                class="btn btn-black w-full d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 w-100" 
                :disabled="loading"
                id="register-submit-btn"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>{{ loading ? 'Saving Profile...' : 'Confirm Registration' }}</span>
              </button>
            </div>

            <!-- Redirect link -->
            <div class="text-center mt-3">
              <p class="small text-secondary mb-0">
                Already registered? 
                <router-link to="/login" class="fw-semibold text-dark text-decoration-underline ms-1">Sign in instead</router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRegisterForm } from '../hooks/useRegisterForm';

export default {
  name: 'Register',
  setup() {
    const { username, email, password, isAdmin, loading, handleRegister } = useRegisterForm();

    return {
      username,
      email,
      password,
      isAdmin,
      loading,
      handleRegister
    };
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

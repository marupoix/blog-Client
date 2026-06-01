import { defineStore } from 'pinia';
import axios from 'axios';
import { Notyf } from 'notyf';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    ripple: false
});

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null,
        isLoading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.isAdmin || false
    },

    actions: {
        async register(username, email, password, isAdmin = false) {
            this.isLoading = true;
            try {
                const response = await axios.post('/users/register', {
                    username,
                    email,
                    password,
                    isAdmin
                });
                notyf.success(response.data.message || 'Registered successfully!');
                return true;
            } catch (error) {
                const message = error.response?.data?.error || 'Registration failed';
                notyf.error(message);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async login(email, password) {
            this.isLoading = true;
            try {
                const response = await axios.post('/users/login', {
                    email,
                    password
                });
                
                const token = response.data.access;
                if (!token) {
                    throw new Error('No access token received');
                }

                this.token = token;
                localStorage.setItem('token', token);
                
                // Fetch profile details immediately
                await this.fetchProfile();
                notyf.success('Logged in successfully!');
                return true;
            } catch (error) {
                const message = error.response?.data?.error || 'Invalid credentials';
                notyf.error(message);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchProfile() {
            if (!this.token) return;
            
            try {
                const response = await axios.get('/users/get-profile', {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });
                this.user = response.data.user;
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                this.logout();
                throw error;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            notyf.success('Logged out successfully');
        }
    }
});

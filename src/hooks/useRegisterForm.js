import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    ripple: false
});

export function useRegisterForm() {
    const authStore = useAuthStore();
    const router = useRouter();

    const username = ref('');
    const email = ref('');
    const password = ref('');
    const isAdmin = ref(false);
    const loading = ref(false);

    const handleRegister = async () => {
        if (password.value.length < 8) {
            notyf.error("Password must be at least 8 characters");
            return;
        }

        loading.value = true;
        try {
            const success = await authStore.register(username.value, email.value, password.value, isAdmin.value);
            if (success) {
                router.push('/login');
            }
        } catch (err) {
            console.error('Registration failed in hook:', err);
        } finally {
            loading.value = false;
        }
    };

    return {
        username,
        email,
        password,
        isAdmin,
        loading,
        handleRegister
    };
}

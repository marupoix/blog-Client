import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export function useLoginForm() {
    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
        loading.value = true;
        try {
            const success = await authStore.login(email.value, password.value);
            if (success) {
                router.push('/');
            }
        } catch (err) {
            console.error('Login action rejected in hook:', err);
        } finally {
            loading.value = false;
        }
    };

    const fillDeveloperSecrets = () => {
        email.value = 'admin@blog.com';
        password.value = 'admin123';
    };

    return {
        email,
        password,
        loading,
        handleLogin,
        fillDeveloperSecrets
    };
}

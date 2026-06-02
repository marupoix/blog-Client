import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    ripple: false
});

export function useBlogs() {
    const authStore = useAuthStore();
    const router = useRouter();
    const blogs = ref([]);
    const loading = ref(true);

    const fetchBlogs = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/posts/getBlogs', {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            blogs.value = response.data;
        } catch (error) {
            console.error('Error fetching blogs in useBlogs hook:', error);
            notyf.error('Unable to fetch blogs.');
        } finally {
            loading.value = false;
        }
    };

    const creating = ref(false);
    const updating = ref(false);

    const createBlog = async (title, content) => {
        creating.value = true;
        try {
            await axios.post('/posts/addBlog', {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            notyf.success('Blog created successfully!');
            await fetchBlogs();
            return true;
        } catch (error) {
            console.error('Error creating blog in useBlogs hook:', error);
            notyf.error(error.response?.data?.error || 'Failed to create blog.');
            return false;
        } finally {
            creating.value = false;
        }
    };

    const updateBlog = async (id, title, content) => {
        updating.value = true;
        try {
            await axios.patch(`/posts/updateBlog/${id}`, {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            notyf.success('Blog updated successfully!');
            await fetchBlogs();
            return true;
        } catch (error) {
            console.error('Error updating blog in useBlogs hook:', error);
            notyf.error(error.response?.data?.error || 'Failed to update blog.');
            return false;
        } finally {
            updating.value = false;
        }
    };

    const deletePost = async (id) => {
        if (!confirm('Are you absolutely sure you want to delete this blog post?')) return;
        try {
            await axios.delete(`/posts/deleteBlog/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            notyf.success('Blog deleted successfully');
            await fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog in useBlogs hook:', error);
            notyf.error(error.response?.data?.error || 'Failed to delete blog.');
        }
    };

    const triggerEdit = (blog) => {
        localStorage.setItem('editBlogId', blog._id);
        router.push('/admin');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'May 2026';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return {
        blogs,
        loading,
        creating,
        updating,
        fetchBlogs,
        createBlog,
        updateBlog,
        deletePost,
        triggerEdit,
        formatDate
    };
}

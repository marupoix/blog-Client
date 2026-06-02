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

export function useBlogDetail(blogId) {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const blog = ref(null);
    const comments = ref([]);
    const loading = ref(true);
    const newComment = ref('');
    const submitting = ref(false);

    const loadBlog = async () => {
        loading.value = true;
        try {
            const response = await axios.get(`/posts/getBlog/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            blog.value = response.data;
            comments.value = response.data.comments || [];
        } catch (error) {
            console.error('Error fetching blog details in useBlogDetail hook:', error);
            notyf.error('Error loading blog content');
        } finally {
            loading.value = false;
        }
    };

    const submitComment = async () => {
        if (!newComment.value.trim()) return;
        submitting.value = true;
        try {
            await axios.patch(`/posts/addComment/${blogId}`, {
                comment: newComment.value
            }, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            
            notyf.success('Comment published successfully!');
            
            // Append comment locally for reactive immediate feedback
            comments.value.push({
                userId: authStore.user._id,
                username: authStore.user.username,
                comment: newComment.value
            });
            
            newComment.value = '';
        } catch (error) {
            console.error('Error adding comment in useBlogDetail hook:', error);
            notyf.error('Failed to post comment.');
        } finally {
            submitting.value = false;
        }
    };

    const deletePost = async () => {
        if (!confirm('Are you absolutely sure you want to delete this blog post? This action is permanent.')) return;
        try {
            await axios.delete(`/posts/deleteBlog/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            notyf.success('Blog deleted successfully');
            router.push('/');
        } catch (error) {
            console.error('Error deleting blog in useBlogDetail hook:', error);
            notyf.error(error.response?.data?.error || 'Failed to delete blog.');
        }
    };

    const formatDate = (dateString, withTime = false) => {
        if (!dateString) return 'May 2026';
        const date = new Date(dateString);
        if (withTime) {
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return {
        blog,
        comments,
        loading,
        newComment,
        submitting,
        loadBlog,
        submitComment,
        deletePost,
        formatDate
    };
}

import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { Notyf } from 'notyf';

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    ripple: false
});

export function useAdminForm(onSuccess) {
    const authStore = useAuthStore();
    
    // Form fields
    const title = ref('');
    const content = ref('');
    const isEditing = ref(false);
    const editBlogId = ref(null);
    const submitting = ref(false);

    const saveBlogPost = async () => {
        submitting.value = true;
        try {
            if (isEditing.value) {
                // Update action
                await axios.patch(`/posts/updateBlog/${editBlogId.value}`, {
                    title: title.value,
                    content: content.value
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                notyf.success('Publication updated successfully!');
                cancelEdit();
            } else {
                // Create action
                await axios.post('/posts/addBlog', {
                    title: title.value,
                    content: content.value
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                notyf.success('New blog post published successfully!');
                title.value = '';
                content.value = '';
            }
            if (onSuccess) {
                await onSuccess();
            }
        } catch (error) {
            console.error('Save blog error in useAdminForm hook:', error);
            notyf.error(error.response?.data?.error || 'Database operation failed');
        } finally {
            submitting.value = false;
        }
    };

    const editPostDirect = (blog) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        title.value = blog.title;
        content.value = blog.content;
        isEditing.value = true;
        editBlogId.value = blog._id;
        notyf.success(`Loaded "${blog.title.slice(0, 20)}..." for editing`);
    };

    const cancelEdit = () => {
        title.value = '';
        content.value = '';
        isEditing.value = false;
        editBlogId.value = null;
    };

    return {
        title,
        content,
        isEditing,
        editBlogId,
        submitting,
        saveBlogPost,
        editPostDirect,
        cancelEdit
    };
}

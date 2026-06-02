<template>
  <div class="container py-2">
    <!-- Header Hero Area -->
    <div class="row mb-5 align-items-center">
      <div class="col-lg-8">
        <h1 class="display-5 fw-bold text-dark mb-2">Thoughts, stories and ideas.</h1>
        <p class="text-secondary lead fs-6">
          Welcome to <span class="fw-semibold text-dark">BlogSpace</span>. Explore insights and contributions shared by standard users and administrators alike.
        </p>
      </div>
      <div v-if="authStore.user" class="col-lg-4 text-lg-end mt-3 mt-lg-0">
        <button @click="handleNewPublicationClick" class="btn btn-black rounded-pill shadow-sm" id="new-publication-btn">
          <i class="bi bi-plus-lg me-1"></i> New Publication
        </button>
      </div>
    </div>

    <!-- Main Content Loader -->
    <div v-if="loading" class="text-center my-5 py-5">
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading blogs...</span>
      </div>
      <p class="text-secondary mt-3">Fetching standard articles...</p>
    </div>

    <div v-else>
      <div v-if="blogs.length === 0" class="text-center py-5 shadow-sm rounded-4 bg-white border border-light-subtle my-5">
        <i class="bi bi-file-post fs-1 text-muted h1 d-block mb-3"></i>
        <div class="fw-semibold text-dark fs-5">No posts available yet</div>
        <p class="text-secondary mb-4">Be the first to ask the admin to publish something amazing!</p>
        <router-link v-if="authStore.user?.isAdmin" to="/admin" class="btn btn-sm btn-black px-4 rounded-pill">
          Write first post
        </router-link>
      </div>

      <div v-else class="row g-4">
        <!-- Main blog feed feed loop -->
        <div v-for="blog in blogs" :key="blog._id" class="col-md-6 col-lg-4">
          <BlogPostCard 
            :blog="blog" 
            :isAdmin="authStore.user?.isAdmin" 
            @edit="handleEditClick" 
            @delete="deletePost" 
          />
        </div>
      </div>
    </div>

    <!-- Create Modal for Regular Users -->
    <div v-if="showCreateModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center" @click.self="closeModal" id="create-blog-modal">
      <div class="modal-content-custom bg-white border rounded-4 p-4 shadow-lg position-relative">
        <!-- Close button top-right -->
        <button @click="closeModal" class="btn-close-custom border-0 bg-transparent text-secondary position-absolute" style="top: 1.5rem; right: 1.5rem;" id="close-create-modal-btn">
          <i class="bi bi-x-lg fs-5"></i>
        </button>

        <h3 class="h4 text-dark mb-3">
          <i class="bi bi-plus-circle text-dark me-2"></i> New Publication
        </h3>
        <p class="text-secondary small mb-4">Share your thoughts and ideas with the community.</p>

        <form @submit.prevent="handleCreateBlog" id="modal-create-blog-form">
          <!-- Title field -->
          <div class="mb-3">
            <label for="modal-create-post-title" class="form-label small fw-semibold text-secondary">Post Title</label>
            <input 
              v-model="createTitle" 
              type="text" 
              class="form-control rounded-3 py-2 custom-input" 
              id="modal-create-post-title" 
              placeholder="Enter a compelling title..." 
              required 
            />
          </div>

          <!-- Content field -->
          <div class="mb-4">
            <label for="modal-create-post-content" class="form-label small fw-semibold text-secondary">Article Content</label>
            <textarea 
              v-model="createContent" 
              class="form-control rounded-3 custom-input" 
              id="modal-create-post-content" 
              rows="6" 
              placeholder="Write your article body content here..." 
              required
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-end gap-2 pt-2 border-top">
            <button 
              type="button" 
              class="btn btn-sm btn-outline-black px-4 rounded-pill" 
              @click="closeModal"
              :disabled="creating"
              id="cancel-create-modal-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-sm btn-black px-4 rounded-pill d-flex align-items-center gap-2" 
              :disabled="creating"
              id="submit-create-modal-btn"
            >
              <span v-if="creating" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Publish Article
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal for Regular Users -->
    <div v-if="showEditModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center" @click.self="closeModal" id="edit-blog-modal">
      <div class="modal-content-custom bg-white border rounded-4 p-4 shadow-lg position-relative">
        <!-- Close button top-right -->
        <button @click="closeModal" class="btn-close-custom border-0 bg-transparent text-secondary position-absolute" style="top: 1.5rem; right: 1.5rem;" id="close-edit-modal-btn">
          <i class="bi bi-x-lg fs-5"></i>
        </button>

        <h3 class="h4 text-dark mb-3">
          <i class="bi bi-pencil-square text-dark me-2"></i> Edit Publication
        </h3>
        <p class="text-secondary small mb-4">You are updating the article content as a community member.</p>

        <form @submit.prevent="handleUpdateBlog" id="modal-edit-blog-form">
          <!-- Title field -->
          <div class="mb-3">
            <label for="modal-edit-post-title" class="form-label small fw-semibold text-secondary">Post Title</label>
            <input 
              v-model="editTitle" 
              type="text" 
              class="form-control rounded-3 py-2 custom-input" 
              id="modal-edit-post-title" 
              placeholder="Enter a compelling title..." 
              required 
            />
          </div>

          <!-- Content field -->
          <div class="mb-4">
            <label for="modal-edit-post-content" class="form-label small fw-semibold text-secondary">Article Content</label>
            <textarea 
              v-model="editContent" 
              class="form-control rounded-3 custom-input" 
              id="modal-edit-post-content" 
              rows="6" 
              placeholder="Write your article body content here..." 
              required
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-end gap-2 pt-2 border-top">
            <button 
              type="button" 
              class="btn btn-sm btn-outline-black px-4 rounded-pill" 
              @click="closeModal"
              :disabled="updating"
              id="cancel-edit-modal-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-sm btn-black px-4 rounded-pill d-flex align-items-center gap-2" 
              :disabled="updating"
              id="submit-edit-modal-btn"
            >
              <span v-if="updating" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBlogs } from '../hooks/useBlogs';
import BlogPostCard from '../components/BlogPostCard.vue';

export default {
  name: 'Home',
  components: {
    BlogPostCard
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const { 
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
    } = useBlogs();

    // Create Modal state
    const showCreateModal = ref(false);
    const createTitle = ref('');
    const createContent = ref('');

    // Edit Modal state
    const showEditModal = ref(false);
    const editBlogId = ref(null);
    const editTitle = ref('');
    const editContent = ref('');

    const handleNewPublicationClick = () => {
      if (authStore.user?.isAdmin) {
        router.push('/admin');
      } else {
        createTitle.value = '';
        createContent.value = '';
        showCreateModal.value = true;
      }
    };

    const handleEditClick = (blog) => {
      if (authStore.user?.isAdmin) {
        triggerEdit(blog);
      } else {
        editBlogId.value = blog._id;
        editTitle.value = blog.title;
        editContent.value = blog.content;
        showEditModal.value = true;
      }
    };

    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      createTitle.value = '';
      createContent.value = '';
      editBlogId.value = null;
      editTitle.value = '';
      editContent.value = '';
    };

    const handleCreateBlog = async () => {
      const success = await createBlog(createTitle.value, createContent.value);
      if (success) {
        closeModal();
      }
    };

    const handleUpdateBlog = async () => {
      if (!editBlogId.value) return;
      const success = await updateBlog(editBlogId.value, editTitle.value, editContent.value);
      if (success) {
        closeModal();
      }
    };

    onMounted(() => {
      fetchBlogs();
    });

    return {
      authStore,
      blogs,
      loading,
      creating,
      updating,
      showCreateModal,
      createTitle,
      createContent,
      showEditModal,
      editTitle,
      editContent,
      deletePost,
      triggerEdit,
      handleNewPublicationClick,
      handleEditClick,
      closeModal,
      handleCreateBlog,
      handleUpdateBlog,
      formatDate
    };
  }
}
</script>

<style scoped>
.mb-text-limit {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom premium modal animations and glassmorphism styling */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(17, 17, 17, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1050;
  animation: fadeIn 0.25s ease-out;
}

.modal-content-custom {
  width: 90%;
  max-width: 550px;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
  transform: scale(0.95);
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.btn-close-custom {
  font-size: 1.2rem;
  transition: color 0.15s ease, transform 0.15s ease;
  cursor: pointer;
}
.btn-close-custom:hover {
  color: #111 !important;
  transform: rotate(90deg);
}

.custom-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
.custom-input:focus {
  border-color: #111111;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

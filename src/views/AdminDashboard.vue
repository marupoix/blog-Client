<template>
  <div class="container py-2">
    <!-- Header -->
    <div class="mb-5">
      <h1 class="display-6 fw-bold text-dark mb-1">
        <i class="bi bi-shield-lock me-2 text-secondary"></i> Administrator Control Center
      </h1>
      <p class="text-secondary mb-0">Create new publications, edit existing articles, or prune comments and content.</p>
    </div>

    <div class="row g-4">
      <!-- Left Column: Create/Edit Form -->
      <div class="col-lg-5">
        <div class="card p-4 shadow-sm border rounded-4 bg-white sticky-lg-top" style="top: 100px; z-index: 10;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h5 fw-bold text-dark mb-0">
              <i class="bi me-2" :class="isEditing ? 'bi-pencil-square text-primary' : 'bi-journal-plus text-success'"></i>
              {{ isEditing ? 'Edit Publication' : 'Write New Publication' }}
            </h2>
            <button v-if="isEditing" @click="cancelEdit" class="btn btn-sm btn-link text-danger text-decoration-none p-0" id="cancel-edit-btn">
              Cancel Edit <i class="bi bi-x-circle ms-1"></i>
            </button>
          </div>

          <form @submit.prevent="saveBlogPost" id="admin-blog-form">
            <!-- Title Input -->
            <div class="mb-3">
              <label for="post-title" class="form-label small fw-semibold text-secondary">Post Title</label>
              <input 
                v-model="title" 
                type="text" 
                class="form-control rounded-3 py-2" 
                id="post-title" 
                placeholder="Enter a compelling title..." 
                required 
              />
            </div>

            <!-- Content Area -->
            <div class="mb-4">
              <label for="post-content" class="form-label small fw-semibold text-secondary">Article Markdown / Text Content</label>
              <textarea 
                v-model="content" 
                class="form-control rounded-3" 
                id="post-content" 
                rows="8" 
                placeholder="Write your article body content here..." 
                required
              ></textarea>
            </div>

            <!-- Submit Action -->
            <div>
              <button 
                type="submit" 
                class="btn btn-black w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
                :disabled="submitting"
                id="save-post-btn"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-send-fill small"></i>
                {{ submitting ? 'Saving Publication...' : (isEditing ? 'Apply Changes' : 'Publish Article') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Column: Quick Publication Management List -->
      <div class="col-lg-7">
        <div class="card p-4 shadow-sm border rounded-4 bg-white">
          <h2 class="h5 fw-bold text-dark mb-4">
            <i class="bi bi-database-check me-2 text-secondary"></i> All Publications ({{ blogs.length }})
          </h2>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-dark spinner-border-sm" role="status"></div>
            <p class="text-secondary small mt-3">Synthesizing list details...</p>
          </div>

          <div v-else>
            <div v-if="blogs.length === 0" class="text-center py-5 bg-light rounded-4 border">
              <i class="bi bi-file-post fs-2 text-muted h2 d-block mb-2"></i>
              <p class="text-secondary sm-0">No active posts are registered in the index.</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle table-hover mb-0" id="admin-publications-table">
                <thead>
                  <tr class="text-secondary small fw-bold">
                    <th scope="col" class="border-0 pb-3" style="width: 55%;">Title</th>
                    <th scope="col" class="border-0 pb-3" style="width: 20%;">Date created</th>
                    <th scope="col" class="border-0 pb-3 text-end" style="width: 25%;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="blog in blogs" :key="blog._id" class="border-bottom" id="admin-publications-row">
                    <td>
                      <div class="fw-semibold text-dark truncate-title">{{ blog.title }}</div>
                      <div class="text-muted small" style="font-size: 0.75rem;">
                        by @{{ blog.authorName || 'admin' }} &middot; {{ blog.comments?.length || 0 }} comments
                      </div>
                    </td>
                    <td>
                      <span class="text-secondary small" style="font-size: 0.8rem;">
                        {{ formatDate(blog.createdOn) }}
                      </span>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button 
                          @click="editPostDirect(blog)" 
                          class="btn btn-outline-dark" 
                          id="edit-publication-btn"
                          title="Edit"
                        >
                          <i class="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          @click="deletePost(blog._id)" 
                          class="btn btn-outline-danger" 
                          id="delete-publication-btn"
                          title="Delete"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useBlogs } from '../hooks/useBlogs';
import { useAdminForm } from '../hooks/useAdminForm';

export default {
  name: 'AdminDashboard',
  setup() {
    const { 
      blogs, 
      loading, 
      fetchBlogs, 
      deletePost, 
      formatDate 
    } = useBlogs();

    const {
      title,
      content,
      isEditing,
      editBlogId,
      submitting,
      saveBlogPost,
      editPostDirect,
      cancelEdit
    } = useAdminForm(fetchBlogs);

    const handleAdminDelete = async (id) => {
      await deletePost(id);
      if (isEditing.value && editBlogId.value === id) {
        cancelEdit();
      }
    };

    onMounted(async () => {
      await fetchBlogs();
      // Check if there is an editBlogId active from other screens
      const pendingEditId = localStorage.getItem('editBlogId');
      if (pendingEditId) {
        localStorage.removeItem('editBlogId'); // Consume it
        const pendingBlog = blogs.value.find(b => b._id === pendingEditId);
        if (pendingBlog) {
          editPostDirect(pendingBlog);
        }
      }
    });

    return {
      blogs,
      loading,
      title,
      content,
      isEditing,
      submitting,
      saveBlogPost,
      editPostDirect,
      cancelEdit,
      deletePost: handleAdminDelete,
      formatDate
    };
  }
}
</script>

<style scoped>
.truncate-title {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

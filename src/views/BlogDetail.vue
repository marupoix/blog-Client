<template>
  <div class="container py-2">
    <!-- Back to Feed link -->
    <div class="mb-4">
      <router-link to="/" class="btn btn-sm btn-outline-black rounded-pill">
        <i class="bi bi-arrow-left me-1"></i> Back to feed
      </router-link>
    </div>

    <!-- Main post rendering loader -->
    <div v-if="loading" class="text-center my-5 py-5">
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading post details...</span>
      </div>
      <p class="text-secondary mt-3">Gathering full-text content...</p>
    </div>

    <div v-else-if="!blog" class="text-center py-5 shadow-sm rounded-4 bg-white border border-light-subtle my-5">
      <i class="bi bi-slash-circle fs-1 text-danger h1 d-block mb-3"></i>
      <h2 class="h4 text-dark mb-2">Blog Post Not Found</h2>
      <p class="text-secondary mb-4">The article you are trying to view has been deleted or does not exist.</p>
      <router-link to="/" class="btn btn-sm btn-black px-4 rounded-pill">Return Home</router-link>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Inside Single Blog View -->
        <article class="bg-white border rounded-4 p-4 p-md-5 shadow-sm mb-5" id="blog-content-container">
          
          <!-- Creation date -->
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-light text-dark border small py-1 px-2 rounded">
              <i class="bi bi-calendar-event me-1 text-secondary"></i> {{ formatDate(blog.createdOn) }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="display-6 fw-bold text-dark mb-4">{{ blog.title }}</h1>

          <!-- Author Info Banner -->
          <div class="p-3 bg-light rounded-3 d-flex align-items-center gap-3 mb-4 border" id="author-info-banner">
            <div class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold fs-5" style="width: 44px; height: 44px;">
              {{ (blog.authorName || 'D')[0].toUpperCase() }}
            </div>
            <div>
              <div class="small text-muted mb-0">Article Author</div>
              <div class="fw-bold text-dark mb-0 fs-6">{{ blog.authorName || 'Developer' }}</div>
              <div class="small text-secondary" style="font-size: 0.8rem;">{{ blog.authorEmail || 'author@blog.com' }}</div>
            </div>
          </div>

          <!-- Blog Content Body -->
          <div class="text-dark fs-6 lh-lg mb-4" style="white-space: pre-wrap; font-weight: 300;">
            {{ blog.content }}
          </div>

          <!-- Action buttons for Admins -->
          <div v-if="authStore.user?.isAdmin" class="d-flex align-items-center gap-2 border-top pt-4">
            <button @click="triggerEdit" class="btn btn-sm btn-black px-3 rounded-pill">
              <i class="bi bi-pencil-square me-1"></i> Edit Publication
            </button>
            <button @click="deletePost" class="btn btn-sm btn-outline-danger px-3 rounded-pill">
              <i class="bi bi-trash me-1"></i> Delete Publication
            </button>
          </div>
        </article>

        <!-- Comments Section -->
        <section class="bg-white border rounded-4 p-4 p-md-5 shadow-sm mb-5" id="comments-section-container">
          <h2 class="h4 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <i class="bi bi-chat-left-text text-secondary"></i> 
            Comments <span class="badge bg-secondary rounded-pill fs-6 py-1 px-2">{{ comments.length }}</span>
          </h2>

          <!-- Add custom Comment section form (for all users) -->
          <div class="mb-5">
            <h3 class="h6 fw-bold text-dark mb-3">Share your perspective</h3>
            <form @submit.prevent="submitComment">
              <div class="mb-3">
                <textarea 
                  v-model="newComment" 
                  class="form-control rounded-3" 
                  rows="3" 
                  placeholder="Join the discussion... Type your comment here."
                  id="comment-textarea"
                  required
                ></textarea>
              </div>
              <div class="text-end">
                <button 
                  type="submit" 
                  class="btn btn-sm btn-black px-4 rounded-pill" 
                  :disabled="submitting || !newComment.trim()"
                  id="submit-comment-btn"
                >
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          <!-- Display all loaded comments dynamically -->
          <div v-if="comments.length === 0" class="text-center py-4 bg-light rounded-3 border">
            <p class="text-secondary mb-0 py-2">No comments posted yet. Start the conversation!</p>
          </div>

          <div v-else class="d-flex flex-column gap-3">
            <CommentItem 
              v-for="(comment, index) in comments" 
              :key="index" 
              :comment="comment" 
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useBlogDetail } from '../hooks/useBlogDetail';
import CommentItem from '../components/CommentItem.vue';

export default {
  name: 'BlogDetail',
  components: {
    CommentItem
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    
    const blogId = route.params.id;
    const { 
      blog, 
      comments, 
      loading, 
      newComment, 
      submitting, 
      loadBlog, 
      submitComment, 
      deletePost, 
      formatDate 
    } = useBlogDetail(blogId);

    const triggerEdit = () => {
      localStorage.setItem('editBlogId', blogId);
      router.push('/admin');
    };

    onMounted(() => {
      loadBlog();
    });

    return {
      authStore,
      blog,
      comments,
      loading,
      newComment,
      submitting,
      submitComment,
      deletePost,
      triggerEdit,
      formatDate
    };
  }
}
</script>

<style scoped>
.comment-box {
  border-top: none;
}
</style>

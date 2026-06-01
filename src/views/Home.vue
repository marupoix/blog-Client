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
      <div v-if="authStore.user?.isAdmin" class="col-lg-4 text-lg-end mt-3 mt-lg-0">
        <router-link to="/admin" class="btn btn-black rounded-pill shadow-sm">
          <i class="bi bi-plus-lg me-1"></i> New Publication
        </router-link>
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
        <!-- Main blog feed loop -->
        <div v-for="blog in blogs" :key="blog._id" class="col-md-6 col-lg-4">
          <BlogPostCard 
            :blog="blog" 
            :isAdmin="authStore.user?.isAdmin" 
            @edit="triggerEdit" 
            @delete="deletePost" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
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
    const { blogs, loading, fetchBlogs, deletePost, triggerEdit, formatDate } = useBlogs();

    onMounted(() => {
      fetchBlogs();
    });

    return {
      authStore,
      blogs,
      loading,
      deletePost,
      triggerEdit,
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
</style>

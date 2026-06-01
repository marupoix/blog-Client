<template>
  <div class="card h-100 card-hover p-4 d-flex flex-column" id="blog-post-card">
    <!-- Header Author Details -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center gap-2">
        <div class="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary fw-semibold border" style="width: 36px; height: 36px;">
          {{ (blog.authorName || 'D')[0].toUpperCase() }}
        </div>
        <div>
          <div class="fw-semibold small text-dark mb-0 line-clamp-1">
            {{ blog.authorName || 'Developer' }}
          </div>
          <div class="text-muted small" style="font-size: 0.75rem;">
            {{ blog.authorEmail || 'author@blog.com' }}
          </div>
        </div>
      </div>
      <span class="small text-muted" style="font-size: 0.8rem;">{{ formatDate(blog.createdOn) }}</span>
    </div>

    <!-- Title of the Post -->
    <h3 class="card-title h5 text-dark fw-bold mb-3 mb-text-limit">
      {{ blog.title }}
    </h3>
    
    <!-- Short excerpt -->
    <p class="card-text text-secondary mb-4 line-clamp-3 small flex-grow-1">
      {{ blog.content }}
    </p>

    <!-- Footer of the card showing Actions and details like comments and link -->
    <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light-subtle">
      <router-link :to="'/blog/' + blog._id" class="btn btn-sm btn-outline-black px-3 rounded-pill" id="read-post-btn-ref">
        Read Post <i class="bi bi-arrow-right ms-1"></i>
      </router-link>

      <div class="d-flex align-items-center gap-3">
        <!-- Modern Bubble showing count of Comments -->
        <span class="d-flex align-items-center gap-1 text-secondary small bg-light px-2 py-1 rounded border" style="font-size: 0.8rem;" title="Comments Count">
          <i class="bi bi-chat-text text-muted"></i>
          <strong>{{ blog.comments ? blog.comments.length : 0 }}</strong>
        </span>

        <!-- Quick actions toolbar for Administrators -->
        <div v-if="isAdmin" class="d-flex align-items-center gap-1 border-start ps-2">
          <button @click="$emit('edit', blog)" class="btn btn-sm btn-outline-dark border-0 p-1" title="Edit Post" id="edit-post-action-btn">
            <i class="bi bi-pencil-square text-secondary"></i>
          </button>
          <button @click="$emit('delete', blog._id)" class="btn btn-sm btn-outline-danger border-0 p-1" title="Delete Post" id="delete-post-action-btn">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPostCard',
  props: {
    blog: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete'],
  setup() {
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

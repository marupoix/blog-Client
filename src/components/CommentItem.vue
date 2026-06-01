<template>
  <div class="comment-box mb-3 p-3 bg-light border rounded-3" id="blog-comment-item">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex align-items-center gap-2">
        <div class="rounded-circle bg-dark text-white fw-semibold small d-flex align-items-center justify-content-center" style="width: 25px; height: 25px; font-size: 0.75rem;">
          {{ (comment.username || 'U')[0].toUpperCase() }}
        </div>
        <strong class="text-dark small">@{{ comment.username }}</strong>
      </div>
      <span class="small text-muted" style="font-size: 0.75rem;">
        <i class="bi bi-check-circle-fill text-success small me-1"></i> Verified
      </span>
    </div>
    <p class="mb-0 text-secondary small" style="white-space: pre-wrap; font-weight: 300;">{{ comment.comment }}</p>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.comment-box {
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.15s ease;
}
.comment-box:hover {
  background-color: #f1f3f5 !important;
}
</style>

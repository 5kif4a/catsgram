<template>
  <div class="post__comment">
    <div class="post__comment__avatar">
      <v-avatar
        size="32px"
        style="border: 2px solid #dbdbdb;"
      >
        <img :src="user_avatar">
      </v-avatar>
    </div>

    <p class="post__comment__content">
      <strong>
        {{ username }}
      </strong>
      {{ content }}
    </p>
  </div>
</template>

<script>
export default {
  name: "PostComment",
  props: [
    'username',
    'user_avatar',
    'content'
  ]
}
</script>

<style scoped>
.post__comment {
  font-size: 14px;
  line-height: 16px;
  display: flex;
  margin-bottom: 16px;
}

.post__comment__avatar {
  margin-right: 6px;
}

.post__comment__content {
  text-align: justify;
}
</style>
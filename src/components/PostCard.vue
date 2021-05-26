<template>
  <router-link :to="{ name: 'PostDetail', params: { post_id: post.id }}">
    <div class="post_card">
      <img :src="post.image_url">

      <div class="post_card__info">
        <div>
          {{ post.likes }}
          <v-icon>mdi-heart</v-icon>
        </div>
        <div>
          {{ comments_count }}
          <v-icon>mdi-comment</v-icon>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "PostCard",
  props: ['post'],
  computed: {
    comments_count() {
      let count = 0

      if (this.post?.comments) {
        count = Object.keys(this.post.comments).length
      }

      return count
    }
  }
}
</script>

<style scoped>
.post_card {
  width: 300px;
  height: 300px;
  position: relative;
  border: 1px solid #dbdbdb;
}

.post_card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.post_card__info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
}

.post_card__info div {
  margin-right: 8px;
}

.post_card:hover > .post_card__info {
  background: rgba(0, 0, 0, .3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
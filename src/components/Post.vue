<template>
  <div class="post">
    <div class="post__header">
      <v-avatar
        class="post__header__avatar"
        size="24"
      >
        <img :src="post.user_avatar">

      </v-avatar>
      <p class="post__header__username">
        <strong>
          <router-link
            :to="{name: 'Profile', params: {user_id: post.user_id}}"
          >
            {{ post.username }}
          </router-link>
        </strong>
      </p>
    </div>
    <div class="post__content">
      <div
        v-if="image_loader"
        class="post__content__loader">
        <loader></loader>
      </div>

      <img
        :src="post.image_url"
        class="post__content__img"
        @load="onImageLoad">
    </div>

    <div class="post__controls">
      <v-icon
        class="post__controls__like"
        @click="putLike"
      >
        {{ liked ? "mdi-heart" : "mdi-heart-outline" }}
      </v-icon>
      <v-icon
        class="post__controls__comment"
        @click="leaveComment"
      >
        mdi-comment-outline
      </v-icon>
    </div>

    <div class="post__info">
      <p v-if="likes">
        <strong>{{ likes }}</strong> likes
      </p>

      <p class="post__info__body">
        <strong>
          <router-link
            :to="{name: 'Profile', params: {user_id: post.user_id}}"
            class="post__info__body__user_link"
          >
            {{ post.username }}
          </router-link>
        </strong>
        {{ post.body }}
      </p>

      <div
        class="post__info__comment"
        v-for="comment in post?.comments"
        :key="comment.createdAt"
      >
        <p>
          <strong>
            <router-link
              :to="{name: 'Profile', params: {user_id: post.user_id}}"
              class="post__info__comment__user_link"
            >
              {{ post.username }}
            </router-link>
          </strong>
          {{ comment.content }}
        </p>
      </div>

      <p class="post__info__date">{{ date }}</p>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {db} from "../firebase";
import toastr from 'toastr'
import Loader from "./Loader";
import {format} from "date-fns";

export default {
  name: "Post",
  components: {Loader},
  props: [
    'post'
  ],
  data() {
    return {
      image_loader: true,
      liked: false,
      likes: this.$props.post.likes,
      date: null
    }
  },
  computed: mapState({
    current_user_id: state => state.user?.uid,
    isAuthenticated: state => state.isAuthenticated,

  }),
  watch: {
    isAuthenticated: function () {
      this.liked = this.$props.post.liked?.includes(this.current_user_id)
    }
  },
  methods: {
    onImageLoad() {
      this.image_loader = false
    },
    putLike() {
      if (!this.isAuthenticated) {
        toastr.warning('You are not logged in')
        return;
      }

      if (!this.liked) {

        const postRef = db.ref('/posts/' + this.$props.post.id)
        const current_user_id = this.current_user_id

        postRef
          .once('value')
          .then(snapshot => {
            const prevPostData = snapshot.val()

            const liked = prevPostData?.liked
              ? [...prevPostData.liked, current_user_id]
              : [current_user_id]

            const newPostData = {
              ...prevPostData,
              likes: prevPostData.likes + 1,
              liked
            }

            postRef.update(newPostData)
          })

        this.likes += 1
        this.liked = true
      }
    },
    leaveComment() {
      this.$router.push(`/p/${this.$props.post.id}`)
    },
  },
  mounted() {
    this.date = format(new Date(this.post.createdAt), 'dd MMMM yyyy HH:mm')
  }
}
</script>

<style scoped>
.post {
  width: 614px;
  margin-bottom: 60px;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}

.post__header {
  padding: 16px;
  display: flex;
  align-items: center;
}

.post__header__avatar {
  border: 1px solid #dbdbdb;
}

.post__header__username {
  margin-left: 8px;
}

.post__header__username a {
  text-decoration: none;
  color: black;
}

.post__content {
  width: 100%;
  height: 450px;
  position: relative;
}

.post__content__loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(51, 51, 51, .7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.post__content__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post__controls {
  padding: 8px 16px;
}

.post__controls__like {
  margin-right: 8px;
  cursor: pointer;
}

.post__controls__comment {
  cursor: pointer;
}

.post__info {
  padding: 8px 16px;
}

.post__info__body {
  text-align: justify;
}

.post__info__body__user_link {
  text-decoration: none;
  color: black;
}

.post__info__comment {
}

.post__info__comment__user_link {
  text-decoration: none;
  color: black;
}

.post__info__date {
  margin-top: 8px;
  font-size: 12px;
  color: #8E8E8E
}
</style>
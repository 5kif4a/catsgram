<template>
  <div
    v-if="!post"
    class="loader"
  >
    <loader></loader>
  </div>

  <div v-else class="post_detail">
    <img :src="post?.image_url">

    <div class="post_detail__content">
      <div class="post_detail__content__user">
        <v-avatar
          class="post_detail__content__user__avatar"
          size="48"
        >
          <img :src="post?.user_avatar">
        </v-avatar>

        <p>{{ post?.username || '...' }}</p>
      </div>
      <div class="post_detail__content__comments">
        <post-comment
          v-if="post?.body"
          :user_id="post.user_id"
          :content="post.body"
          :user_avatar="post.user_avatar"
          :username="post.username"
        />

        <post-comment
          v-for="comment in post.comments"
          :key="comment.user_id"
          :user_id="comment.user_id"
          :content="comment.content"
          :user_avatar="comment.user_avatar"
          :username="comment.username"
        />
      </div>

      <div class="post_detail__content__controls">
        <v-icon
          class="post_detail__content__controls__like"
          @click="putLike"
        >
          {{ liked ? "mdi-heart" : "mdi-heart-outline" }}
        </v-icon>
        <v-icon
          class="post_detail__content__controls__comment"
          @click="leaveComment"
        >
          mdi-comment-outline
        </v-icon>

        <div class="post_detail__content__controls__info">
          <p v-if="likes">
            <strong>{{ likes }}</strong> likes
          </p>

          <p>{{ date }}</p>
        </div>
      </div>

      <div class="post_detail__content__form">
        <input
          ref="input"
          v-model="commentBody"
          :disabled="isCommentPublishing || !isAuthenticated"
          class="post_detail__content__form__input"
          maxlength="200"
          placeholder="Leave a comment"
          @keyup.enter="publishComment"
        >
      </div>
    </div>
  </div>
</template>

<script>
import {db} from "../firebase";
import toastr from "toastr";
import {mapState} from "vuex";
import PostComment from "../components/PostComment";
import {format} from 'date-fns'
import Loader from "../components/Loader";

export default {
  name: "PostDetail",
  components: {
    Loader,
    'post-comment': PostComment
  },
  data() {
    return {
      post: null,
      liked: false,
      likes: 0,
      date: null,
      commentBody: '',
      isCommentPublishing: false
    }
  },
  computed: mapState({
    user: state => state.user,
    current_user_id: state => state.user?.uid,
    isAuthenticated: state => state.isAuthenticated
  }),
  methods: {
    putLike() {
      if (!this.isAuthenticated) {
        toastr.warning('You are not logged in')
        return;
      }

      if (!this.liked) {
        const {post_id} = this.$route.params
        const current_user_id = this.current_user_id

        const postRef = db.ref('/posts/' + post_id)

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
      if (!this.isAuthenticated) {
        toastr.warning('You are not logged in')
        return;
      }

      this.$refs.input.focus()
    },
    publishComment() {
      if (!this.isAuthenticated) {
        toastr.warning('You are not logged in')
        return;
      }

      if (!this.commentBody) {
        return
      }

      const {post_id} = this.$route.params

      const postCommentsRef = db.ref('/posts/' + post_id + '/comments')

      postCommentsRef.push({
        user_id: this.user.uid,
        username: this.user.displayName,
        user_avatar: this.user.photoURL,
        content: this.commentBody,
        createdAt: new Date().toISOString()
      })

      this.commentBody = ''

      toastr.success('Comment published!')
    }
  },
  mounted() {
    const {post_id} = this.$route.params

    const postDetailRef = db.ref('/posts/' + post_id)

    postDetailRef.on('value',
      snapshot => {
        const post = snapshot.val()
        this.post = post
        this.likes = post.likes

        this.liked = post.liked?.includes(this.current_user_id)
        this.date = format(new Date(post.createdAt), 'dd MMMM yyyy HH:mm')
      }
    )
  }
}
</script>

<style scoped>
.loader {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.post_detail {
  max-width: 900px;
  height: 600px;
  margin: 32px auto;
  border: 2px solid #dbdbdb;
  display: flex;
}

.post_detail img {
  width: 600px;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.post_detail__content {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post_detail__content__user {
  padding: 16px;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
}

.post_detail__content__user__avatar {
  border: 2px solid #dbdbdb;
  margin-right: 16px;
}

.post_detail__content__comments {
  padding: 16px;
  height: calc(100% - 72px);
  overflow-y: auto;
}

.post_detail__content__comments::-webkit-scrollbar {
  display: none;
}

.post_detail__content__comments {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.post_detail__content__controls {
  border-top: 2px solid #dbdbdb;
  padding: 12px;
}

.post_detail__content__controls__like {
  cursor: pointer;
  margin-right: 8px;
}

.post_detail__content__controls__comment {
  cursor: pointer;
}

.post_detail__content__controls__info {
  margin-top: 8px;
}

.post_detail__content__form {
  border-top: 2px solid #dbdbdb;
  width: 100%;
  height: 54px;
  align-self: flex-end;
}

.post_detail__content__form__input {
  width: 100%;
  height: 100%;
  outline: 0;
  padding: 6px 12px;
}
</style>
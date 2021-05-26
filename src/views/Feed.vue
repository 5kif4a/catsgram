<template>
  <div class="feed">
    <div
      v-if="isFetching"
      class="loader"
    >
      <loader></loader>
    </div>

    <template v-else>
      <div
        v-if="posts.length"
        class="post-list"
      >
        <post
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
      <div v-else>
        <h2>No posts</h2>
      </div>
    </template>

    <div class="info">
      <div
        v-if="isAuthenticated"
        class="info__user"
      >
        <v-avatar
          class="info__user__avatar"
          size="48"
        >
          <img :src="user?.photoURL">
        </v-avatar>

        <p>{{ user.displayName || '...' }}</p>
      </div>

      <div class="info__about">
        <a href="https://github.com/5kif4a/catsgram">View project on Github</a>
        <a href="https://www.instagram.com/5kif4a_/">Developer Instagram</a>
        <a href="https://www.linkedin.com/in/alikhan-shorin-a958011ab/">Developer LinkedIn</a>
        <p>© CATSGRAM 2021</p>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "../components/Post";
import {mapState} from 'vuex'
import {db} from "../firebase";
import Loader from "../components/Loader";

export default {
  name: 'Feed',
  components: {
    Loader,
    'post': Post
  },
  data() {
    return {
      isFetching: true
    }
  },
  computed: mapState({
    posts: state => state.posts,
    user: state => state.user,
    isAuthenticated: state => state.isAuthenticated
  }),
  watch: {
    isAuthenticated: function () {
      this.loadPosts()
    }
  },
  methods: {
    loadPosts() {
      const postsRef = db.ref('/posts/')

      this.isFetching = true

      postsRef.on('value',
        snapshot => {
          this.$store.commit('setPosts', snapshot.val())
          this.isFetching = false
        }
      )
    }
  },
  mounted() {
    this.loadPosts()
  },
};
</script>

<style scoped>
.feed {
  width: 900px;
  margin: 32px auto;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.loader {
  width: 100%;
  display: flex;
  justify-content: center;
}

.post-list {

}

.info {
  width: 260px;
  padding: 16px;
  height: fit-content;
  position: sticky;
  top: 32px;
  border-radius: 3px;
  border: 1px solid #dbdbdb;
  display: flex;
  flex-direction: column;
}

.info__user {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.info__user__avatar {
  margin-right: 16px;
  border: 1px solid #dbdbdb;
}

.info__about {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.info__about a {
  text-decoration: none;
  line-height: 24px;
  color: #c7c7c7;
}

.info__about p {
  margin-top: 16px;
}
</style>

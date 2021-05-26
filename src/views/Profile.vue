<template>
  <div
      v-if="isFetching"
      class="loader"
  >
    <loader></loader>
  </div>

  <div
      v-else
      class="profile"
  >
    <div class="profile__info">
      <div class="profile__info__avatar">
        <v-avatar
            size="150"
            style="border: 2px solid #dbdbdb"
        >
          <img :src="user?.photoURL">
        </v-avatar>
      </div>

      <div class="profile__info__meta">
        <p class="profile__info__meta__name">
          {{ user?.displayName || '...' }}
        </p>

        <div class="profile__info__meta__metrics">
          <span class="profile__info__meta__metrics__item">
            <strong>{{ user__posts?.length || 0 }}</strong> posts
          </span>
          <span class="profile__info__meta__metrics__item">
            <strong>{{ total_likes }}</strong> likes</span>
        </div>

        <v-btn
            v-if="isAuthenticated && isOwner"
            elevation="2"
            style="width: fit-content"
            @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </div>

    <hr style="background: #dbdbdb"/>

    <div
        v-if="user__posts.length"
        class="profile__posts"
    >
      <post-card
          v-for="post in user__posts"
          :key="post.id"
          :post="post"
      />
    </div>
    <div
        v-else
        class="profile__no_posts"
    >
      <h2>No posts</h2>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import PostCard from "../components/PostCard";
import firebase from "firebase";
import toastr from 'toastr'
import {db} from "../firebase";
import Loader from "../components/Loader";

export default {
  name: "Profile",
  components: {
    Loader,
    'post-card': PostCard
  },
  data() {
    return {
      isFetching: true
    }
  },
  computed: mapState({
    isAuthenticated: state => state.isAuthenticated,
    isOwner: function (state) {
      return this.$route.params.user_id === state.user.uid
    },
    user: function (state) {
      return this.$route.params.user_id === state.user?.uid
          ? state.user
          : state.other_user
    },
    user__posts: state => state.user_posts,
    total_likes(state) {
      let likes = 0

      if (state.user_posts.length) {
        likes = state.user_posts.reduce((acc, currVal) => acc += currVal.likes, 0)
      }

      return likes
    },
  }),
  watch: {
    user() {
      this.loadUserPosts()
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/')
        this.$store.commit('logout')
        toastr.info('You are signed out')
      })
    },
    loadUserInfo() {
      this.isFetching = true

      const usersRef = db.ref('/users')

      const {user_id} = this.$route.params

      usersRef
          .orderByChild('uid')
          .equalTo(user_id)
          .once('value')
          .then(snapshot => {
            this.$store.commit('setOtherUser', snapshot.val()[user_id])
          })
    },
    loadUserPosts() {
      this.isFetching = true

      const postsRef = db.ref('/posts/')

      postsRef
          .once('value')
          .then(snapshot => {
            const payload = {
              rawPosts: snapshot.val(),
              user_id: this.$route.params.user_id
            }

            this.$store.commit('setUserPosts', payload)
          })
          .then(() => {
            this.isFetching = false
          })
    }
  },
  mounted() {
    if (this.$route.params.user_id !== this.user?.uid) {
      this.loadUserInfo()
    }

    this.loadUserPosts()
  }
}
</script>

<style scoped>
.loader {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.profile {
  margin: 32px auto;
  max-width: 900px;
}

.profile__info {
  display: flex;
  margin-bottom: 40px;
}

.profile__info__avatar {
  padding: 0 48px;
  margin-right: 24px;
}

.profile__info__meta {
  display: flex;
  flex-direction: column;
}

.profile__info__meta__name {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
}

.profile__info__meta__metrics {
  display: flex;
  margin-bottom: 8px;
}

.profile__info__meta__metrics__item {
  font-size: 20px;
  margin-right: 16px;
}

.profile__info__meta__metrics__item:last-child {
  margin-right: 0;
}

.profile__posts {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
}

.profile__no_posts {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
</style>
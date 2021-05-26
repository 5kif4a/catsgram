<template>
  <div class="feed">
    <div class="container">
      <p class="container__brand">
        CatsGram
      </p>

      <div class="container__controls">
        <v-btn
            icon
            plain
            @click="handleGoToCreatePost()"
        >
          <v-icon x-large>
            mdi-plus
          </v-icon>
        </v-btn>

        <v-btn
            icon
            plain
            @click="handleGoToFeed"
        >
          <v-icon x-large>mdi-home</v-icon>
        </v-btn>


        <v-avatar
            v-if="isAuthenticated"
            class="container__controls__avatar"
            size="24"
            @click="handleGoToProfile"
        >
          <img :src="user.photoURL">
        </v-avatar>


        <v-btn
            v-else
            class="container__controls__signin"
            outlined
            text
            @click="handleSignIn"
        >
          Sign In
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {db, fbApp} from '../firebase/index'
import firebase from "firebase";
import {mapState} from "vuex";

export default {
  name: "Navbar",
  computed: mapState({
    user: state => state.user,
    isAuthenticated: state => state.isAuthenticated
  }),
  methods: {
    handleGoToCreatePost: function () {
      if (this.user) {
        this.$router.push('/create-post')
      } else {
        this.handleSignIn('/create-post')
      }
    },
    handleGoToFeed: function () {
      this.$router.push('/')
    },
    handleSignIn: function (redirectTo = null) {
      const provider = new firebase.auth.GoogleAuthProvider();

      fbApp.auth().signInWithPopup(provider).then((result) => {
        const userData = result.user

        this.$store.commit('setUser', userData)
        this.$store.commit('setIsAuthenticated', true)

        // add user to db if doesn't exist
        const userRef = db.ref('users/' + userData.uid)

        userRef.once('value', snapshot => {
          if (!snapshot.val()) {
            const preparedUserData = JSON.parse(JSON.stringify(userData))

            userRef.set(preparedUserData)
          }
        })

        if (redirectTo) {
          this.$router.push(redirectTo)
        }
      })
    },
    handleGoToProfile: function () {
      this.$router.push('/u/' + this.user.uid)
    }
  },

}
</script>

<style scoped>
.feed {
  height: 54px;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  justify-content: center;
}

.container {
  width: 900px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.container__brand {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
}

.container__controls {
  display: flex;
  align-items: center;
}

.container__controls__avatar {
  margin-left: 16px;
  cursor: pointer;
}

.container__controls__signin {
  margin-left: 16px;
}
</style>
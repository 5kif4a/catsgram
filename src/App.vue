<template>
  <navbar/>
  <router-view/>
</template>

<script>
import firebase from "firebase";
import Navbar from "./components/Navbar";

export default {
  name: 'App',
  components: {
    navbar: Navbar
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('setUser', user)
        this.$store.commit('setIsAuthenticated', true)
      }
    });
  }
}
</script>

<style scoped>

</style>

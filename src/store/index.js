import {createStore} from 'vuex'
import {transformObjectToArray} from "../service";

export default createStore({
  state: {
    isAuthenticated: false,
    user: null,
    other_user: null,
    user_posts: [],
    posts: [],
  },
  mutations: {
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setOtherUser(state, payload) {
      state.other_user = payload
    },
    setPosts(state, payload) {
      state.posts = payload ? transformObjectToArray(payload) : []
    },
    setUserPosts(state, payload) {
      const {rawPosts, user_id} = payload

      const posts = transformObjectToArray(rawPosts)

      state.user_posts = posts.filter(p => p.user_id === user_id)
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.other_user = null
      state.user_posts = []
      state.posts = []
    }
  },
  actions: {},
  modules: {}
})

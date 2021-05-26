import {createRouter, createWebHashHistory} from 'vue-router'
import Feed from "../views/Feed";
import Profile from "../views/Profile";
import CreatePost from "../views/CreatePost";
import PostDetail from "../views/PostDetail";

const routes = [
  {
    path: '/',
    name: 'Feed',
    component: Feed
  },
  {
    path: '/u/:user_id',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/p/:post_id',
    name: 'PostDetail',
    component: PostDetail
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

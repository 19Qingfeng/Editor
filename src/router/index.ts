import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home/index.vue";
import Editor from "../views/Editor/index.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/editor",
    name: "Editor",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Editor
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === "/editor") {
    if (!store.getters.currentPictureBookId) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

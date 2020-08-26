import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/task/:id",
    name: "Task",
    component: () => import(/* webpackChunkName: "task" */ "../views/Task.vue")
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import(/* webpackChunkName: "User" */ "../views/User.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

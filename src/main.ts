import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuescroll from "vuescroll";
import { config } from "vuex-module-decorators";
import "leaflet/dist/leaflet.css";

config.rawError = true;
Vue.use(vuescroll);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

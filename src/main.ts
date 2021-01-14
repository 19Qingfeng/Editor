import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./style/index.scss";

// import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "mini",
});
new Vue({
  router,
  store,
  // vuetify,
  render: (h) => h(App),
}).$mount("#app");

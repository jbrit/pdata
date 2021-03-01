import Vue from "vue";
import App from "./App.vue";
import "./index.css";
import "firebase";
import { firestorePlugin } from "vuefire";
import HighchartsVue from "highcharts-vue";

Vue.use(firestorePlugin);
Vue.use(HighchartsVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ApiService from "./services/ApiService";
import "./assets/scss/style.scss";

const app = createApp(App);

ApiService.init();

app.use(store).use(router).mount("#app");

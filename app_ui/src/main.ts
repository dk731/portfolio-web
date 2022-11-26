import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";

import "./assets/main.css";

const app = createApp(App);

gsap.registerPlugin(TextPlugin);
gsap.config({ nullTargetWarn: false });

app.use(createPinia());
app.mount("#app");

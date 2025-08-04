import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import 'virtual:uno.css';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import { createPinia } from 'pinia'


const app = createApp(App).use(createPinia()).use(router).use(ArcoVue);
app.mount('#app');

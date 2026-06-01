import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import axios from 'axios';

// Import local CSS and JS components natively for sandboxed offline capability
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'notyf/notyf.min.css';
import './assets/style.css';

// Set global base URL for Axios using Vite environment variable
const apiBaseUrl = import.meta.env.VITE_API_URL;
if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

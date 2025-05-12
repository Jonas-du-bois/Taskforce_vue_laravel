import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';
import './assets/main.css';
import setupInterceptors from './services/api.interceptor';

// Le service worker sera enregistré automatiquement par vite-plugin-pwa
// Ne pas appeler registerServiceWorker manuellement ici pour éviter les conflits
// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();

// Configuration globale d'Axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';
axios.defaults.withCredentials = true;  // Pour les cookies CSRF avec Laravel Sanctum

// Récupérer le token du localStorage à l'initialisation
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Configurer les intercepteurs axios pour la gestion des tokens
setupInterceptors();

// Créer l'application
const app = createApp(App);

// Créer l'instance de Pinia
const pinia = createPinia();

// Plugins
app.use(pinia);
app.use(router);
app.use(VCalendar);

// Montage de l'application
app.mount('#app'); 
<template>
  <div class="flex flex-col min-h-screen bg-gray-50 text-gray-800">
    <!-- Indicateur hors ligne -->
    <OfflineIndicator />
    
    <!-- Composants principaux -->
    <AppHeader />
    
    <!-- CONTENU PRINCIPAL -->
    <main class="flex-1 flex flex-col mt-16" :class="{ 'mb-20': !isAuthenticated }">
      <router-view />
    </main>

    <!-- Système de notifications -->
    <AppNotifications />
    
    <!-- Prompt d'installation PWA -->
    <PwaInstallPrompt />
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import notificationService from './services/notification.service';
import AppHeader from './components/app/AppHeader.vue';
import AppFooter from './components/app/AppFooter.vue';
import AppNotifications from './components/app/AppNotifications.vue';
import PwaInstallPrompt from './components/PwaInstallPrompt.vue';
import OfflineIndicator from './components/OfflineIndicator.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

// Fonction pour les notifications simples (compatibilité avec les composants existants)
const showNotification = ({ message, type = 'success' }) => {
  notificationService.add({ message, type });
  
  // Aussi pour le système plus simple (transition)
  notification.value = {
    show: true,
    message,
    type
  };
  
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Intercepteur pour les réponses HTTP (gestion des erreurs d'authentification)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      // Si le token est expiré ou invalide, déconnecter l'utilisateur
      if (isAuthenticated.value) {
        authStore.logout();
        notificationService.error('Votre session a expiré. Veuillez vous reconnecter.');
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

onMounted(async () => {
  // Vérifier si l'utilisateur est connecté au démarrage
  if (localStorage.getItem('token')) {
    try {
      await authStore.fetchUserData();
      // Si aucun utilisateur n'est récupéré, nettoyer le token
      if (!authStore.user) {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      // En cas d'erreur, nettoyer le token
      localStorage.removeItem('token');
    }
  }
});
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.notification {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s, transform 0.3s;
}

.notification.show {
  opacity: 1;
  transform: translateY(0);
}
</style> 
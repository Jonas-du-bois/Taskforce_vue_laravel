<template>
  <div class="flex justify-center items-center min-h-full py-20">
    <div class="text-center">
      <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-500">Redirection vers le formulaire de création...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notification';

const router = useRouter();
const notificationStore = useNotificationStore();

onMounted(() => {
  // Rediriger vers la liste des tâches
  router.push({ name: 'tasks' }).then(() => {
    // Envoyer un événement pour ouvrir le modal (à implémenter dans TasksView)
    notificationStore.add({
      type: 'info',
      message: 'Veuillez utiliser le formulaire pour créer une nouvelle tâche',
      timeout: 3000
    });
    
    // Cette approche est limitée, car elle nécessite un événement global ou un store
    // Une solution plus propre serait de passer un paramètre de requête et de surveiller les paramètres de route dans TasksView
    setTimeout(() => {
      // Émettre un événement personnalisé
      window.dispatchEvent(new CustomEvent('openTaskModal'));
    }, 500);
  });
});
</script> 
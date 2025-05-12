<template>
  <div class="schedule-container p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Planning des cours</h1>
    </div>

    <!-- Affichage des notifications -->
    <div v-if="error" class="mb-4 p-4 border rounded-md bg-red-100 border-red-300 text-red-800">
      {{ error }}
    </div>

    <!-- Utilisation du composant ScheduleViewer -->
    <ScheduleViewer
      title="Planning des cours"
      :defaultClass="selectedClass"
      @error="handleError"
      @loading="loading = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScheduleViewer from '@/components/ScheduleViewer.vue';
import logger from '@/utils/logger';

// État
const loading = ref(false);
const error = ref('');
const selectedClass = ref('');

// Gestion des erreurs
function handleError(errorMessage) {
  error.value = errorMessage;
  logger.error('ScheduleView', 'Erreur lors du chargement des horaires', errorMessage);
}
</script>

<style scoped>
.schedule-container {
  min-height: 600px;
}
</style> 
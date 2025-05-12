<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800">{{ task.title }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-3 sm:space-y-4">
        <div>
          <h4 class="text-xs sm:text-sm font-medium text-gray-500">Description</h4>
          <p class="mt-1 text-sm sm:text-base text-gray-800">{{ task.description || 'Aucune description' }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-2 sm:gap-4">
          <div>
            <h4 class="text-xs sm:text-sm font-medium text-gray-500">Priorité</h4>
            <div class="mt-1 text-sm sm:text-base text-gray-800 flex items-center">
              <span 
                class="w-3 h-3 rounded-full mr-2"
                :class="priorityColorClass"
              ></span>
              <span class="capitalize">{{ task.priority || 'Non définie' }}</span>
            </div>
          </div>
          
          <div>
            <h4 class="text-xs sm:text-sm font-medium text-gray-500">Statut</h4>
            <div class="mt-1 text-sm sm:text-base capitalize inline-flex items-center px-2 py-0.5 rounded-full"
                 :class="statusColorClass">
              {{ task.status || 'Non défini' }}
            </div>
          </div>
        </div>
        
        <div v-if="task.estimated_minutes" class="grid grid-cols-1 gap-2 sm:gap-4">
          <div>
            <h4 class="text-xs sm:text-sm font-medium text-gray-500">Temps estimé</h4>
            <p class="mt-1 text-sm sm:text-base text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              {{ formatDuration(task.estimated_minutes) }}
            </p>
          </div>
        </div>
        
        <div v-if="task.due_date">
          <h4 class="text-xs sm:text-sm font-medium text-gray-500">Date d'échéance</h4>
          <p class="mt-1 text-sm sm:text-base text-gray-800">{{ formattedDate }}</p>
        </div>
        
        <div v-if="task.end_date && task.isClass">
          <h4 class="text-xs sm:text-sm font-medium text-gray-500">Fin</h4>
          <p class="mt-1 text-sm sm:text-base text-gray-800">{{ formattedEndDate }}</p>
        </div>
        
        <div v-if="showTaskViewButton" class="pt-3 sm:pt-4 flex justify-end space-x-2 sm:space-x-3">
          <button @click="$emit('close')" class="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm">
            Fermer
          </button>
          <router-link :to="taskLinkUrl" class="px-3 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm">
            Voir la tâche
          </router-link>
        </div>
        
        <div v-else class="pt-3 sm:pt-4 flex justify-end">
          <button @click="$emit('close')" class="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

// Date formatée
const formattedDate = computed(() => {
  if (!props.task.due_date) return '';
  
  try {
    const date = new Date(props.task.due_date);
    
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit' 
    });
  } catch (err) {
    return 'Date invalide';
  }
});

// Date de fin formatée (pour les cours)
const formattedEndDate = computed(() => {
  if (!props.task.end_date) return '';
  
  try {
    const date = new Date(props.task.end_date);
    
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit' 
    });
  } catch (err) {
    return 'Date invalide';
  }
});

// Formater la durée en heures et minutes
const formatDuration = (minutes) => {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  } else if (remainingMinutes === 0) {
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} heure${hours > 1 ? 's' : ''} et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
};

// Classes CSS pour la priorité
const priorityColorClass = computed(() => {
  switch(props.task.priority) {
    case 'haute':
      return 'bg-red-500';
    case 'moyenne':
      return 'bg-yellow-500';
    case 'basse':
      return 'bg-green-500';
    default:
      return 'bg-blue-500';
  }
});

// Classes CSS pour le statut
const statusColorClass = computed(() => {
  if (props.task.isClass) {
    return 'bg-purple-100 text-purple-800';
  }
  
  switch(props.task.status) {
    case 'à faire':
    case 'to_do':
      return 'bg-blue-100 text-blue-800';
    case 'en cours':
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'terminée':
    case 'done':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

// URL pour le lien vers la tâche
const taskLinkUrl = computed(() => {
  return `/tasks/${props.task.id}`;
});

// Déterminer si on doit afficher le bouton pour voir la tâche
const showTaskViewButton = computed(() => {
  // Ne pas afficher le bouton pour les cours/événements de classe
  return !props.task.isClass;
});
</script> 
<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <!-- En-tête avec titre et compteur -->
    <div class="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-800">
        {{ title }}
        <span v-if="showCount" class="text-sm font-normal text-gray-500 ml-2">({{ tasks.length }})</span>
      </h3>
      
      <slot name="header-actions"></slot>
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="py-8 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- Message si aucune tâche -->
    <div v-else-if="tasks.length === 0" class="py-8 text-center text-gray-500">
      <slot name="empty-state">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="mt-2">{{ emptyMessage }}</p>
        
        <div v-if="showCreateButton" class="mt-4">
          <button @click="$emit('create')" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Nouvelle tâche
          </button>
        </div>
      </slot>
    </div>
    
    <!-- Liste des tâches -->
    <ul v-else class="divide-y divide-gray-200">
      <li 
        v-for="task in tasks" 
        :key="task.id" 
        class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150 flex justify-between items-start"
        :class="{'opacity-70': task.status === 'terminée'}"
      >
        <div class="flex items-start flex-1 min-w-0 mr-4">
          <!-- Checkbox pour marquer comme terminée -->
          <div class="flex-shrink-0 mr-3 pt-1" v-if="showCheckboxes">
            <input 
              :id="`task-${task.id}`" 
              type="checkbox" 
              :checked="task.status === 'terminée'"
              @change="$emit('status-change', task, $event.target.checked ? 'terminée' : 'à faire')"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
          </div>
          
          <!-- Badge de statut -->
          <div v-else-if="showStatusBadge" class="flex-shrink-0 mr-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="{
                    'bg-yellow-100 text-yellow-800': task.status === 'à faire',
                    'bg-blue-100 text-blue-800': task.status === 'en cours',
                    'bg-green-100 text-green-800': task.status === 'terminée'
                  }">
              {{ formatStatus(task.status) }}
            </span>
          </div>
          
          <!-- Contenu de la tâche -->
          <div class="flex-1 min-w-0">
            <div>
              <h4 
                class="text-sm font-medium text-gray-900 truncate"
                :class="{'line-through': task.status === 'terminée'}"
              >
                {{ task.title }}
              </h4>
              
              <p 
                v-if="task.description" 
                class="mt-1 text-sm text-gray-500 overflow-hidden text-ellipsis"
                :class="{'line-through': task.status === 'terminée'}"
                style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
              >
                {{ task.description }}
              </p>
              
              <!-- Métadonnées -->
              <div class="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                <!-- Date d'échéance -->
                <div v-if="task.due_date" class="flex items-center">
                  <svg class="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  {{ formatDate(task.due_date) }}
                </div>
                
                <!-- Priorité -->
                <div v-if="task.priority && showPriority" class="flex items-center">
                  <svg class="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3z" clip-rule="evenodd" />
                  </svg>
                  <span 
                    :class="{
                      'text-red-600': task.priority === 'haute',
                      'text-yellow-600': task.priority === 'moyenne',
                      'text-blue-600': task.priority === 'basse'
                    }"
                  >
                    {{ formatPriority(task.priority) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex-shrink-0 flex space-x-2">
          <slot name="actions" :task="task">
            <button 
              v-if="allowEdit"
              @click="$emit('edit', task)" 
              class="p-1 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-gray-100"
              title="Modifier"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <button 
              v-if="allowDelete"
              @click="$emit('delete', task)" 
              class="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Supprimer"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </slot>
        </div>
      </li>
    </ul>
    
    <!-- Pagination ou actions de liste -->
    <div v-if="$slots.footer" class="bg-gray-50 border-t border-gray-200 px-4 py-3">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/**
 * Composant réutilisable pour afficher une liste de tâches
 * Permet la personnalisation via props et slots
 */
const props = defineProps({
  // Liste des tâches à afficher
  tasks: {
    type: Array,
    default: () => []
  },
  // Titre de la liste
  title: {
    type: String,
    default: 'Tâches'
  },
  // État de chargement
  loading: {
    type: Boolean,
    default: false
  },
  // Message affiché lorsque la liste est vide
  emptyMessage: {
    type: String,
    default: 'Aucune tâche trouvée'
  },
  // Affiche le nombre de tâches à côté du titre
  showCount: {
    type: Boolean,
    default: true
  },
  // Affiche les checkboxes pour marquer les tâches comme terminées
  showCheckboxes: {
    type: Boolean,
    default: true
  },
  // Affiche la priorité des tâches
  showPriority: {
    type: Boolean,
    default: true
  },
  // Affiche les badges de statut
  showStatusBadge: {
    type: Boolean,
    default: false
  },
  // Affiche le bouton de création
  showCreateButton: {
    type: Boolean,
    default: true
  },
  // Autorise l'édition des tâches
  allowEdit: {
    type: Boolean,
    default: true
  },
  // Autorise la suppression des tâches
  allowDelete: {
    type: Boolean,
    default: true
  }
});

// Événements émis par le composant
const emit = defineEmits([
  'edit',       // Éditer une tâche
  'delete',     // Supprimer une tâche
  'create',     // Créer une nouvelle tâche
  'status-change', // Changer le statut d'une tâche
  'select',     // Sélectionner une tâche
]);

/**
 * Formate la priorité en texte lisible
 * @param {string} priority - priorité de la tâche (basse, moyenne, haute)
 * @returns {string} - Texte formaté
 */
const formatPriority = (priority) => {
  const map = {
    'basse': 'Basse',
    'moyenne': 'Moyenne',
    'haute': 'Haute',
  };
  return map[priority] || priority;
};

/**
 * Formate le statut en texte lisible
 * @param {string} status - Statut de la tâche
 * @returns {string} - Texte formaté
 */
const formatStatus = (status) => {
  const map = {
    'à faire': 'À faire',
    'en cours': 'En cours',
    'terminée': 'Terminée',
  };
  return map[status] || status;
};

/**
 * Formate la date en français
 * @param {string} dateString - Date au format ISO
 * @returns {string} - Date formatée
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};
</script> 
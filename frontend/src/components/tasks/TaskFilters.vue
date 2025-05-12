<template>
  <div class="bg-white shadow rounded-lg mb-6">
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Filtres
      </h3>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div class="w-full sm:w-1/4">
          <label for="priority-filter" class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
          <select 
            id="priority-filter" 
            v-model="localFilters.priority"
            @change="updateFilters"
            class="block w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Toutes les priorités</option>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>
        <div class="w-full sm:w-3/4">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              id="search" 
              v-model="localFilters.search"
              @input="updateFiltersDebounced"
              class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Rechercher une tâche..." 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

/**
 * Composant réutilisable pour le filtrage des tâches
 * 
 * Ce composant permet de filtrer les tâches par priorité et recherche textuelle.
 * Il gère le debounce sur la recherche pour optimiser les performances.
 * 
 * Utilisé dans:
 * - TasksView: Vue principale des tâches
 * - TasksBoardView: Vue des tâches en mode tableau
 * 
 * @props {Object} filters - Objet contenant les filtres actuels (priority, search)
 * @emits {Object} update-filters - Émis lorsque les filtres sont modifiés
 */
const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-filters']);

// Copie locale des filtres pour éviter la modification directe des props
const localFilters = ref({ ...props.filters });

// Surveiller les changements des filtres externes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters };
}, { deep: true });

// Mise à jour immédiate pour les changements de select
const updateFilters = () => {
  emit('update-filters', { ...localFilters.value });
};

// Debounce pour la recherche texte
let debounceTimeout = null;
const updateFiltersDebounced = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    updateFilters();
  }, 300); // 300ms de délai
};

// Nettoyage
onBeforeUnmount(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
});
</script> 
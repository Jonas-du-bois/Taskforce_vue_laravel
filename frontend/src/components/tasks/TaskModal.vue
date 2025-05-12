<template>
  <div class="fixed inset-0 overflow-y-auto z-50" v-if="show">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay avec transition améliorée -->
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="show" class="fixed inset-0 transition-opacity" aria-hidden="true" @click="close">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
      </transition>

      <!-- Centre verticalement la modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal avec transition améliorée -->
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="show"
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <!-- En-tête amélioré -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 sm:px-6 flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
              <span v-if="isEditing" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Modifier la tâche
              </span>
              <span v-else class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Nouvelle tâche
              </span>
            </h3>
            <button 
              type="button" 
              class="text-white hover:text-gray-200 focus:outline-none"
              @click="close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Formulaire amélioré -->
          <form @submit.prevent="submit" class="divide-y divide-gray-200">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <!-- Champ titre avec icône -->
              <div class="mb-5">
                <label for="task-title" class="block text-sm font-medium text-gray-700 mb-1">Titre <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm0 2h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="task-title"
                    v-model="taskForm.title"
                    required
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="Donnez un titre à votre tâche"
                  />
                </div>
              </div>

              <!-- Champ description avec icône -->
              <div class="mb-5">
                <label for="task-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute top-3 left-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <textarea
                    id="task-description"
                    v-model="taskForm.description"
                    rows="4"
                    class="pl-10 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="Décrivez votre tâche en détail (optionnel)"
                  ></textarea>
                </div>
              </div>

              <!-- Ligne priorité et statut -->
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <!-- Champ priorité avec icône -->
                <div class="mb-5">
                  <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1">Priorité <span class="text-red-500">*</span></label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <select
                      id="task-priority"
                      v-model="taskForm.priority"
                      required
                      class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md appearance-none transition-all duration-200 shadow-sm hover:border-indigo-300"
                    >
                      <option value="basse">Basse</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="haute">Haute</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Champ statut avec icône-->
                <div class="mb-5">
                  <label for="task-status" class="block text-sm font-medium text-gray-700 mb-1">Statut <span class="text-red-500">*</span></label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <select
                      id="task-status"
                      v-model="taskForm.status"
                      required
                      class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md appearance-none transition-all duration-200 shadow-sm hover:border-indigo-300"
                    >
                      <option value="à faire">À faire</option>
                      <option value="en cours">En cours</option>
                      <option value="terminée">Terminée</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Champ date d'échéance avec icône -->
              <div class="mb-2">
                <label for="task-due-date" class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="task-due-date"
                    v-model="taskForm.due_date"
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                  />
                </div>
              </div>

              <!-- Champ temps estimé avec icône -->
              <div class="mb-2">
                <label for="task-estimated-time" class="block text-sm font-medium text-gray-700 mb-1">Temps estimé (minutes)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="task-estimated-time"
                    v-model="taskForm.estimated_minutes"
                    min="0"
                    placeholder="Estimation en minutes"
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                  />
                </div>
              </div>
            </div>

            <!-- Boutons d'action améliorés -->
            <div class="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 sm:ml-3 sm:w-auto sm:text-sm"
                :disabled="loading"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="isEditing">Mettre à jour</span>
                <span v-else>Créer</span>
              </button>
              
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="close"
                :disabled="loading"
              >
                <svg class="-ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

// État local du formulaire
const taskForm = ref({
  title: '',
  description: '',
  priority: 'moyenne',
  status: 'à faire',
  due_date: null,
  estimated_minutes: null
});

// Déterminer si nous sommes en mode édition
const isEditing = computed(() => !!props.task?.id);

// Formater la date au format attendu par l'input type="date" (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extrait la partie YYYY-MM-DD
  } catch (err) {
    console.error('Erreur de formatage de date:', err);
    return null;
  }
};

// Remplir le formulaire quand une tâche est fournie
watch(() => props.task, (newTask) => {
  if (newTask) {
    // Copier les données mais formater la date correctement
    taskForm.value = { 
      ...newTask,
      due_date: formatDateForInput(newTask.due_date)
    };
  } else {
    // Réinitialiser le formulaire
    taskForm.value = {
      title: '',
      description: '',
      priority: 'moyenne',
      status: 'à faire',
      due_date: null,
      estimated_minutes: null
    };
  }
}, { immediate: true });

// Fermer la modal
const close = () => {
  emit('close');
};

// Soumettre le formulaire
const submit = () => {
  // Débogage pour voir ce qui est envoyé
  console.log("Soumission du formulaire avec les données:", {
    ...taskForm.value,
    estimated_minutes_type: typeof taskForm.value.estimated_minutes,
    estimated_minutes_value: taskForm.value.estimated_minutes,
  });
  
  // S'assurer que estimated_minutes est un entier
  const formData = { 
    ...taskForm.value,
    estimated_minutes: taskForm.value.estimated_minutes !== null && taskForm.value.estimated_minutes !== '' 
      ? parseInt(taskForm.value.estimated_minutes) 
      : 0
  };
  
  console.log("Données après transformation:", formData);
  
  emit('submit', formData);
  close(); // Ferme la modale après la soumission
};
</script>

<style scoped>
/* Style personnalisé pour la transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Style pour améliorer l'apparence des champs date sur tous les navigateurs */
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
  opacity: 0.6;
  transition: opacity 0.2s;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Style pour les sélecteurs */
select {
  background-image: none !important;
}
</style> 
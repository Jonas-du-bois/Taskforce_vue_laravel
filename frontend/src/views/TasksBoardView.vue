<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Tableau Kanban</h1>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <button 
            @click="showCreateTaskModal" 
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Nouvelle tâche
          </button>
          <router-link 
            to="/tasks" 
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Vue liste
          </router-link>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <TaskFilters @change="onFilterChanged" />
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <TaskGroupboard 
      v-else
      :tasks="filteredTasks"
      :statuses="statuses"
      @edit-task="editTask"
      @create-task="showCreateTaskModal"
      @status-changed="onStatusChanged"
    />

    <!-- Modal pour éditer/créer une tâche -->
    <TaskModal 
      :show="showTaskModal" 
      :task="currentTask" 
      :loading="saving"
      @close="closeTaskModal" 
      @submit="saveTask"
    />

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeDeleteModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Supprimer la tâche
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="deleteTask"
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Supprimer
            </button>
            <button 
              type="button" 
              @click="closeDeleteModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import TaskGroupboard from '@/components/tasks/TaskGroupboard.vue';
import TaskFilters from '@/components/tasks/TaskFilters.vue';
import TaskModal from '@/components/tasks/TaskModal.vue';
import { useTaskStore } from '@/stores/task';
import { useNotificationStore } from '@/stores/notification';
import logger from '@/utils/logger';

// Stores
const router = useRouter();
const taskStore = useTaskStore();
const notificationStore = useNotificationStore();

// État local
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const showTaskModal = ref(false);
const showDeleteModal = ref(false);
const currentTask = ref({
  id: null,
  title: '',
  description: '',
  status: 'to_do',
  priority: '',
  due_date: null
});
const filters = ref({
  status: null,
  priority: null,
  search: '',
  due_date: null,
});

// Statuts disponibles
const statuses = [
  { value: 'to_do', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminé' }
];

// Tâches filtrées
const filteredTasks = computed(() => {
  return taskStore.getAllTasks.filter(task => {
    // Filtrer par statut si spécifié
    if (filters.value.status && !filters.value.status.includes(task.status)) {
      return false;
    }
    
    // Filtrer par priorité si spécifiée
    if (filters.value.priority && !filters.value.priority.includes(task.priority)) {
      return false;
    }
    
    // Filtrer par texte de recherche
    if (filters.value.search && !task.title.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false;
    }
    
    // Filtrer par date d'échéance
    if (filters.value.due_date && filters.value.due_date.start && filters.value.due_date.end) {
      const taskDate = new Date(task.due_date);
      const startDate = new Date(filters.value.due_date.start);
      const endDate = new Date(filters.value.due_date.end);
      
      if (taskDate < startDate || taskDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
});

// Initialisation
onMounted(async () => {
  document.title = "Tableau des tâches - Taskforce";
  try {
    loading.value = true;
    await taskStore.fetchTasks();
    logger.info('TasksBoard', 'Tâches chargées avec succès', { count: taskStore.getAllTasks.length });
  } catch (error) {
    logger.error('TasksBoard', 'Erreur lors du chargement des tâches', error);
    notificationStore.addNotification({
      type: 'error',
      message: 'Impossible de charger les tâches'
    });
  } finally {
    loading.value = false;
  }
});

// Mettre à jour les filtres
function onFilterChanged(newFilters) {
  filters.value = { ...newFilters };
  logger.debug('TasksBoard', 'Filtres mis à jour', filters.value);
}

// Afficher le modal de création de tâche
function showCreateTaskModal(options = {}) {
  currentTask.value = {
    id: null,
    title: '',
    description: '',
    status: options.status || 'à faire',
    priority: 'moyenne',
    due_date: null
  };
  showTaskModal.value = true;
}

// Éditer une tâche existante
function editTask(task) {
  currentTask.value = { ...task };
  if (currentTask.value.due_date) {
    // Formater la date pour l'input date HTML
    const date = new Date(currentTask.value.due_date);
    currentTask.value.due_date = date.toISOString().split('T')[0];
  }
  showTaskModal.value = true;
}

// Fermer la modal de tâche
function closeTaskModal() {
  showTaskModal.value = false;
}

// Sauvegarder une tâche (création ou mise à jour)
async function saveTask(task) {
  if (!task.title) {
    notificationStore.addNotification({
      type: 'error',
      message: 'Le titre de la tâche est obligatoire'
    });
    return;
  }
  
  saving.value = true;
  
  try {
    const isNewTask = !task.id;
    
    if (isNewTask) {
      logger.api('TasksBoard', 'Création de tâche', { titre: task.title });
      
      await taskStore.createTask(task);
      
      logger.task('TasksBoard', 'Tâche créée', { titre: task.title });
      
      notificationStore.addNotification({
        type: 'success',
        message: 'Tâche créée avec succès'
      });
    } else {
      logger.api('TasksBoard', 'Mise à jour de tâche', { id: task.id });
      
      await taskStore.updateTask(task);
      
      logger.task('TasksBoard', 'Tâche mise à jour', { id: task.id });
      
      notificationStore.addNotification({
        type: 'success',
        message: 'Tâche mise à jour avec succès'
      });
    }
    
    closeTaskModal();
  } catch (error) {
    logger.error('TasksBoard', 'Erreur sauvegarde tâche', error);
    notificationStore.addNotification({
      type: 'error',
      message: 'Impossible de sauvegarder la tâche'
    });
  } finally {
    saving.value = false;
  }
}

// Confirmer la suppression d'une tâche
function confirmDeleteTask() {
  if (currentTask.value?.id) {
    showTaskModal.value = false;
    showDeleteModal.value = true;
  }
}

// Fermer la modal de suppression
function closeDeleteModal() {
  showDeleteModal.value = false;
}

// Supprimer une tâche
async function deleteTask() {
  if (!currentTask.value?.id) return;
  
  deleting.value = true;
  
  try {
    logger.api('TasksBoard', 'Suppression de tâche', { id: currentTask.value.id });
    
    await taskStore.deleteTask(currentTask.value.id);
    
    logger.task('TasksBoard', 'Tâche supprimée', { id: currentTask.value.id });
    
    notificationStore.addNotification({
      type: 'success',
      message: 'Tâche supprimée avec succès'
    });
    
    closeDeleteModal();
  } catch (error) {
    logger.error('TasksBoard', 'Erreur suppression tâche', error);
    notificationStore.addNotification({
      type: 'error',
      message: 'Impossible de supprimer la tâche'
    });
  } finally {
    deleting.value = false;
  }
}

// Gérer le changement de statut d'une tâche
async function onStatusChanged({ taskId, newStatus }) {
  try {
    const task = taskStore.getAllTasks.find(t => t.id == taskId);
    if (task) {
      logger.api('TasksBoard', 'Changement statut tâche', { id: taskId, nouveauStatut: newStatus });
      
      const updatedTask = { ...task, status: newStatus };
      await taskStore.updateTask(updatedTask);
      
      logger.task('TasksBoard', 'Statut tâche modifié', { id: taskId, nouveauStatut: newStatus });
      
      notificationStore.addNotification({
        type: 'success',
        message: `Tâche déplacée vers ${newStatus}`
      });
    }
  } catch (error) {
    logger.error('TasksBoard', 'Erreur changement statut', error);
    notificationStore.addNotification({
      type: 'error',
      message: 'Impossible de mettre à jour le statut de la tâche'
    });
  }
}
</script> 
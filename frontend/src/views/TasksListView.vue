<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Mes tâches</h1>
        <router-link 
          to="/tasks/create" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouvelle tâche
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="tasks.length === 0" class="text-center py-20">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune tâche</h3>
      <p class="mt-2 text-base text-gray-500">Commencez par créer une nouvelle tâche pour organiser votre travail.</p>
      <div class="mt-8">
        <router-link 
          to="/tasks/create" 
          class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Créer une tâche
        </router-link>
      </div>
    </div>
    
    <div v-else>
      <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div class="flex flex-wrap -mx-2">
          <button 
            class="mx-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
            :class="filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'"
            @click="setFilter('all')"
          >
            Toutes
          </button>
          <button 
            class="mx-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
            :class="filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-700 hover:bg-gray-100'"
            @click="setFilter('pending')"
          >
            En attente
          </button>
          <button 
            class="mx-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
            :class="filter === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'"
            @click="setFilter('in_progress')"
          >
            En cours
          </button>
          <button 
            class="mx-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
            :class="filter === 'completed' ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-100'"
            @click="setFilter('completed')"
          >
            Terminées
          </button>
        </div>
      </div>
      
      <ul class="divide-y divide-gray-200">
        <li v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-50 transition duration-150">
          <div class="px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center flex-1 min-w-0">
                <input
                  :id="'task-' + task.id"
                  type="checkbox"
                  class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-150"
                  :checked="task.status === 'completed'"
                  @change="updateTaskStatus(task, $event.target.checked ? 'completed' : 'pending')"
                />
                <label :for="'task-' + task.id" class="ml-3 block flex-1">
                  <p class="text-base font-medium" :class="{
                    'line-through text-gray-500': task.status === 'completed',
                    'text-gray-900': task.status !== 'completed'
                  }">{{ task.title }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ task.description || 'Pas de description' }}</p>
                </label>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex space-x-2">
                  <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" :class="{
                    'bg-yellow-100 text-yellow-800': task.status === 'pending',
                    'bg-blue-100 text-blue-800': task.status === 'in_progress',
                    'bg-green-100 text-green-800': task.status === 'completed'
                  }">
                    {{ statusLabel(task.status) }}
                  </span>
                  <span v-if="task.priority" class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Priorité {{ task.priority }}
                  </span>
                </div>
                <div class="flex items-center space-x-1">
                  <router-link 
                    :to="`/tasks/${task.id}/edit`" 
                    class="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </router-link>
                  <button 
                    @click="deleteTask(task)" 
                    class="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition duration-150"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-3 flex items-center text-sm text-gray-500">
              <span v-if="task.due_date" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Échéance: {{ formatDate(task.due_date) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>

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
              @click="confirmDelete"
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
import { ref, computed, onMounted } from 'vue';
import TaskService from '../services/task.service';
import { useNotificationStore } from '../stores/notification';
import { useLogger } from '../stores/logger';

const notificationStore = useNotificationStore();
const logger = useLogger();
const tasks = ref([]);
const loading = ref(true);
const filter = ref('all');
const showDeleteModal = ref(false);
const deleting = ref(false);
const taskToDelete = ref(null);

const fetchTasks = async () => {
  loading.value = true;
  try {
    logger.api('TasksList', 'Chargement des tâches', { 
      filter: filter.value
    });
    
    const filters = filter.value === 'all' ? {} : { status: filter.value };
    const data = await TaskService.fetchTasks(filters);
    
    tasks.value = data;
    logger.info('TasksList', 'Tâches chargées', { 
      count: tasks.value.length
    });
  } catch (err) {
    logger.error('TasksList', 'Erreur chargement tâches', { 
      erreur: err.response?.data?.message || 'Erreur inconnue',
      status: err.response?.status || 'N/A'
    });
    
    notificationStore.add({
      type: 'error',
      message: 'Erreur lors du chargement des tâches'
    });
  } finally {
    loading.value = false;
  }
};

const filteredTasks = computed(() => {
  if (filter.value === 'all') {
    return tasks.value;
  }
  return tasks.value.filter(task => task.status === filter.value);
});

const statusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'in_progress':
      return 'En cours';
    case 'completed':
      return 'Terminée';
    default:
      return status;
  }
};

const setFilter = (newFilter) => {
  filter.value = newFilter;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const updateTaskStatus = async (task, newStatus) => {
  try {
    logger.api('TasksList', `Modification statut tâche à ${newStatus === 'completed' ? 'complété' : 'non-complété'}`, { 
      id: task.id 
    });
    
    await TaskService.updateTaskStatus(task.id, newStatus);
    
    task.status = newStatus;
    
    logger.task('TasksList', 'Statut tâche modifié', { 
      id: task.id, 
      completed: newStatus === 'completed' 
    });
    
    notificationStore.add({
      type: 'success',
      message: `Tâche marquée comme ${newStatus === 'completed' ? 'complétée' : 'non-complétée'}`
    });
  } catch (err) {
    logger.error('TasksList', 'Erreur modification statut tâche', { 
      id: task.id,
      erreur: err.response?.data?.message || 'Erreur inconnue',
      status: err.response?.status || 'N/A'
    });
    
    notificationStore.add({
      type: 'error',
      message: 'Erreur lors de la modification du statut de la tâche'
    });
  }
};

const deleteTask = (task) => {
  taskToDelete.value = task;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  taskToDelete.value = null;
};

const confirmDelete = async () => {
  if (!taskToDelete.value) return;
  
  deleting.value = true;
  
  try {
    logger.api('TasksList', 'Suppression de la tâche', { id: taskToDelete.value.id });
    
    await TaskService.deleteTask(taskToDelete.value.id);
    
    logger.task('TasksList', 'Tâche supprimée', { id: taskToDelete.value.id });
    
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value.id);
    
    notificationStore.add({
      type: 'success',
      message: 'Tâche supprimée avec succès'
    });
    
    closeDeleteModal();
  } catch (err) {
    logger.error('TasksList', 'Erreur suppression tâche', { 
      id: taskToDelete.value.id,
      erreur: err.response?.data?.message || 'Erreur inconnue',
      status: err.response?.status || 'N/A'
    });
    
    notificationStore.add({
      type: 'error',
      message: 'Erreur lors de la suppression de la tâche'
    });
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  document.title = "Mes tâches - Taskforce";
  fetchTasks();
});
</script> 
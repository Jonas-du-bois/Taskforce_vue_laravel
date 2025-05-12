<template>
  <div class="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Bouton retour -->
      <div class="mb-6">
        <router-link to="/tasks" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux tâches
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="error" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Erreur de chargement</h3>
          <p class="mt-2 text-sm text-gray-500">Nous n'avons pas pu charger les détails de cette tâche.</p>
          <div class="mt-6">
            <button 
              @click="fetchTask" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Réessayer
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="task" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- En-tête de la tâche -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">{{ task.title }}</h1>
            <div class="flex space-x-3">
              <button 
                @click="editTask" 
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              <button 
                @click="confirmDelete" 
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu de la tâche -->
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Détails principaux -->
            <div class="w-full md:w-2/3">
              <div class="mb-6">
                <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h2>
                <div class="bg-gray-50 p-4 rounded-lg text-gray-700">
                  <p v-if="task.description" class="whitespace-pre-line">{{ task.description }}</p>
                  <p v-else class="text-gray-500 italic">Aucune description fournie</p>
                </div>
              </div>

              <!-- Section commentaires (fonctionnalité future) -->
              <div class="mb-6">
                <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Commentaires</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-500 italic">Fonctionnalité à venir</p>
                </div>
              </div>
            </div>

            <!-- Métadonnées de la tâche -->
            <div class="w-full md:w-1/3">
              <div class="bg-gray-50 rounded-lg p-4">
                <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Détails</h2>
                
                <div class="mb-4">
                  <h3 class="text-xs font-medium text-gray-500 mb-1">Statut</h3>
                  <div class="flex items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
                      :class="{
                        'bg-yellow-100 text-yellow-800': task.status === 'todo',
                        'bg-blue-100 text-blue-800': task.status === 'in_progress',
                        'bg-green-100 text-green-800': task.status === 'done'
                      }">
                      <span class="h-2 w-2 rounded-full mr-1"
                        :class="{
                          'bg-yellow-400': task.status === 'todo',
                          'bg-blue-400': task.status === 'in_progress',
                          'bg-green-400': task.status === 'done'
                        }"></span>
                      {{ formatStatus(task.status) }}
                    </span>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h3 class="text-xs font-medium text-gray-500 mb-1">Priorité</h3>
                  <div class="flex items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
                      :class="{
                        'bg-blue-100 text-blue-800': task.priority === 'low',
                        'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                        'bg-red-100 text-red-800': task.priority === 'high'
                      }">
                      {{ formatPriority(task.priority) }}
                    </span>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h3 class="text-xs font-medium text-gray-500 mb-1">Date d'échéance</h3>
                  <p class="text-sm text-gray-800">{{ formatDate(task.due_date) }}</p>
                </div>

                <div v-if="task.estimated_minutes" class="mb-4">
                  <h3 class="text-xs font-medium text-gray-500 mb-1">Temps estimé</h3>
                  <p class="text-sm text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {{ formatDuration(task.estimated_minutes) }}
                  </p>
                </div>
                
                <div class="mb-4">
                  <h3 class="text-xs font-medium text-gray-500 mb-1">Créée le</h3>
                  <p class="text-sm text-gray-800">{{ formatDateTime(task.created_at) }}</p>
                </div>
                
                <div>
                  <h3 class="text-xs font-medium text-gray-500 mb-1">Dernière mise à jour</h3>
                  <p class="text-sm text-gray-800">{{ formatDateTime(task.updated_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Utilisation du composant TaskModal pour la modification -->
    <TaskModal 
      :show="showEditModal" 
      :task="task" 
      :loading="submitting" 
      @close="closeEditModal" 
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useNotificationStore } from '../stores/notification';
import logger from '@/utils/logger';
import taskService from '@/services/task.service';
import TaskModal from '@/components/tasks/TaskModal.vue';

const notificationStore = useNotificationStore();
const route = useRoute();
const router = useRouter();

// États
const task = ref(null);
const loading = ref(true);
const error = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const validationErrors = ref({});

// Méthodes
const fetchTask = async () => {
  const taskId = route.params.id;
  loading.value = true;
  error.value = null;
  
  try {
    logger.api('TaskDetail', 'Récupération de la tâche', { id: taskId });
    task.value = await taskService.getTaskById(taskId);
    logger.task('TaskDetail', 'Tâche récupérée', task.value);
    document.title = `${task.value.title} - Vue - TaskForce`;
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de la récupération de la tâche";
    logger.error('TaskDetail', 'Erreur récupération tâche', { 
      id: taskId, 
      erreur: error.value,
      status: err.response?.status || 'N/A'
    });
    notificationStore.add({
      type: "error",
      message: "Impossible de charger les détails de la tâche",
    });
  } finally {
    loading.value = false;
  }
};

const editTask = () => {
  showEditModal.value = true;
  validationErrors.value = {};
};

const saveTask = async (updatedTask) => {
  if (!task.value) return;
  
  submitting.value = true;
  validationErrors.value = {};
  
  try {
    logger.api('TaskDetail', 'Sauvegarde de la tâche', { 
      id: task.value.id,
      données: updatedTask
    });
    
    // Assurer que l'ID est conservé
    updatedTask.id = task.value.id;
    
    task.value = await taskService.updateTask(updatedTask);
    logger.task('TaskDetail', 'Tâche mise à jour', task.value);
    
    notificationStore.add({
      type: 'success',
      message: 'Tâche mise à jour avec succès'
    });
    
  } catch (err) {
    validationErrors.value = err.response?.data?.errors || {};
    const errorMsg = err.response?.data?.message || "Erreur lors de la sauvegarde";
    logger.error('TaskDetail', 'Erreur sauvegarde tâche', { 
      id: task.value.id, 
      erreur: errorMsg,
      status: err.response?.status || 'N/A'
    });
    notificationStore.add({
      type: 'error',
      message: errorMsg
    });
  } finally {
    submitting.value = false;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteTask = async () => {
  deleting.value = true;
  
  try {
    logger.api('TaskDetail', 'Suppression de la tâche', { id: task.value.id });
    
    await taskService.deleteTask(task.value.id);
    
    logger.task('TaskDetail', 'Tâche supprimée', { id: task.value.id });
    
    notificationStore.add({
      type: 'success',
      message: 'Tâche supprimée avec succès'
    });
    
    router.push({ name: 'tasks' });
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Erreur lors de la suppression";
    
    logger.error('TaskDetail', 'Erreur suppression tâche', { 
      id: task.value.id, 
      erreur: errorMsg,
      status: err.response?.status || 'N/A'
    });
    
    notificationStore.add({
      type: 'error',
      message: errorMsg
    });
  } finally {
    deleting.value = false;
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

// Formatters
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const formatDateTime = (dateTimeString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleDateString('fr-FR', options);
};

const formatStatus = (status) => {
  const statusMap = {
    'à faire': 'À faire',
    'en cours': 'En cours',
    'terminée': 'Terminé'
  };
  return statusMap[status] || status;
};

const formatPriority = (priority) => {
  const priorityMap = {
    'basse': 'Basse',
    'moyenne': 'Moyenne',
    'haute': 'Haute'
  };
  return priorityMap[priority] || priority;
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Lifecycle
onMounted(() => {
  fetchTask();
});
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditing ? 'Modifier la tâche' : 'Créer une nouvelle tâche' }}</h2>
    </div>
    
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else>
      <form @submit.prevent="saveTask" class="p-6">
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre <span class="text-red-500">*</span></label>
          <input
            id="title"
            v-model="task.title"
            type="text"
            required
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150"
            placeholder="Entrez le titre de la tâche"
          />
          <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">{{ validationErrors.title }}</p>
        </div>
        
        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="task.description"
            rows="3"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150"
            placeholder="Décrivez la tâche en détail (optionnel)"
          ></textarea>
          <p v-if="validationErrors.description" class="mt-1 text-sm text-red-600">{{ validationErrors.description }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              id="status"
              v-model="task.status"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150"
            >
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
            <p v-if="validationErrors.status" class="mt-1 text-sm text-red-600">{{ validationErrors.status }}</p>
          </div>
          
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
            <select
              id="priority"
              v-model="task.priority"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150"
            >
              <option value="">Sans priorité</option>
              <option value="1">Basse</option>
              <option value="2">Moyenne</option>
              <option value="3">Haute</option>
            </select>
            <p v-if="validationErrors.priority" class="mt-1 text-sm text-red-600">{{ validationErrors.priority }}</p>
          </div>
        </div>
        
        <div class="mb-8">
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
          <input
            id="due_date"
            v-model="task.due_date"
            type="date"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150"
          />
          <p v-if="validationErrors.due_date" class="mt-1 text-sm text-red-600">{{ validationErrors.due_date }}</p>
        </div>
        
        <div class="mb-8">
          <label for="estimated_minutes" class="block text-sm font-medium text-gray-700 mb-1">Temps estimé (minutes)</label>
          <input
            id="estimated_minutes"
            v-model.number="task.estimated_minutes"
            type="number"
            min="0"
            placeholder="Estimation en minutes"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150"
          />
          <p v-if="validationErrors.estimated_minutes" class="mt-1 text-sm text-red-600">{{ validationErrors.estimated_minutes }}</p>
        </div>
        
        <div class="flex justify-between">
          <router-link
            to="/tasks"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            Annuler
          </router-link>
          
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const taskId = computed(() => route.params.id);
const isEditing = computed(() => !!taskId.value);

const task = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: '',
  due_date: '',
  estimated_minutes: 0
});

const loading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const validationErrors = ref({});

const fetchTask = async () => {
  if (!isEditing.value) return;
  
  loading.value = true;
  try {
    const response = await axios.get(`/api/tasks/${taskId.value}`);
    task.value = {
      ...response.data,
      priority: response.data.priority ? response.data.priority.toString() : ''
    };
    
    // Format date for the input field (YYYY-MM-DD)
    if (task.value.due_date) {
      const date = new Date(task.value.due_date);
      task.value.due_date = date.toISOString().split('T')[0];
    }
  } catch (err) {
    console.error('Erreur lors du chargement de la tâche:', err);
    error.value = 'Impossible de charger la tâche. Veuillez réessayer.';
    
    if (err.response && err.response.status === 404) {
      router.push('/tasks');
    }
  } finally {
    loading.value = false;
  }
};

const saveTask = async () => {
  isSubmitting.value = true;
  error.value = '';
  validationErrors.value = {};
  
  try {
    const taskData = {
      ...task.value,
      priority: task.value.priority === '' ? null : parseInt(task.value.priority),
      estimated_minutes: task.value.estimated_minutes === '' ? 0 : parseInt(task.value.estimated_minutes)
    };
    
    let response;
    if (isEditing.value) {
      response = await axios.put(`/api/tasks/${taskId.value}`, taskData);
    } else {
      response = await axios.post('/api/tasks', taskData);
    }
    
    router.push('/tasks');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la tâche:', err);
    
    if (err.response && err.response.status === 422) {
      validationErrors.value = err.response.data.errors || {};
      error.value = 'Veuillez corriger les erreurs dans le formulaire.';
    } else {
      error.value = 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  document.title = isEditing.value ? 'Modifier la tâche - Taskforce' : 'Nouvelle tâche - Taskforce';
  fetchTask();
});
</script> 
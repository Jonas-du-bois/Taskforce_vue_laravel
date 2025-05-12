<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Modifier la tâche</h1>
      <router-link to="/tasks" class="text-blue-600 hover:text-blue-900">
        Retour à la liste
      </router-link>
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <form v-else @submit.prevent="updateTask" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre*</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
          <select
            id="priority"
            v-model="form.priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Aucune</option>
            <option value="1">1 - Basse</option>
            <option value="2">2 - Normale</option>
            <option value="3">3 - Haute</option>
            <option value="4">4 - Très haute</option>
            <option value="5">5 - Critique</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            id="status"
            v-model="form.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
          </select>
        </div>
        
        <div>
          <label for="estimated_minutes" class="block text-sm font-medium text-gray-700 mb-1">Temps estimé (minutes)</label>
          <input
            id="estimated_minutes"
            v-model.number="form.estimated_minutes"
            type="number"
            min="0"
            placeholder="Estimation en minutes"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div class="flex items-center justify-between pt-4">
        <div>
          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
          <p v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</p>
        </div>
        <div class="flex space-x-4">
          <router-link
            to="/tasks"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </router-link>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="updating"
          >
            <span v-if="updating">Mise à jour en cours...</span>
            <span v-else>Mettre à jour</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const taskId = route.params.id;

const loading = ref(true);
const updating = ref(false);
const error = ref('');
const successMessage = ref('');

const form = reactive({
  title: '',
  description: '',
  due_date: '',
  priority: '',
  status: '',
  estimated_minutes: 0
});

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const fetchTask = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/tasks/${taskId}`);
    form.title = response.data.title;
    form.description = response.data.description || '';
    form.due_date = formatDateForInput(response.data.due_date);
    form.priority = response.data.priority ? String(response.data.priority) : '';
    form.status = response.data.status;
    form.estimated_minutes = response.data.estimated_minutes || 0;
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors du chargement de la tâche';
    console.error('Erreur lors du chargement de la tâche:', e);
  } finally {
    loading.value = false;
  }
};

const updateTask = async () => {
  updating.value = true;
  error.value = '';
  successMessage.value = '';
  
  try {
    await axios.put(`/api/tasks/${taskId}`, form);
    successMessage.value = 'Tâche mise à jour avec succès';
    // Redirection après un court délai pour que l'utilisateur puisse voir le message de succès
    setTimeout(() => {
      router.push('/tasks');
    }, 1500);
  } catch (e) {
    error.value = e.response?.data?.message || 'Une erreur est survenue lors de la mise à jour de la tâche';
    if (e.response?.data?.errors) {
      const errorMessages = Object.values(e.response.data.errors).flat();
      if (errorMessages.length > 0) {
        error.value = errorMessages.join(', ');
      }
    }
  } finally {
    updating.value = false;
  }
};

onMounted(() => {
  document.title = "Modifier la tâche - Taskforce";
  fetchTask();
});
</script> 
<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold mb-6">Changement de mot de passe</h1>
    
    <form @submit.prevent="changePassword" class="space-y-6">
      <div>
        <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
        <input
          id="current_password"
          v-model="form.current_password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label for="new_password" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
        <input
          id="new_password"
          v-model="form.new_password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
        <input
          id="new_password_confirmation"
          v-model="form.new_password_confirmation"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="loading"
        >
          <span v-if="loading">Modification en cours...</span>
          <span v-else>Changer le mot de passe</span>
        </button>
      </div>
      
      <div v-if="message" :class="[success ? 'text-green-600' : 'text-red-600']" class="text-sm text-center">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const form = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
});

const loading = ref(false);
const message = ref('');
const success = ref(false);

const changePassword = async () => {
  if (form.new_password !== form.new_password_confirmation) {
    message.value = 'Les nouveaux mots de passe ne correspondent pas.';
    success.value = false;
    return;
  }
  
  loading.value = true;
  message.value = '';
  success.value = false;
  
  try {
    await axios.post('/api/change-password', form);
    success.value = true;
    message.value = 'Votre mot de passe a été modifié avec succès.';
    
    // Réinitialiser le formulaire
    form.current_password = '';
    form.new_password = '';
    form.new_password_confirmation = '';
  } catch (error) {
    success.value = false;
    message.value = error.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.title = "Changement de mot de passe - Taskforce";
});
</script> 
<template>
  <div class="h-[calc(100vh-9rem)] flex items-center justify-center">
    <div class="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 py-4">
        <h1 class="text-2xl font-bold text-center text-white">Connexion</h1>
      </div>
      
      <div class="px-8 py-6">
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label for="login" class="block text-base font-medium text-gray-700">Email ou Nom d'utilisateur</label>
            <div class="relative mt-2">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </span>
              <input
                id="login"
                v-model="form.login"
                type="text"
                class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base"
                required
                autocomplete="username"
              />
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-base font-medium text-gray-700">Mot de passe</label>
            <div class="relative mt-2">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base"
                required
                autocomplete="current-password"
              />
              <button 
                type="button" 
                @click="togglePassword" 
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm mt-6">
            <div class="flex items-center">
              <input
                id="remember_me"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember_me" class="ml-2 block text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            
            <div>
              <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
          
          <div class="mt-6">
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="submitting"
            >
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
              <span v-else>Se connecter</span>
            </button>
          </div>
          
          <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200 animate-pulse mt-4">
            {{ error }}
          </div>
        </form>
      </div>
      
      <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <p class="text-sm text-center text-gray-600">
          Vous n'avez pas de compte ?
          <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
            S'inscrire
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import logger from '../utils/logger';
import apiService from '../services/api.service';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const form = reactive({
  login: '',
  password: '',
  remember: false
});

const submitting = ref(false);
const error = ref('');
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  if (submitting.value) return;
  submitting.value = true;
  error.value = '';
  
  try {
    logger.auth('LoginView', 'Tentative de connexion', { login: form.login });
    
    const success = await authStore.login({
      login: form.login,
      password: form.password,
      remember: form.remember
    });
    
    if (success) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Connexion réussie'
      });
      
      if (route.query.redirect) {
        router.push(route.query.redirect);
      } else {
        router.push('/tasks');
      }
    } else {
      error.value = authStore.error;
      notificationStore.addNotification({
        type: 'error',
        message: error.value || 'Échec de connexion'
      });
    }
  } catch (err) {
    logger.error('LoginView', 'Erreur lors de la connexion', { 
      message: err.message,
      status: err.response?.status
    });
    
    error.value = err.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.';
    notificationStore.addNotification({
      type: 'error',
      message: error.value
    });
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  document.title = "Connexion - Taskforce";
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
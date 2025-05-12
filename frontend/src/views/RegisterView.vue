<template>
  <div class="h-[calc(100vh-9rem)] flex items-center justify-center">
    <div class="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 py-4">
        <h1 class="text-2xl font-bold text-center text-white">Inscription</h1>
      </div>
      
      <div class="px-8 py-6">
        <form @submit.prevent="register" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-base font-medium text-gray-700">Nom complet</label>
              <div class="relative mt-2">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </span>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base"
                  required
                />
              </div>
            </div>
            
            <div>
              <label for="username" class="block text-base font-medium text-gray-700">Nom d'utilisateur</label>
              <div class="relative mt-2">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </span>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base"
                  required
                  autocomplete="username"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-base font-medium text-gray-700">Email</label>
            <div class="relative mt-2">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base"
                required
                autocomplete="email"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
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
                  class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base"
                  required
                  autocomplete="new-password"
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
            
            <div>
              <label for="password_confirmation" class="block text-base font-medium text-gray-700">Confirmer</label>
              <div class="relative mt-2">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base"
                  required
                  autocomplete="new-password"
                />
                <button 
                  type="button" 
                  @click="togglePasswordConfirmation" 
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="showPasswordConfirmation" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
          </div>
          
          <div class="text-sm text-gray-500 mt-2">
            Le mot de passe doit contenir au moins 8 caractères.
          </div>
          
          <div class="mt-6">
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription...
              </span>
              <span v-else>S'inscrire</span>
            </button>
          </div>
          
          <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200 animate-pulse mt-4">
            {{ error }}
          </div>
        </form>
      </div>
      
      <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <p class="text-sm text-center text-gray-600">
          Vous avez déjà un compte ?
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-medium">
            Se connecter
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const loading = ref(false);
const error = ref('');
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordConfirmation = () => {
  showPasswordConfirmation.value = !showPasswordConfirmation.value;
};

const register = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.register(form);
    
    // Rediriger vers la page des tâches
    router.push('/tasks');
  } catch (e) {
    error.value = e.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
    if (e.response?.data?.errors) {
      const errorMessages = Object.values(e.response.data.errors).flat();
      if (errorMessages.length > 0) {
        error.value = errorMessages.join(', ');
      }
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.title = "Inscription - Taskforce";
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

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>
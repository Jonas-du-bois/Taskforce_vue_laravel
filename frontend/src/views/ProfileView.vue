<template>
  <div class="flex-1 py-8 bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- En-tête avec photo de profil -->
        <div class="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div class="absolute -bottom-12 left-8">
            <div class="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {{ userInitial }}
            </div>
          </div>
        </div>
        
        <!-- Contenu principal -->
        <div class="pt-16 pb-6 px-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Informations de base -->
            <div class="w-full md:w-1/3">
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-800">{{ user?.name }}</h2>
                <p class="text-gray-500 mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ user?.email }}
                </p>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg mb-6">
                <h3 class="font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Options de compte
                </h3>
                <a href="#passwords" @click.prevent="activeTab = 'passwords'" class="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mt-2 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Changer mon mot de passe
                </a>
              </div>
            </div>
            
            <!-- Formulaire de modification des informations -->
            <div class="w-full md:w-2/3">
              <div v-if="activeTab === 'profile'" class="bg-white">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Modifier mes informations</h3>
                
                <div v-if="statusMessage" class="mb-6 p-4 rounded-md" :class="statusType === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'">
                  {{ statusMessage }}
                </div>
                
                <form @submit.prevent="updateProfile" class="space-y-6">                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Nom complet -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input type="text" v-model="profileForm.name" id="name" required
                          class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      </div>
                      <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
                    </div>
                    
                    <!-- Classe -->
                    <div>
                      <label for="class" class="block text-sm font-medium text-gray-700 mb-1">
                        Classe
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <select 
                          v-model="profileForm.class" 
                          id="class"
                          class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">-- Sélectionner une classe --</option>
                          <option v-for="classOption in availableClasses" :key="classOption" :value="classOption">
                            {{ classOption }}
                          </option>
                        </select>
                      </div>
                      <p v-if="validationErrors.class" class="mt-1 text-sm text-red-600">{{ validationErrors.class }}</p>
                    </div>
                    
                    <!-- Email -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input type="email" v-model="profileForm.email" id="email" required
                          class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      </div>
                      <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">{{ validationErrors.email }}</p>
                    </div>
                  </div>

                  <!-- Identifiants GAPS -->
                  <div class="pt-4 border-t border-gray-200">
                    <h4 class="text-base font-medium text-gray-800 mb-3">Identifiants GAPS pour vos notes</h4>
                    <p class="text-sm text-gray-500 mb-4">
                      Ces identifiants sont nécessaires pour récupérer vos notes depuis le système GAPS. 
                      Ils sont stockés de manière sécurisée et utilisés uniquement pour cette fonction.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Identifiant GAPS -->
                      <div>
                        <label for="gaps_login" class="block text-sm font-medium text-gray-700 mb-1">
                          Identifiant GAPS
                        </label>
                        <div class="relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input type="text" v-model="profileForm.gaps_login" id="gaps_login"
                              class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <p v-if="validationErrors.gaps_login" class="mt-1 text-sm text-red-600">{{ validationErrors.gaps_login }}</p>
                      </div>
                      
                      <!-- Mot de passe GAPS -->
                      <div>
                        <label for="gaps_password" class="block text-sm font-medium text-gray-700 mb-1">
                          Mot de passe GAPS
                        </label>
                        <div class="relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input type="password" v-model="profileForm.gaps_password" id="gaps_password"
                              class="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <p v-if="validationErrors.gaps_password" class="mt-1 text-sm text-red-600">{{ validationErrors.gaps_password }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-5">
                    <button type="submit" :disabled="submittingProfile" class="w-full md:w-auto inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                      <svg v-if="submittingProfile" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mettre à jour mon profil
                    </button>
                  </div>
                </form>
              </div>
              
              <div v-if="activeTab === 'passwords'" class="bg-white border-t border-gray-200 pt-6 mt-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Changer mon mot de passe</h3>
                
                <div v-if="statusMessage" class="mb-6 p-4 rounded-md" :class="statusType === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'">
                  {{ statusMessage }}
                </div>
                
                <form @submit.prevent="updatePassword" class="space-y-6">
                  <div>
                    <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                    <input type="password" v-model="passwordForm.current_password" id="current_password" required
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <p v-if="validationErrors.current_password" class="mt-1 text-sm text-red-600">{{ validationErrors.current_password }}</p>
                  </div>
                  
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input type="password" v-model="passwordForm.password" id="password" required
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600">{{ validationErrors.password }}</p>
                  </div>
                  
                  <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirmation du nouveau mot de passe</label>
                    <input type="password" v-model="passwordForm.password_confirmation" id="password_confirmation" required
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  
                  <div class="pt-5 flex justify-between">
                    <button type="button" @click="activeTab = 'profile'" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Retour
                    </button>
                    
                    <button type="submit" :disabled="submittingPassword" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <svg v-if="submittingPassword" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changer le mot de passe
                    </button>
                  </div>
                </form>
              </div>
              
              <div v-if="activeTab === 'profile'" class="border-t border-gray-200 pt-8 mt-8">
                <h3 class="text-lg font-bold text-gray-800 mb-4">API Token</h3>
                
                <div class="bg-gray-50 p-4 rounded-md mb-4">
                  <p class="text-sm text-gray-600 mb-2">Votre token API est nécessaire pour les applications tierces qui doivent accéder à votre compte.</p>
                  
                  <div v-if="user?.api_token" class="relative">
                    <input
                      type="text"
                      readonly
                      :value="showToken ? user.api_token : '••••••••••••••••••••••••••••••••••••••••••••••••••'"
                      class="pr-24 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono bg-gray-100"
                    />
                    <button
                      @click="showToken = !showToken"
                      class="absolute inset-y-0 right-0 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {{ showToken ? 'Cacher' : 'Afficher' }}
                    </button>
                  </div>
                  <p v-else class="text-sm text-gray-500">Vous n'avez pas encore généré de token API.</p>
                </div>
                
                <div class="flex justify-end">
                  <button
                    @click="regenerateToken"
                    :disabled="generatingToken"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="generatingToken" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ user?.api_token ? 'Régénérer le token' : 'Générer un token' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import profileService from '../services/profileService';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const activeTab = ref('profile');
const userInitial = computed(() => user.value?.name ? user.value.name.charAt(0).toUpperCase() : '');

const profileForm = ref({
  name: '',
  email: '',
  class: '',
  gaps_login: '',
  gaps_password: ''
});

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
});

const submittingProfile = ref(false);
const submittingPassword = ref(false);
const generatingToken = ref(false);
const showToken = ref(false);
const statusMessage = ref('');
const statusType = ref('success');
const validationErrors = ref({});

const availableClasses = ref([
  // Ingénierie des médias
  'IM51-1',
  'IM51-2',
  'IM51-3',
  'IM52-1',
  'IM52-2',
  'IM53-1',
  'IM53-2',
]);

const loadUserData = () => {
  if (!user.value) return;
  
  profileForm.value = {
    name: user.value.name,
    email: user.value.email,
    class: user.value.class,
    gaps_login: user.value.gaps_login || '',
    gaps_password: user.value.gaps_password ? '••••••••' : ''
  };
};

const updateProfile = async () => {
  submittingProfile.value = true;
  validationErrors.value = {};
  statusMessage.value = '';
  
  try {
    const response = await profileService.updateProfile(profileForm.value);
    authStore.user = response.user;
    statusMessage.value = 'Profil mis à jour avec succès';
    statusType.value = 'success';
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    
    if (error.response && error.response.status === 422) {
      validationErrors.value = error.response.data.errors || {};
      statusMessage.value = 'Veuillez corriger les erreurs dans le formulaire';
    } else {
      statusMessage.value = 'Erreur lors de la mise à jour du profil';
    }
    statusType.value = 'error';
  } finally {
    submittingProfile.value = false;
    
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  }
};

const updatePassword = async () => {
  submittingPassword.value = true;
  validationErrors.value = {};
  statusMessage.value = '';
  
  try {
    await profileService.updatePassword(passwordForm.value);
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    };
    statusMessage.value = 'Mot de passe mis à jour avec succès';
    statusType.value = 'success';
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    
    if (error.response && error.response.status === 422) {
      validationErrors.value = error.response.data.errors || {};
      statusMessage.value = 'Veuillez corriger les erreurs dans le formulaire';
    } else {
      statusMessage.value = 'Erreur lors de la mise à jour du mot de passe';
    }
    statusType.value = 'error';
  } finally {
    submittingPassword.value = false;
    
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  }
};

const regenerateToken = async () => {
  generatingToken.value = true;
  statusMessage.value = '';
  
  try {
    const response = await profileService.regenerateToken();
    authStore.user = response.user;
    showToken.value = true;
    statusMessage.value = 'Token API généré avec succès';
    statusType.value = 'success';
  } catch (error) {
    console.error('Erreur lors de la génération du token:', error);
    statusMessage.value = 'Erreur lors de la génération du token API';
    statusType.value = 'error';
  } finally {
    generatingToken.value = false;
    
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  }
};

onMounted(() => {
  document.title = 'Mon profil - Vue - TaskForce';
  loadUserData();
});
</script> 
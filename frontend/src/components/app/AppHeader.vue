<template>
  <header class="bg-slate-800 backdrop-blur-md shadow-lg fixed top-0 w-full z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0">
          <router-link to="/" class="text-white font-bold text-xl">Vue - TaskForce</router-link>
        </div>
        <div class="hidden sm:flex sm:space-x-4 sm:items-center">
          <template v-if="isAuthenticated">
            <router-link to="/" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Dashboard</router-link>
            <router-link to="/tasks" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Mes Tâches</router-link>
            <router-link to="/agenda" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Agenda</router-link>
            <router-link to="/marks" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Notes</router-link>
            
            <div class="flex items-center space-x-3">
              <router-link to="/profile">
                <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-slate-200">
                  {{ userInitial }}
                </div>
              </router-link>
              <router-link to="/profile" class="text-white text-sm font-medium">{{ user?.name }}</router-link>
            </div>
            
            <button @click="handleLogout" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Déconnexion</button>
          </template>
          <template v-else>
            <router-link to="/" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Accueil</router-link>
            <router-link to="/register" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Inscription</router-link>
            <router-link to="/login" class="text-white hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium">Connexion</router-link>
          </template>
        </div>
        
        <!-- Mobile menu button -->
        <div class="sm:hidden">
          <button type="button" id="mobileMenuBtn" @click="toggleMobileMenu" class="text-white hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div id="mobileMenu" v-show="mobileMenuOpen" class="sm:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="text-white hover:text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Accueil</router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/tasks" class="text-white hover:text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Mes Tâches</router-link>
            <router-link to="/profile" class="text-white hover:text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Mon Profil</router-link>
            <button @click="handleLogout" class="text-white hover:text-slate-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Déconnexion</button>
          </template>
          <template v-else>
            <router-link to="/register" class="text-white hover:text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Inscription</router-link>
            <router-link to="/login" class="text-white hover:text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Connexion</router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import notificationService from '../../services/notification.service';

const router = useRouter();
const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);

const mobileMenuOpen = ref(false);

const userInitial = computed(() => user.value?.name ? user.value.name.charAt(0).toUpperCase() : '');

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    notificationService.success('Déconnexion réussie');
    router.push('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    notificationService.error('Erreur lors de la déconnexion');
  }
};
</script> 
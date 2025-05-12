<template>
  <div class="flex-1 flex flex-col items-center justify-center min-h-full px-4 pb-12">
    <div class="max-w-md w-full text-center">
      <!-- Illustration de l'erreur 404 -->
      <div class="mb-8">
        <div class="h-40 w-40 mx-auto">
          <svg class="h-full w-full text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
      </div>

      <!-- Titre et description -->
      <div class="mb-8">
        <h1 class="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Page introuvable</h2>
        <p class="text-lg text-gray-500">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      </div>

      <!-- Boutons d'action -->
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <button 
          @click="goBack" 
          class="inline-flex justify-center items-center px-5 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <router-link 
          to="/" 
          class="inline-flex justify-center items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  document.title = 'Page introuvable - Vue - TaskForce';
});
</script> 
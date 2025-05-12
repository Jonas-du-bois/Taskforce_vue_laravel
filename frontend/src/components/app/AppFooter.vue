<template>
  <footer v-if="!isAuthenticated" class="bg-slate-900 text-slate-400 py-4 fixed bottom-0 w-full z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="flex justify-center space-x-6 mb-2">
        <router-link to="/about" class="hover:text-slate-200">À propos</router-link>
        <router-link to="/contact" class="hover:text-slate-200">Contact</router-link>
        <router-link to="/mentions-legales" class="hover:text-slate-200">Mentions légales</router-link>
      </div>
      <p class="text-sm">&copy; {{ currentYear }} Vue - TaskForce. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const currentYear = computed(() => new Date().getFullYear());
</script> 
<template>
  <div 
    class="bg-white p-4 rounded-lg shadow cursor-move group relative" 
    :class="{'border-l-4 border-blue-500': task.status === 'en cours'}"
  >
    <router-link :to="`/tasks/${task.id}`">
      <div class="flex justify-between items-start mb-2">
        <h4 class="text-base font-medium text-gray-800">
          {{ task.title }}
        </h4>
        <span 
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
          :class="getPriorityClasses(task.priority)"
        >
          {{ formatPriority(task.priority) }}
        </span>
      </div>
      
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ task.description || "Aucune description" }}
      </p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center text-xs text-gray-500">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formatDate(task.due_date) }}</span>
        </div>
      </div>
    </router-link>
    
    <!-- Actions rapides (affichées au survol) -->
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
      <button 
        @click.stop="$emit('edit', task)" 
        class="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" 
        title="Modifier"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button 
        @click.stop="$emit('delete', task)" 
        class="p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600" 
        title="Supprimer"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../../utils/date.utils';
import { formatPriority, getPriorityClasses } from '../../utils/task.utils';

defineEmits(['edit', 'delete']);

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
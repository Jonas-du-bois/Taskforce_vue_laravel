<template>
  <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
    <div 
      v-for="(day, index) in weekDays" 
      :key="index" 
      :class="[
        'p-3 font-medium text-center border-r border-gray-200 last:border-r-0 relative',
        isToday(day.fullDate) ? 'bg-indigo-50' : ''
      ]"
    >
      <div class="absolute top-2 right-2">
        <button 
          @click="$emit('create-task', day.fullDate)" 
          class="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          title="Ajouter une tâche pour ce jour"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      <p :class="[isToday(day.fullDate) ? 'text-indigo-600' : 'text-gray-900']" class="font-medium capitalize">
        {{ day.name }}
      </p>
      <p :class="[isToday(day.fullDate) ? 'text-indigo-600 font-bold' : 'text-gray-500']" class="text-sm">
        {{ day.date }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { dateFormatters } from '../../utils/dateFormatters';

const props = defineProps({
  weekDays: {
    type: Array,
    required: true
  }
});

// Emits
defineEmits(['create-task']);

// Vérification si le jour est aujourd'hui
const isToday = (date) => dateFormatters.isToday(date);
</script> 
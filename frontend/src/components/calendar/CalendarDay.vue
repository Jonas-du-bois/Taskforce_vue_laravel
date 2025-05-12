<template>
  <div 
    :class="[
      'min-h-[500px] max-h-[700px] overflow-y-auto p-2',
      isToday ? 'bg-indigo-50/30' : ''
    ]"
    :data-date="formattedDate"
  >
    <div class="absolute top-2 right-2">
      <button 
        @click="$emit('create-task', dayData.fullDate)" 
        class="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
        title="Ajouter une tâche pour ce jour"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
    
    <slot :day-data="dayData">
      <!-- Contenu par défaut si aucun événement -->
      <div v-if="events.length === 0" class="h-full flex items-center justify-center text-gray-400 text-sm">
        Aucun élément
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { dateFormatters } from '../../utils/dateFormatters';

const props = defineProps({
  dayData: {
    type: Object,
    required: true
  },
  events: {
    type: Array,
    default: () => []
  }
});

// Emits
defineEmits(['create-task']);

// Computed properties
const isToday = computed(() => dateFormatters.isToday(props.dayData.fullDate));
const formattedDate = computed(() => format(props.dayData.fullDate, 'yyyy-MM-dd'));
</script> 
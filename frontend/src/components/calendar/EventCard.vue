<template>
  <div 
    class="p-2 rounded-md shadow-sm transition-shadow"
    :class="[
      eventClasses,
      element.isTask ? 'cursor-move hover:shadow-md' : 'cursor-pointer hover:shadow-md'
    ]"
    @click="$emit('select', element)"
  >
    <div class="font-medium text-sm">{{ element.label || element.title }}</div>
    <div class="flex justify-between items-center mt-1">
      <div class="text-xs text-gray-600">{{ formatTime(element.start) }} - {{ formatTime(element.end) }}</div>
      <div 
        v-if="element.isTask"
        :class="statusBadgeClasses" 
        class="text-xs px-1.5 py-0.5 rounded-full"
      >
        {{ element.status }}
      </div>
    </div>
    <div class="text-xs mt-1">
      <span v-if="element.isTask">Tâche</span>
      <span v-else>{{ element.room || 'Aucune salle' }} - {{ element.class }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { dateFormatters } from '../../utils/dateFormatters';
import eventHelpers from '../../utils/eventHelpers';

const props = defineProps({
  element: {
    type: Object,
    required: true
  }
});

// Emits
defineEmits(['select']);

// Formatage de l'heure
const formatTime = (dateString) => dateFormatters.formatTime(dateString);

// Classes CSS pour l'événement
const eventClasses = computed(() => eventHelpers.getEventClasses(props.element));

// Classes CSS pour le badge de statut
const statusBadgeClasses = computed(() => eventHelpers.getStatusBadgeClasses(props.element));
</script> 
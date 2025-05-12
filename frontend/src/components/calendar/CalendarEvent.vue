<template>
  <div 
    class="calendar-event rounded truncate cursor-pointer transition-all hover:shadow-md"
    :class="eventClasses"
    @click="$emit('click', event)"
  >
    <div class="flex items-center p-1">
      <div class="flex-shrink-0 mr-2">
        <div 
          v-if="event.time" 
          class="text-xs font-medium"
          :class="textColor"
        >
          {{ event.time }}
        </div>
        <div 
          v-else
          class="w-3 h-3 rounded-full"
          :class="dotColor"
        ></div>
      </div>
      <span class="truncate text-xs font-medium" :class="textColor">{{ eventTitle }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  showTime: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

// Couleurs basées sur la priorité
const eventClasses = computed(() => {
  const { priority } = props.event;
  
  switch (priority) {
    case 'haute':
      return 'bg-red-100 hover:bg-red-200';
    case 'moyenne':
      return 'bg-yellow-100 hover:bg-yellow-200';
    case 'basse':
      return 'bg-green-100 hover:bg-green-200';
    default:
      return props.event.isClass 
        ? 'bg-purple-100 hover:bg-purple-200' 
        : 'bg-blue-100 hover:bg-blue-200';
  }
});

// Couleur du texte
const textColor = computed(() => {
  const { priority } = props.event;
  
  switch (priority) {
    case 'haute':
      return 'text-red-800';
    case 'moyenne':
      return 'text-yellow-800';
    case 'basse':
      return 'text-green-800';
    default:
      return props.event.isClass 
        ? 'text-purple-800'
        : 'text-blue-800';
  }
});

// Couleur du point
const dotColor = computed(() => {
  const { priority } = props.event;
  
  switch (priority) {
    case 'haute':
      return 'bg-red-500';
    case 'moyenne':
      return 'bg-yellow-500';
    case 'basse':
      return 'bg-green-500';
    default:
      return props.event.isClass 
        ? 'bg-purple-500'
        : 'bg-blue-500';
  }
});

// Titre de l'événement formaté
const eventTitle = computed(() => {
  const title = props.event.title || 'Événement';
  return title.length > 25 
    ? title.substring(0, 25) + '...' 
    : title;
});
</script> 
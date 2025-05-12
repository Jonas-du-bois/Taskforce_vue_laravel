<template>
  <div class="agenda-calendar-view">
    <div class="flex items-center justify-between mb-4">
      <div class="flex space-x-4 items-center">
        <div class="w-48">
          <label for="class-select" class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
          <select 
            id="class-select" 
            v-model="selectedClass" 
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Toutes les classes</option>
            <option v-for="className in availableClasses" :key="className" :value="className">{{ className }}</option>
          </select>
        </div>
        
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            @click="() => { showTasks = true; showCourses = true; }" 
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-md focus:z-10 focus:ring-2 focus:ring-indigo-500',
              showTasks && showCourses ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Tout
          </button>
          <button 
            @click="() => { showTasks = false; showCourses = true; }" 
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-gray-300 focus:z-10 focus:ring-2 focus:ring-indigo-500',
              !showTasks && showCourses ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Cours
          </button>
          <button 
            @click="() => { showTasks = true; showCourses = false; }" 
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-indigo-500',
              showTasks && !showCourses ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Tâches
          </button>
        </div>
      </div>
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
      <svg class="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Chargement des événements...</p>
    </div>
    
    <!-- Message si aucun événement -->
    <div v-else-if="filteredEvents.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-2 text-lg text-gray-600">Aucun élément programmé pour cette période</p>
      <div class="mt-4 flex justify-center space-x-4">
        <button 
          @click="refreshData" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>
    </div>
    
    <!-- Calendrier mensuel -->
    <div v-else>
      <month-calendar 
        :events="formattedEvents"
        :initial-date="currentDate"
        @day-click="onDayClick"
        @event-click="onEventClick"
        @month-change="onMonthChange"
      />
    </div>
    
    <!-- Modal détails d'événement -->
    <div v-if="selectedEvent" class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="selectedEvent = null"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div :class="[
                'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
                selectedEvent.isTask ? getEventStatusColorClass(selectedEvent) : 'bg-indigo-100'
              ]">
                <svg v-if="selectedEvent.isTask" class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <svg v-else class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ selectedEvent.title }}
                </h3>
                <div class="mt-4">
                  <p v-if="selectedEvent.description" class="text-sm text-gray-500 mb-4">
                    {{ selectedEvent.description }}
                  </p>
                  
                  <div class="bg-gray-50 px-4 py-3 rounded-md mb-4">
                    <div class="grid grid-cols-2 gap-y-2">
                      <div>
                        <span class="text-xs text-gray-500">Type</span>
                        <p class="text-sm text-gray-900">{{ selectedEvent.isTask ? 'Tâche' : 'Cours' }}</p>
                      </div>
                      
                      <div v-if="!selectedEvent.isTask">
                        <span class="text-xs text-gray-500">Classe</span>
                        <p class="text-sm text-gray-900">{{ selectedEvent.class }}</p>
                      </div>
                      
                      <div v-if="selectedEvent.isTask">
                        <span class="text-xs text-gray-500">Statut</span>
                        <p :class="['text-sm font-medium', getTextStatusColorClass(selectedEvent)]">
                          {{ selectedEvent.status }}
                        </p>
                      </div>
                      
                      <div v-else>
                        <span class="text-xs text-gray-500">Salle</span>
                        <p class="text-sm text-gray-900">{{ selectedEvent.room || 'Non spécifiée' }}</p>
                      </div>
                      
                      <div>
                        <span class="text-xs text-gray-500">Date</span>
                        <p class="text-sm text-gray-900">{{ formatDate(selectedEvent.date) }}</p>
                      </div>
                      
                      <div v-if="selectedEvent.time">
                        <span class="text-xs text-gray-500">Heure</span>
                        <p class="text-sm text-gray-900">{{ selectedEvent.time }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              v-if="selectedEvent.isTask" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="onViewTask"
            >
              Voir la tâche
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="selectedEvent = null"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { format, parseISO, startOfMonth, endOfMonth, addMonths, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MonthCalendar } from './index.js';
import logger from '../../utils/logger';

const props = defineProps({
  courseEvents: {
    type: Array,
    default: () => []
  },
  taskEvents: {
    type: Array,
    default: () => []
  },
  availableClasses: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:selectedClass',
  'createTask', 
  'viewTask', 
  'dateChange', 
  'refresh'
]);

// État local
const selectedClass = ref('');
const selectedEvent = ref(null);
const showTasks = ref(true);
const showCourses = ref(true);
const currentDate = ref(new Date());

// Filtrer les événements en fonction des options sélectionnées
const filteredEvents = computed(() => {
  const result = [];
  
  if (showCourses.value && props.courseEvents) {
    result.push(...props.courseEvents.map(event => ({
      ...event,
      isTask: false
    })));
  }
  
  if (showTasks.value && props.taskEvents) {
    result.push(...props.taskEvents.map(event => ({
      ...event,
      isTask: true
    })));
  }
  
  return result;
});

// Formater les événements pour le calendrier
const formattedEvents = computed(() => {
  return filteredEvents.value.map(event => ({
    ...event,
    date: typeof event.date === 'string' ? parseISO(event.date) : 
          event.start ? parseISO(event.start) : new Date(event.date),
    color: event.isTask ? getTaskStatusColor(event.status) : 'indigo'
  }));
});

// Observateurs
watch(selectedClass, (newClass) => {
  emit('update:selectedClass', newClass);
});

// Actions du calendrier
function onDayClick(day) {
  emit('createTask', day.date);
}

function onEventClick(event) {
  selectedEvent.value = event;
}

function onMonthChange(date) {
  currentDate.value = date;
  
  // Calculer le début et la fin du mois pour récupérer les événements
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  emit('dateChange', { 
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd')
  });
}

function onViewTask() {
  if (selectedEvent.value && selectedEvent.value.isTask) {
    emit('viewTask', selectedEvent.value);
    selectedEvent.value = null;
  }
}

// Formatage
function formatDate(date) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
}

// Rafraîchir les données
function refreshData() {
  emit('refresh');
}

// Utilitaires pour les couleurs d'événements
function getTaskStatusColor(status) {
  if (!status) return 'gray';
  
  switch (status.toLowerCase()) {
    case 'terminée':
    case 'terminé':
    case 'done':
      return 'green';
    case 'en cours':
    case 'in_progress':
      return 'yellow';
    case 'à faire':
    case 'to_do':
    default:
      return 'red';
  }
}

function getEventStatusColorClass(event) {
  if (!event.isTask) return 'bg-indigo-100';
  
  const color = getTaskStatusColor(event.status);
  return `bg-${color}-500`;
}

function getTextStatusColorClass(event) {
  if (!event.isTask) return '';
  
  const color = getTaskStatusColor(event.status);
  return `text-${color}-600`;
}
</script>
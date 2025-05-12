<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Agenda des cours et tâches</h1>
      
      <button 
        @click="goToToday" 
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Aujourd'hui
      </button>
    </div>
    
    <!-- Contrôles -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div class="w-full md:w-48">
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
        
        <div class="w-full md:w-auto">
          <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Période</label>
          <div class="flex items-center gap-2">
            <button 
              @click="previousWeek" 
              class="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span class="text-sm font-medium px-3 py-2 bg-gray-100 rounded-md">{{ formatDateRange(startDate, endDate) }}</span>
            
            <button 
              @click="nextWeek" 
              class="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Afficher</label>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button 
              @click="showTasks = true; showCourses = true" 
              :class="[
                'px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-md focus:z-10 focus:ring-2',
                showTasks && showCourses ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Tout
            </button>
            <button 
              @click="showTasks = false; showCourses = true" 
              :class="[
                'px-4 py-2 text-sm font-medium border-t border-b border-gray-300 focus:z-10 focus:ring-2',
                !showTasks && showCourses ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Cours
            </button>
            <button 
              @click="showTasks = true; showCourses = false" 
              :class="[
                'px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-md focus:z-10 focus:ring-2',
                showTasks && !showCourses ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Tâches
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
      <svg class="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Chargement de l'emploi du temps...</p>
    </div>
    
    <!-- Message si aucun événement -->
    <div v-if="filteredEvents.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-2 text-lg text-gray-600">Aucun élément programmé pour cette période</p>
      <div class="mt-4 flex justify-center space-x-4">
        <button 
          @click="loadEvents" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
        <button 
          @click="goToToday" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Voir aujourd'hui
        </button>
      </div>
    </div>
    
    <!-- Calendrier -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- En-têtes des jours -->
      <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        <div v-for="(day, index) in weekDays" :key="index" 
            :class="[
              'p-3 font-medium text-center border-r border-gray-200 last:border-r-0',
              isToday(day.fullDate) ? 'bg-indigo-50' : ''
            ]"
        >
          <div class="absolute top-2 right-2">
            <button 
              @click="createTaskForDate(day.fullDate)" 
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
      
      <!-- Événements regroupés par jour -->
      <div class="grid grid-cols-7 divide-x divide-gray-200">
        <div v-for="(dayEvents, dayIndex) in filteredEventsByDay" :key="dayIndex" 
            :class="[
              'min-h-[500px] max-h-[700px] overflow-y-auto p-2',
              isToday(weekDays[dayIndex].fullDate) ? 'bg-indigo-50/30' : ''
            ]"
            :data-date="format(weekDays[dayIndex].fullDate, 'yyyy-MM-dd')"
        >
          <draggable 
            v-model="filteredEventsByDay[dayIndex]" 
            group="events" 
            item-key="id"
            @end="handleDragEnd"
            :data-day-index="dayIndex" 
            :data-date="format(weekDays[dayIndex].fullDate, 'yyyy-MM-dd')"
            class="space-y-2 min-h-[450px]"
          >
            <template #header v-if="dayEvents.length === 0">
              <div class="h-full flex items-center justify-center text-gray-400 text-sm">
            Aucun élément
          </div>
            </template>
            
            <template #item="{ element }">
              <div 
                class="p-2 rounded-md shadow-sm transition-shadow"
                :class="[
                  getEventClasses(element),
                  element.isTask ? 'cursor-move hover:shadow-md' : 'cursor-pointer hover:shadow-md'
                ]"
                @click="selectEvent(element)"
              >
                <div class="font-medium text-sm">{{ element.label || element.title }}</div>
              <div class="flex justify-between items-center mt-1">
                  <div class="text-xs text-gray-600">{{ formatTime(element.start) }} - {{ formatTime(element.end) }}</div>
                  <div 
                    v-if="element.isTask"
                    :class="getStatusBadgeClasses(element)" 
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
          </draggable>
        </div>
      </div>
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
                  {{ selectedEvent.label || selectedEvent.title }}
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
                        <p class="text-sm text-gray-900">{{ formatDate(selectedEvent.start) }}</p>
                      </div>
                      
                      <div>
                        <span class="text-xs text-gray-500">Horaire</span>
                        <p class="text-sm text-gray-900">{{ formatTime(selectedEvent.start) }} - {{ formatTime(selectedEvent.end) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button v-if="selectedEvent.isTask"
              type="button"
              @click="viewTask"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Voir la tâche
            </button>
            <button
              type="button"
              @click="selectedEvent = null"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Utilisation du composant TaskModal -->
    <TaskModal 
      :show="showTaskModal" 
      :task="currentTask" 
      :loading="saving"
      @close="closeTaskModal" 
      @submit="saveTask"
    />

    <!-- Modale de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeDeleteModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Supprimer la tâche
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="deleteTask" 
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Supprimer
            </button>
            <button 
              type="button" 
              @click="closeDeleteModal" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, addDays, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import agendaService from '@/services/agenda.service';
import logger from '@/utils/logger';
import { useTaskStore } from '@/stores/task';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import TaskModal from '@/components/tasks/TaskModal.vue';
import draggable from 'vuedraggable';
import { useNotificationStore } from '@/stores/notification';
import ScheduleViewer from '@/components/ScheduleViewer.vue';

// Router et stores
const router = useRouter();
const taskStore = useTaskStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { user } = storeToRefs(authStore);

// État local
const loading = ref(false);
const events = ref([]);
const tasks = ref([]);
const availableClasses = ref([]);
const selectedClass = ref('');
const selectedEvent = ref(null);
const showTasks = ref(true);
const showCourses = ref(true);
const showTaskModal = ref(false);
const currentTask = ref(null);
const saving = ref(false);
const showDeleteModal = ref(false);
const deleting = ref(false);

// Définir la semaine actuelle (du lundi au dimanche)
const startDate = ref(startOfWeek(new Date(), { weekStartsOn: 1 }));
const endDate = ref(endOfWeek(new Date(), { weekStartsOn: 1 }));

// Événements filtrés (cours + tâches)
const filteredEvents = computed(() => {
  const result = [];
  
  if (showCourses.value) {
    // Convertir les cours au même format que les tâches pour une affichage cohérent
    result.push(...events.value.map(event => ({
      ...event,
      isTask: false,
      title: event.title || event.label,
      label: event.label || event.title,
      start: event.start || event.date,
      end: event.end || (event.start ? addHours(new Date(event.start), 1).toISOString() : undefined)
    })));
  }
  
  if (showTasks.value) {
    result.push(...tasks.value);
  }
  
  return result;
});

// Charger les données
onMounted(async () => {
  try {
    loading.value = true;
    
    // Récupérer le profil utilisateur directement depuis l'API
    logger.info('AgendaView', 'Tentative de récupération du profil utilisateur depuis l\'API...');
    const userProfile = await agendaService.getUserProfile();
    
    // Charger la liste des classes disponibles
    availableClasses.value = await agendaService.getAvailableClasses();
    logger.info('AgendaView', `Classes disponibles: ${availableClasses.value.join(', ')}`);
    
    // Déboguer les informations de l'utilisateur
    if (userProfile && userProfile.class) {
      logger.info('AgendaView', `Classe utilisateur depuis l'API: "${userProfile.class}"`);
      
      // Essayer de trouver une correspondance exacte
      if (availableClasses.value.includes(userProfile.class)) {
        selectedClass.value = userProfile.class;
        logger.info('AgendaView', `Classe définie exactement à: ${selectedClass.value}`);
      } 
      // Sinon essayer avec correspondance partielle
      else {
        const userClassLower = userProfile.class.toLowerCase();
        const matchingClass = availableClasses.value.find(cls => 
          cls.toLowerCase().includes(userClassLower) || userClassLower.includes(cls.toLowerCase())
        );
        
        if (matchingClass) {
          selectedClass.value = matchingClass;
          logger.info('AgendaView', `Classe définie par correspondance partielle à: ${selectedClass.value}`);
        } else {
          logger.warn('AgendaView', `Aucune correspondance trouvée pour la classe "${userProfile.class}"`);
        }
      }
    } else if (user.value && user.value.class) {
      // Fallback sur le store d'authentification si l'API directe échoue
      logger.info('AgendaView', `Utilisation de la classe du store d'authentification: "${user.value.class}"`);
      
      // Même logique de correspondance que précédemment
      if (availableClasses.value.includes(user.value.class)) {
        selectedClass.value = user.value.class;
        logger.info('AgendaView', `Classe définie exactement à: ${selectedClass.value}`);
      } else {
        const userClassLower = user.value.class.toLowerCase();
        const matchingClass = availableClasses.value.find(cls => 
          cls.toLowerCase().includes(userClassLower) || userClassLower.includes(cls.toLowerCase())
        );
        
        if (matchingClass) {
          selectedClass.value = matchingClass;
          logger.info('AgendaView', `Classe définie par correspondance partielle à: ${selectedClass.value}`);
        } else {
          logger.warn('AgendaView', `Aucune correspondance trouvée pour la classe "${user.value.class}"`);
        }
      }
    } else {
      logger.warn('AgendaView', `Aucune classe définie dans le profil utilisateur`);
    }
    
    // Charger les événements
    await loadEvents();
    
    // Charger les tâches
    await loadTasks();
  } catch (error) {
    logger.error('AgendaView', 'Erreur lors du chargement initial', error);
  } finally {
    loading.value = false;
  }
});

// Charger les événements en fonction de la classe et de la période sélectionnées
async function loadEvents() {
  try {
    const start = format(startDate.value, 'yyyy-MM-dd');
    const end = format(endDate.value, 'yyyy-MM-dd');
    
    if (selectedClass.value) {
      events.value = await agendaService.getScheduleForClass(
        selectedClass.value, 
        start,
        end
      );
    } else {
      events.value = await agendaService.getAllSchedules(start, end);
    }
    
    logger.info('AgendaView', `${events.value.length} événements chargés`);
  } catch (error) {
    logger.error('AgendaView', 'Erreur lors du chargement des événements', error);
  }
}

// Charger les tâches avec une date d'échéance
async function loadTasks() {
  try {
    // Formater les dates
    const start = format(startDate.value, 'yyyy-MM-dd');
    const end = format(endDate.value, 'yyyy-MM-dd');
    
    // Récupérer les tâches depuis le store
    await taskStore.fetchTasks({
      due_date_from: start,
      due_date_to: end
    });
    
    // Convertir les tâches en format d'événement
    tasks.value = taskStore.getAllTasks
      .filter(task => task.due_date)
      .map(task => convertTaskToEvent(task));
    
    logger.info('AgendaView', `${tasks.value.length} tâches chargées`);
  } catch (error) {
    logger.error('AgendaView', 'Erreur lors du chargement des tâches', error);
  }
}

// Convertir une tâche en format d'événement
function convertTaskToEvent(task) {
  if (!task.due_date) return null;
  
  const dueDate = new Date(task.due_date);
  // Créer une date de fin (1 heure après la date d'échéance)
  const endDate = new Date(dueDate);
  endDate.setHours(dueDate.getHours() + 1);
  
  return {
    id: `task-${task.id}`,
    title: task.title,
    label: task.title,
    description: task.description,
    start: dueDate.toISOString(),
    end: endDate.toISOString(),
    status: task.status || 'à faire',
    priority: task.priority,
    isTask: true,
    original: task
  };
}

// Navigation dans le temps
function previousWeek() {
  startDate.value = subWeeks(startDate.value, 1);
  endDate.value = subWeeks(endDate.value, 1);
  refreshData();
}

function nextWeek() {
  startDate.value = addWeeks(startDate.value, 1);
  endDate.value = addWeeks(endDate.value, 1);
  refreshData();
}

function goToToday() {
  startDate.value = startOfWeek(new Date(), { weekStartsOn: 1 });
  endDate.value = endOfWeek(new Date(), { weekStartsOn: 1 });
  refreshData();
}

// Rafraîchir toutes les données
async function refreshData() {
  loading.value = true;
  await Promise.all([
    loadEvents(),
    loadTasks()
  ]);
  loading.value = false;
}

// Surveillance des changements de classe
watch(selectedClass, () => {
  loadEvents();
});

// Jours de la semaine
const weekDays = computed(() => {
  const days = eachDayOfInterval({
    start: startDate.value,
    end: endDate.value
  });
  
  return days.map(day => ({
    name: format(day, 'EEEE', { locale: fr }),
    date: format(day, 'dd/MM'),
    fullDate: day
  }));
});

// Événements regroupés par jour
const filteredEventsByDay = computed(() => {
  return weekDays.value.map(day => {
    return filteredEvents.value.filter(event => {
      const eventDate = parseISO(event.start);
      return isSameDay(eventDate, day.fullDate);
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  });
});

// Vérifier si une date est aujourd'hui
function isToday(date) {
  return isSameDay(date, new Date());
}

// Formatage et affichage
function formatDateRange(start, end) {
  return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
}

function formatDate(dateString) {
  const date = parseISO(dateString);
  return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
}

function formatTime(dateString) {
  const date = parseISO(dateString);
  return format(date, 'HH:mm');
}

function getEventClasses(event) {
  if (event.isTask) {
    // Styles pour les tâches
    return {
      [`bg-${getTaskStatusColor(event.status)}-50`]: true,
      [`border-l-4 border-${getTaskStatusColor(event.status)}-500`]: true
    };
  } else {
    // Générer une couleur pseudo-aléatoire basée sur le nom de la classe
    const classNameHash = event.class.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = (classNameHash % 360);
    
    return {
      [`bg-[hsl(${hue},85%,93%)]`]: true,
      [`border-l-4 border-[hsl(${hue},75%,60%)]`]: true
    };
  }
}

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

function getStatusBadgeClasses(event) {
  if (!event.isTask) return '';
  
  const color = getTaskStatusColor(event.status);
  return {
    [`bg-${color}-100 text-${color}-800`]: true
  };
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

function selectEvent(event) {
  selectedEvent.value = event;
}

function viewTask() {
  if (selectedEvent.value && selectedEvent.value.isTask && selectedEvent.value.original && selectedEvent.value.original.id) {
    router.push(`/tasks/${selectedEvent.value.original.id}`);
  }
}

function showCreateTaskModal() {
  currentTask.value = {
    title: '',
    description: '',
    status: 'à faire',
    priority: 'moyenne',
    due_date: format(new Date(), 'yyyy-MM-dd') // Date du jour par défaut
  };
  showTaskModal.value = true;
}

function closeTaskModal() {
  showTaskModal.value = false;
  currentTask.value = null;
}

function saveTask(task) {
  saving.value = true;
  if (task.id) {
    // Mettre à jour la tâche
    taskStore.updateTask(task)
      .then(() => {
        loadTasks();
        closeTaskModal();
      })
      .catch(error => {
        logger.error('AgendaView', 'Erreur lors de la mise à jour de la tâche', error);
      })
      .finally(() => {
        saving.value = false;
      });
  } else {
    // Créer une nouvelle tâche
    taskStore.createTask(task)
      .then(() => {
        loadTasks();
        closeTaskModal();
      })
      .catch(error => {
        logger.error('AgendaView', 'Erreur lors de la création de la tâche', error);
      })
      .finally(() => {
        saving.value = false;
      });
  }
}

function confirmDeleteTask() {
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
}

function deleteTask() {
  deleting.value = true;
  taskStore.deleteTask(currentTask.value.id)
    .then(() => {
      loadTasks();
      closeDeleteModal();
    })
    .catch(error => {
      logger.error('AgendaView', 'Erreur lors de la suppression de la tâche', error);
    })
    .finally(() => {
      deleting.value = false;
    });
}

function createTaskForDate(date) {
  currentTask.value = {
    title: '',
    description: '',
    status: 'à faire',
    priority: 'moyenne',
    due_date: format(date, 'yyyy-MM-dd')
  };
  showTaskModal.value = true;
}

// Fonction pour gérer le drag and drop des tâches
async function handleDragEnd(event) {
  const { item, to, from } = event;
  
  // Si ce n'est pas une tâche, on ne fait rien
  if (!item._underlying_vm_ || !item._underlying_vm_.isTask) {
    return;
  }
  
  // Si déplacé dans le même jour, ne rien faire
  if (to === from) {
    return;
  }
  
  const task = item._underlying_vm_.original;
  const newDateStr = to.dataset.date;
  
  if (!task || !newDateStr) {
    logger.error('AgendaView', 'Informations manquantes pour mettre à jour la tâche');
    return;
  }
  
  try {
    logger.task('AgendaView', 'Changement de date d\'une tâche', { 
      id: task.id, 
      date: newDateStr
    });
    
    // Créer une copie de la tâche avec la nouvelle date
    const updatedTask = {
      ...task,
      due_date: newDateStr
    };
    
    // Mettre à jour la tâche avec la nouvelle date d'échéance
    await taskStore.updateTask(updatedTask);
    
    logger.task('AgendaView', 'Date de tâche mise à jour avec succès', { 
      id: task.id, 
      date: newDateStr 
    });
    
    // Recharger les tâches pour mettre à jour l'affichage
    await loadTasks();
  } catch (error) {
    logger.error('AgendaView', 'Erreur lors de la mise à jour de la date de la tâche', {
      id: task.id,
      error: error.message
    });
    
    // Recharger les tâches pour restaurer l'état original
    await loadTasks();
  }
}

// Gestion des erreurs
function handleError(errorMessage) {
  error.value = errorMessage;
  logger.error('AgendaView', 'Erreur lors du chargement des données', errorMessage);
}
</script>

<style scoped>
/* ... existing code ... */
</style>
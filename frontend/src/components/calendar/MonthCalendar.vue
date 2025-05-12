<template>
  <div class="month-calendar bg-white rounded-lg shadow-md p-4">
    <!-- En-tête du calendrier -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">{{ formattedMonth }}</h2>
      <div class="flex space-x-2">
        <button 
          @click="previousMonth"
          class="p-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="goToCurrentMonth"
          class="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Aujourd'hui
        </button>
        <button 
          @click="nextMonth"
          class="p-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Jours de la semaine -->
    <div class="grid grid-cols-7 gap-2 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-sm font-medium text-gray-500 py-2">
        {{ day }}
      </div>
    </div>

    <!-- Jours du mois -->
    <div class="grid grid-cols-7 gap-2">
      <calendar-day 
        v-for="(day, index) in calendarDays" 
        :key="index"
        :day-number="day.dayNumber"
        :events="getEventsForDay(day.date)"
        :is-today="isToday(day.date)"
        @click="selectDay(day)"
        @show-more="showMoreEvents(day)"
      />
    </div>

    <!-- Modal pour afficher plus d'événements d'un jour -->
    <div v-if="selectedDayForEvents" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-medium">Événements du {{ formatDate(selectedDayForEvents.date) }}</h3>
          <button @click="selectedDayForEvents = null" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <div v-if="!selectedDayEvents.length" class="text-center text-gray-500 py-4">
            Aucun événement pour cette journée.
          </div>
          <div v-else class="space-y-2">
            <calendar-event 
              v-for="event in selectedDayEvents" 
              :key="event.id"
              :event="event"
              @click="$emit('eventClick', event)"
            />
          </div>
        </div>
        <div class="p-4 border-t flex justify-end">
          <button 
            @click="selectedDayForEvents = null"
            class="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import CalendarDay from './CalendarDay.vue';
import CalendarEvent from './CalendarEvent.vue';

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  initialDate: {
    type: [Date, String],
    default: () => new Date()
  }
});

const emit = defineEmits(['dayClick', 'eventClick', 'monthChange']);

// État
const currentDate = ref(new Date(props.initialDate));
const selectedDayForEvents = ref(null);

// Jours de la semaine
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Format du mois affiché
const formattedMonth = computed(() => {
  return format(currentDate.value, 'MMMM yyyy', { locale: fr });
});

// Calculer tous les jours du mois à afficher
const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Semaine commençant le lundi

  const days = [];
  let day = startDate;

  while (day <= monthEnd || days.length % 7 !== 0) {
    days.push({
      date: new Date(day),
      dayNumber: day.getDate(),
      isCurrentMonth: isSameMonth(day, monthStart)
    });
    day = addDays(day, 1);
  }

  return days;
});

// Événements du jour sélectionné
const selectedDayEvents = computed(() => {
  if (!selectedDayForEvents.value) return [];
  return getEventsForDay(selectedDayForEvents.value.date);
});

// Navigation
function previousMonth() {
  currentDate.value = subMonths(currentDate.value, 1);
  emit('monthChange', currentDate.value);
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1);
  emit('monthChange', currentDate.value);
}

function goToCurrentMonth() {
  currentDate.value = new Date();
  emit('monthChange', currentDate.value);
}

// Vérifier si un jour est aujourd'hui
function isToday(date) {
  return isSameDay(date, new Date());
}

// Formater une date pour l'affichage
function formatDate(date) {
  return format(date, 'dd MMMM yyyy', { locale: fr });
}

// Obtenir les événements pour un jour spécifique
function getEventsForDay(date) {
  if (!props.events || !props.events.length) return [];
  
  return props.events.filter(event => {
    // Gérer les dates sous forme de chaînes ou d'objets Date
    const eventDate = typeof event.date === 'string' ? parseISO(event.date) : new Date(event.date);
    return isSameDay(eventDate, date);
  });
}

// Sélectionner un jour
function selectDay(day) {
  emit('dayClick', day);
}

// Afficher plus d'événements pour un jour
function showMoreEvents(day) {
  selectedDayForEvents.value = day;
}

// Observer les changements de date initiale
watch(() => props.initialDate, (newDate) => {
  currentDate.value = new Date(newDate);
}, { immediate: true });
</script> 
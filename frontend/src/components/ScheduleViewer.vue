<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      <span class="ml-3 text-gray-600">Chargement des horaires...</span>
    </div>

    <div v-else>
      <div class="mb-6">
        <label for="class-select" class="block text-sm font-medium text-gray-700 mb-2">
          {{ title || 'Sélectionnez une classe' }}
        </label>
        <div class="flex gap-4 flex-wrap items-center">
          <select 
            id="class-select" 
            v-model="selectedClass" 
            class="mt-1 block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Choisir une classe</option>
            <option v-for="classItem in availableClasses" :key="classItem" :value="classItem">
              {{ classItem }}
            </option>
          </select>
          
          <button 
            @click="refreshData" 
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading || refreshing"
            :class="{ 'opacity-50 cursor-not-allowed': loading || refreshing }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" :class="{ 'animate-spin': refreshing }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01-.61-1.276z" clip-rule="evenodd" />
            </svg>
            Rafraîchir
          </button>
        </div>
      </div>

      <div v-if="selectedClass && scheduleData[selectedClass]">
        <div class="mb-4 p-4 border border-indigo-100 bg-indigo-50 rounded-md">
          <div class="text-sm text-indigo-800">
            <span class="font-semibold">Info:</span> Emploi du temps pour la classe {{ selectedClass }}
            <span class="block mt-1 text-xs">
              {{ scheduleData[selectedClass].length }} cours programmés
            </span>
          </div>
        </div>

        <!-- Tableau des horaires -->
        <div class="bg-white overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaire</th>
                <th v-for="day in days" :key="day" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="timeSlot in timeSlots" :key="timeSlot">
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500 font-medium border-r border-gray-100">
                  {{ timeSlot }}
                </td>
                <td v-for="day in days" :key="day" class="px-1 py-1 border-r border-gray-100">
                  <div 
                    v-for="event in getEventsForTimeAndDay(timeSlot, day)" 
                    :key="event.id"
                    class="p-1 mb-1 rounded text-xs"
                    :class="getEventColor(event)"
                  >
                    <div class="font-semibold">{{ event.label }}</div>
                    <div v-if="event.room" class="text-[10px]">Salle: {{ event.room }}</div>
                    <div class="text-[10px]">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="selectedClass && !scheduleData[selectedClass]" class="p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900">Aucun horaire disponible</h3>
        <p class="mt-2 text-sm text-gray-500">
          Aucun cours n'est programmé pour la classe {{ selectedClass }}.
        </p>
      </div>

      <div v-else-if="availableClasses.length === 0" class="p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900">Aucune classe disponible</h3>
        <p class="mt-2 text-sm text-gray-500">
          Aucune classe n'a été trouvée. Veuillez réessayer plus tard.
        </p>
      </div>

      <div v-else class="p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900">Sélectionnez une classe</h3>
        <p class="mt-2 text-sm text-gray-500">
          Veuillez sélectionner une classe dans le menu déroulant pour afficher son emploi du temps.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import agendaService from '../services/agenda.service';
import logger from '../utils/logger';

/**
 * Composant réutilisable pour l'affichage des emplois du temps
 * 
 * Ce composant permet d'afficher les emplois du temps des classes de manière interactive.
 * Il gère le chargement des données, la sélection des classes et l'affichage des cours.
 * 
 * Utilisé dans:
 * - ScheduleView: Vue principale des emplois du temps
 * - AgendaView: Vue de l'agenda quand seuls les cours sont affichés
 * 
 * @props {String} title - Titre à afficher au-dessus du sélecteur de classe
 * @props {String} defaultClass - Classe sélectionnée par défaut
 * @emits {Error} error - Émis en cas d'erreur lors du chargement des données
 * @emits {Boolean} loading - Émis pour indiquer l'état de chargement
 */
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  defaultClass: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const loading = ref(true);
const refreshing = ref(false);
const scheduleData = ref({});
const selectedClass = ref('');
const error = ref(null);

// Jours de la semaine
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

// Créneaux horaires (8h à 18h par paliers de 1h)
const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00'
];

// Liste des classes disponibles
const availableClasses = computed(() => {
  return Object.keys(scheduleData.value).sort();
});

// Fonction pour rafraîchir les données
async function refreshData() {
  try {
    refreshing.value = true;
    await fetchSchedules();
    logger.info('ScheduleViewer', 'Données des horaires rafraîchies avec succès');
  } catch (err) {
    logger.error('ScheduleViewer', `Erreur lors du rafraîchissement : ${err.message}`);
    error.value = 'Impossible de rafraîchir les données. Veuillez réessayer.';
  } finally {
    refreshing.value = false;
  }
}

// Charger les horaires depuis le service
async function fetchSchedules() {
  try {
    loading.value = true;
    error.value = null;
    
    const data = await agendaService.fetchSchedules();
    scheduleData.value = data;
    
    logger.info('ScheduleViewer', `${Object.keys(data).length} classes chargées`);
    
    // Si pas de classe sélectionnée mais qu'il y a une classe par défaut, la sélectionner
    if (!selectedClass.value && props.defaultClass && data[props.defaultClass]) {
      selectedClass.value = props.defaultClass;
    }
    // Si pas de classe sélectionnée, sélectionner la première disponible
    else if (!selectedClass.value && Object.keys(data).length > 0) {
      selectedClass.value = Object.keys(data)[0];
    }

  } catch (err) {
    logger.error('ScheduleViewer', `Erreur lors du chargement des horaires : ${err.message}`);
    error.value = "Impossible de charger les horaires. Veuillez réessayer plus tard.";
  } finally {
    loading.value = false;
  }
}

// Récupérer les événements pour un créneau horaire et un jour spécifique
function getEventsForTimeAndDay(timeSlot, day) {
  if (!selectedClass.value || !scheduleData.value[selectedClass.value]) {
    return [];
  }

  // Extraire les heures de début et de fin du créneau
  const [start, end] = timeSlot.split('-');
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  // Convertir en minutes depuis minuit pour faciliter la comparaison
  const slotStartTime = startHour * 60 + startMinute;
  const slotEndTime = endHour * 60 + endMinute;

  // Mappage des jours français en anglais pour correspondre aux données
  const dayMap = {
    'Lundi': 'Monday',
    'Mardi': 'Tuesday',
    'Mercredi': 'Wednesday',
    'Jeudi': 'Thursday',
    'Vendredi': 'Friday'
  };

  return scheduleData.value[selectedClass.value].filter(event => {
    // Extraire le jour de la date de l'événement
    const eventDate = new Date(event.start);
    const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Vérifier si le jour correspond
    if (eventDay !== dayMap[day]) {
      return false;
    }
    
    // Extraire les heures et minutes de début et de fin de l'événement
    const eventStartHour = eventDate.getHours();
    const eventStartMinute = eventDate.getMinutes();
    const eventStartTime = eventStartHour * 60 + eventStartMinute;
    
    const eventEndDate = new Date(event.end);
    const eventEndHour = eventEndDate.getHours();
    const eventEndMinute = eventEndDate.getMinutes();
    const eventEndTime = eventEndHour * 60 + eventEndMinute;
    
    // Vérifier si l'événement chevauche le créneau horaire
    return (
      (eventStartTime >= slotStartTime && eventStartTime < slotEndTime) || // L'événement commence pendant le créneau
      (eventEndTime > slotStartTime && eventEndTime <= slotEndTime) || // L'événement se termine pendant le créneau
      (eventStartTime <= slotStartTime && eventEndTime >= slotEndTime) // L'événement englobe le créneau
    );
  });
}

// Déterminer la couleur en fonction du type d'événement
function getEventColor(event) {
  // Couleurs par défaut pour les différents types
  const typeColors = {
    'CM': 'bg-blue-100 text-blue-800',
    'TD': 'bg-green-100 text-green-800',
    'TP': 'bg-purple-100 text-purple-800',
    'Examen': 'bg-red-100 text-red-800'
  };
  
  // Extraire le type du label si possible
  const typeMatch = event.label.match(/\b(CM|TD|TP|Examen)\b/);
  if (typeMatch) {
    return typeColors[typeMatch[1]] || 'bg-gray-100 text-gray-800';
  }
  
  // Couleur par défaut
  return 'bg-gray-100 text-gray-800';
}

// Formater une date en heure:minute
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
}

// Mettre à jour l'URL lorsque la classe change
watch(selectedClass, (newClass) => {
  if (newClass) {
    router.replace({ query: { ...router.currentRoute.value.query, class: newClass } });
    logger.debug('ScheduleViewer', `Classe sélectionnée changée pour ${newClass}`);
  }
});

// Initialiser les données au chargement du composant
onMounted(async () => {
  await fetchSchedules();
});
</script> 
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import agendaService from '../services/agenda.service';
import logger from '../utils/logger';
import { useNotificationStore } from './notification';

export const useAgendaStore = defineStore('agenda', () => {
  // État
  const events = ref([]);
  const classes = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedClass = ref(null);
  const availableClasses = ref([]);
  const currentDateRange = ref({
    startDate: null,
    endDate: null
  });

  // Getters
  const filteredEvents = computed(() => {
    if (!selectedClass.value) return events.value;
    
    return events.value.filter(event => 
      event.class === selectedClass.value
    );
  });

  const formattedEvents = computed(() => {
    return filteredEvents.value.map(event => {
      return agendaService.formatEvent(event);
    });
  });

  const eventsGroupedByDay = computed(() => {
    const grouped = {};
    
    formattedEvents.value.forEach(event => {
      const dateKey = event.start.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Trier les événements par heure de début dans chaque groupe
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => new Date(a.start) - new Date(b.start));
    });
    
    return grouped;
  });

  const groupedByDate = computed(() => {
    const grouped = {};
    
    filteredEvents.value.forEach(event => {
      const dateStr = format(parseISO(event.start), 'yyyy-MM-dd');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    });
    
    // Trier les événements par heure de début pour chaque jour
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        return parseISO(a.start) - parseISO(b.start);
      });
    });
    
    return grouped;
  });

  const formattedDates = computed(() => {
    return Object.keys(groupedByDate.value).map(dateStr => {
      const date = parseISO(dateStr);
      return {
        dateStr,
        dayName: format(date, 'EEEE', { locale: fr }),
        dayNumber: format(date, 'd', { locale: fr }),
        month: format(date, 'MMMM', { locale: fr }),
        year: format(date, 'yyyy')
      };
    });
  });

  // Actions
  async function fetchEvents(startDate, endDate) {
    const notificationStore = useNotificationStore();
    isLoading.value = true;
    error.value = null;
    
    try {
      logger.info('AgendaStore', `Chargement des événements du ${startDate} au ${endDate}`);
      
      // Mettre à jour la plage de dates actuelle
      currentDateRange.value = { startDate, endDate };
      
      const data = await agendaService.getAllSchedules(startDate, endDate);
      events.value = data;
      
      logger.info('AgendaStore', `${events.value.length} événements chargés`);
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des événements';
      logger.error('AgendaStore', error.value, err);
      notificationStore.addNotification({
        type: 'error',
        message: 'Impossible de récupérer les emplois du temps',
        duration: 5000
      });
      events.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchClasses() {
    const notificationStore = useNotificationStore();
    isLoading.value = true;
    error.value = null;
    
    try {
      logger.info('AgendaStore', 'Chargement des classes disponibles');
      
      const data = await agendaService.getAvailableClasses();
      availableClasses.value = data;
      
      logger.info('AgendaStore', `${availableClasses.value.length} classes chargées`);
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des classes';
      logger.error('AgendaStore', error.value, err);
      notificationStore.addNotification({
        type: 'error',
        message: 'Impossible de récupérer la liste des classes',
        duration: 5000
      });
      classes.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  function setSelectedClass(className) {
    logger.info('AgendaStore', `Sélection de la classe: ${className || 'Toutes'}`);
    selectedClass.value = className;
  }

  async function getEventDetails(eventId) {
    const notificationStore = useNotificationStore();
    isLoading.value = true;
    error.value = null;
    
    try {
      logger.info('AgendaStore', `Récupération des détails de l'événement #${eventId}`);
      
      const event = await agendaService.getEventById(eventId);
      return agendaService.formatEvent(event);
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération de l'événement #${eventId}`;
      logger.error('AgendaStore', error.value, err);
      notificationStore.addNotification({
        type: 'error',
        message: `Impossible de récupérer les détails de l'événement #${eventId}`,
        duration: 5000
      });
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Réinitialiser le store
  function resetState() {
    events.value = [];
    isLoading.value = false;
    error.value = null;
    selectedClass.value = null;
    currentDateRange.value = { startDate: null, endDate: null };
  }

  return {
    // État
    events,
    classes,
    isLoading,
    error,
    selectedClass,
    availableClasses,
    currentDateRange,
    
    // Getters
    filteredEvents,
    formattedEvents,
    eventsGroupedByDay,
    groupedByDate,
    formattedDates,
    
    // Actions
    fetchEvents,
    fetchClasses,
    setSelectedClass,
    getEventDetails,
    resetState
  };
});
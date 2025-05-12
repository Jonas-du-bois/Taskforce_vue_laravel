<template>
  <div class="w-full h-full bg-white rounded-lg shadow-md">
    <agenda-calendar-view
      :course-events="events"
      :task-events="taskEvents"
      :available-classes="availableClasses"
      :loading="loading"
      @update:selected-class="onClassChange"
      @date-change="onDateChange"
      @create-task="onCreateTask"
      @view-task="onViewTask"
      @refresh="loadData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { AgendaCalendarView } from '.';
import agendaService from '../../services/agenda.service';
import { useTaskStore } from '../../stores/task';
import logger from '../../utils/logger';

// Router et stores
const router = useRouter();
const taskStore = useTaskStore();

// État
const loading = ref(false);
const events = ref([]);
const taskEvents = ref([]);
const availableClasses = ref([]);
const selectedClass = ref('');
const currentDateRange = ref({
  start: format(new Date(), 'yyyy-MM-dd'),
  end: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
});

// Chargement initial
onMounted(async () => {
  try {
    loading.value = true;
    
    // Charger la liste des classes disponibles
    availableClasses.value = await agendaService.getAvailableClasses();
    
    // Charger les événements
    await loadData();
  } catch (error) {
    logger.error('AgendaCalendar', 'Erreur lors du chargement initial', error);
  } finally {
    loading.value = false;
  }
});

// Charger les événements
async function loadData() {
  try {
    loading.value = true;
    
    // Charger les cours
    await loadEvents();
    
    // Charger les tâches
    await loadTasks();
  } catch (error) {
    logger.error('AgendaCalendar', 'Erreur lors du chargement des données', error);
  } finally {
    loading.value = false;
  }
}

// Charger les événements (cours)
async function loadEvents() {
  try {
    const { start, end } = currentDateRange.value;
    
    if (selectedClass.value) {
      events.value = await agendaService.getScheduleForClass(
        selectedClass.value, 
        start,
        end
      );
    } else {
      events.value = await agendaService.getAllSchedules(start, end);
    }
    
    logger.info('AgendaCalendar', `${events.value.length} événements chargés`);
  } catch (error) {
    logger.error('AgendaCalendar', 'Erreur lors du chargement des événements', error);
  }
}

// Charger les tâches
async function loadTasks() {
  try {
    const { start, end } = currentDateRange.value;
    
    // Récupérer les tâches depuis le store
    await taskStore.fetchTasks({
      due_date_from: start,
      due_date_to: end
    });
    
    // Convertir les tâches en format d'événement
    taskEvents.value = taskStore.getAllTasks
      .filter(task => task.due_date)
      .map(task => convertTaskToEvent(task));
    
    logger.info('AgendaCalendar', `${taskEvents.value.length} tâches chargées`);
  } catch (error) {
    logger.error('AgendaCalendar', 'Erreur lors du chargement des tâches', error);
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
    description: task.description,
    date: dueDate,
    start: dueDate.toISOString(),
    end: endDate.toISOString(),
    status: task.status || 'à faire',
    priority: task.priority,
    isTask: true,
    original: task
  };
}

// Gestionnaires d'événements
function onClassChange(newClass) {
  selectedClass.value = newClass;
  loadEvents();
}

function onDateChange({ start, end }) {
  currentDateRange.value = { start, end };
  loadData();
}

function onCreateTask(date) {
  router.push({
    name: 'task-create',
    query: {
      due_date: format(date, 'yyyy-MM-dd')
    }
  });
}

function onViewTask(event) {
  if (event.original && event.original.id) {
    router.push(`/tasks/${event.original.id}`);
  }
}
</script> 
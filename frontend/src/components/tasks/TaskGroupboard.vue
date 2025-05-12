<template>
  <div class="overflow-x-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="status in statusColumns" :key="status.value" class="bg-white rounded-lg shadow border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-700 flex items-center">
            <span class="w-3 h-3 rounded-full mr-2" :class="getStatusColorClass(status.value)"></span>
            {{ status.label }}
            <span class="ml-2 text-sm text-gray-500">({{ getTasksByStatus(status.value).length }})</span>
          </h3>
          <button 
            @click="$emit('create-task', { status: status.value })"
            class="p-1 text-gray-500 hover:text-indigo-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="p-4 min-h-[400px] max-h-[75vh] overflow-y-auto">
          <div v-if="getTasksByStatus(status.value).length === 0" class="text-center text-gray-500 my-10">
            Aucune tâche
          </div>
          
          <draggable 
            :list="getTasksByStatus(status.value)" 
            group="tasks"
            item-key="id"
            class="space-y-3"
            ghost-class="opacity-50 border border-dashed border-gray-400 bg-gray-50"
            @change="handleDragChange($event, status.value)"
          >
            <template #item="{ element }">
              <div 
                class="bg-white rounded-md p-3 border border-gray-200 shadow-sm hover:shadow transition-shadow cursor-pointer"
                :class="{'border-l-4': element.priority, 'border-red-500': element.priority === 'high', 'border-yellow-500': element.priority === 'medium', 'border-blue-500': element.priority === 'low'}"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-800 text-sm line-clamp-2">{{ element.title }}</h4>
                  <button
                    @click.stop="$emit('edit-task', element)"
                    class="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                
                <p v-if="element.description" class="text-gray-600 text-xs mb-2 line-clamp-2">
                  {{ truncateText(element.description, 100) }}
                </p>
                
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <div v-if="element.due_date" class="flex items-center" :class="getDueDateClass(element)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(element.due_date) }}
                  </div>
                  
                  <div v-if="element.priority" class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getPriorityBadgeClass(element.priority)">
                    {{ getPriorityLabel(element.priority) }}
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          
          <div 
            class="mt-4 border border-dashed border-gray-300 rounded-md p-3 text-center text-gray-500"
            @dragover.prevent
            @drop="onDrop($event, status.value)"
          >
            Déposez une tâche ici
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import draggable from 'vuedraggable';
import logger from '@/utils/logger';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  statuses: {
    type: Array,
    default: () => [
      { value: 'to_do', label: 'À faire' },
      { value: 'in_progress', label: 'En cours' },
      { value: 'done', label: 'Terminé' }
    ]
  }
});

const emit = defineEmits(['edit-task', 'create-task', 'status-changed']);

// Colonnes de statut pour le tableau
const statusColumns = computed(() => {
  return props.statuses;
});

// Obtenir les tâches filtrées par statut
function getTasksByStatus(status) {
  return props.tasks.filter(task => task.status === status);
}

// Gérer le glisser-déposer des tâches
function handleDragChange(event, newStatus) {
  if (event.added) {
    const taskId = event.added.element.id;
    logger.debug('TaskGroupboard', `Tâche #${taskId} déplacée vers ${newStatus}`);
    emit('status-changed', { taskId, newStatus });
  }
}

// Gérer le drop direct sur la zone
function onDrop(event, newStatus) {
  const taskId = event.dataTransfer.getData('taskId');
  if (!taskId) return;
  
  logger.debug('TaskGroupboard', `Tâche #${taskId} déposée dans ${newStatus}`);
  emit('status-changed', { taskId, newStatus });
}

// Obtenir la classe de couleur pour un statut
function getStatusColorClass(status) {
  switch(status) {
    case 'to_do':
      return 'bg-yellow-400';
    case 'in_progress':
      return 'bg-blue-400';
    case 'done':
      return 'bg-green-400';
    default:
      return 'bg-gray-400';
  }
}

// Formatage de la date
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return 'Date invalide';
    
    // Format: JJ/MM/YYYY
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch (error) {
    logger.error('TaskGroupboard', 'Erreur de formatage de date', { dateString, error });
    return 'Date invalide';
  }
}

// Classes conditionnelles pour la date d'échéance
function getDueDateClass(task) {
  if (!task.due_date) return '';
  
  const dueDate = new Date(task.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (dueDate < today) {
    return 'text-red-600';
  } else if (dueDate < tomorrow) {
    return 'text-yellow-600';
  }
  return '';
}

// Label pour les priorités
function getPriorityLabel(priority) {
  switch(priority) {
    case 'high':
      return 'Haute';
    case 'medium':
      return 'Moyenne';
    case 'low':
      return 'Basse';
    default:
      return priority;
  }
}

// Classes pour les badges de priorité
function getPriorityBadgeClass(priority) {
  switch(priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Tronquer le texte pour éviter les descriptions trop longues
function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
</script>

<style scoped>
.board-container {
  overflow-x: auto;
}

.task-column {
  min-height: 400px;
  max-height: 75vh;
  overflow-y: auto;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  background-color: white;
  border-radius: 4px;
  border-left: 4px solid #dee2e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.border-danger {
  border-left-color: #dc3545;
}

.border-warning {
  border-left-color: #ffc107;
}

.border-info {
  border-left-color: #0dcaf0;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-title {
  margin: 0;
  font-weight: 600;
}

.task-edit-btn {
  padding: 0;
  margin: -3px -3px 0 0;
}

.task-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.task-due-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.ghost-card {
  opacity: 0.5;
  background: #f8f9fa;
  border: 1px dashed #6c757d;
}

.badge {
  font-size: 0.7rem;
  font-weight: normal;
}
</style> 
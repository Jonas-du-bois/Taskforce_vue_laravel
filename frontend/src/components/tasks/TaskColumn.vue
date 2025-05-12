<template>
  <div class="bg-gray-200 rounded-lg p-4 shadow" :class="{'w-full': fullWidth}">
    <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center justify-between">
      <span>{{ title }}</span>
      <span class="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ tasks.length }}</span>
    </h3>
    
    <draggable 
      :list="tasks" 
      group="tasks" 
      @end="handleDragEnd" 
      item-key="id"
      class="space-y-4 min-h-[100px]" 
      :data-status="status"
    >
      <template #item="{ element }">
        <TaskCard 
          :task="element" 
          @edit="editTask" 
          @delete="deleteTask"
        />
      </template>
    </draggable>
    
    <div class="mt-4 flex justify-center">
      <button 
        @click="$emit('add-task', status)" 
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="-ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Ajouter
      </button>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';

defineEmits(['task-moved', 'add-task', 'edit-task', 'delete-task']);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
});

const handleDragEnd = (event) => {
  if (event.newIndex !== undefined && event.oldIndex !== undefined) {
    const task = props.tasks[event.newIndex];
    const newStatus = event.to.dataset.status;
    const oldStatus = event.from.dataset.status;
    
    if (newStatus !== oldStatus) {
      // Émettre un événement uniquement si le statut a changé
      const taskWithNewStatus = {
        ...task,
        status: newStatus
      };
      
      console.log(`Tâche déplacée de ${oldStatus} vers ${newStatus}:`, taskWithNewStatus);
      
      // Informer le parent du changement
      $emit('task-moved', {
        task: taskWithNewStatus, 
        oldStatus, 
        newStatus
      });
    }
  }
};

const editTask = (task) => {
  $emit('edit-task', task);
};

const deleteTask = (task) => {
  $emit('delete-task', task);
};
</script> 
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Modales existantes -->
    <TaskModal
      v-if="showEditModal"
      :task="currentTask"
      @close="showEditModal = false"
      @updated="onTaskUpdated"
    />
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :taskId="currentTaskId"
      @confirm="onDeleteConfirm"
      @close="showDeleteModal = false"
    />

    <!-- Contenu principal -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LeftColumn
        :tasks="tasks"
        @task-created="onTaskCreated"
        @task-deleted="openDeleteModal"
        @error="onError"
      />
      <RightColumn
        :tasks="tasks"
        @edit-task="openEditModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LeftColumn from '@/components/home/layout/LeftColumn.vue'
import RightColumn from '@/components/home/layout/RightColumn.vue'
import TaskModal from '@/components/home/modals/TaskModal.vue'
import DeleteConfirmModal from '@/components/home/modals/DeleteConfirmModal.vue'
import TaskService from '@/services/task.service'

// état local
const tasks = ref([])
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentTask = ref(null)
const currentTaskId = ref(null)

// récupère les tâches
async function fetchTasks() {
  try {
    tasks.value = await TaskService.fetchTasks()
  } catch (err) {
    console.error('Erreur fetchTasks:', err)
  }
}

// handlers événements
function onTaskCreated(newTask) {
  // Ajoute la tâche fraîchement créée en tête
  tasks.value.unshift(newTask)
}

function onTaskUpdated(updatedTask) {
  const i = tasks.value.findIndex(t => t.id === updatedTask.id)
  if (i >= 0) tasks.value[i] = updatedTask
}

function onTaskDeleted(deletedId) {
  tasks.value = tasks.value.filter(t => t.id !== deletedId)
}

function onError(err) {
  // Affiche ton toast ou logger
  console.error('Erreur dans un sous-composant:', err)
}

// ouverture des modales
function openEditModal(task) {
  currentTask.value = { ...task }
  showEditModal.value = true
}

function openDeleteModal(taskId) {
  currentTaskId.value = taskId
  showDeleteModal.value = true
}

// confirm suppression
async function onDeleteConfirm() {
  try {
    await TaskService.deleteTask(currentTaskId.value)
    onTaskDeleted(currentTaskId.value)
  } catch (err) {
    onError(err)
  } finally {
    showDeleteModal.value = false
  }
}

// fetch initial
onMounted(fetchTasks)
</script>

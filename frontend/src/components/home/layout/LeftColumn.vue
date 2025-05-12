<template>
  <div class="space-y-6">
    <!-- Ajout rapide : on capte l’événement, puis on le réémet -->
    <QuickAddTask
      @task-created="handleTaskCreated"
      @error="handleError"
    />

    <!-- Aperçu des tâches : on passe la liste et on capte la suppression -->
    <TasksOverview
      :tasks="tasks"
      @delete="handleTaskDeleted"
    />
  </div>
</template>

<script>
import QuickAddTask from '@/components/tasks/QuickAddTask.vue'
import TasksOverview from '@/components/tasks/TasksOverview.vue'

export default {
  name: 'LeftColumn',
  components: { QuickAddTask, TasksOverview },
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleTaskCreated(task) {
      // Émet au parent MainContent pour ajouter la tâche à la liste
      this.$emit('task-created', task)
    },
    handleTaskDeleted(id) {
      // Émet au parent MainContent pour supprimer la tâche de la liste
      this.$emit('task-deleted', id)
    },
    handleError(error) {
      // Émet l’erreur pour affichage d’un toast ou log
      this.$emit('error', error)
    }
  }
}
</script>

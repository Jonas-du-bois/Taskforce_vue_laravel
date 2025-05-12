<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <!-- En-tête -->
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-800">Ajout rapide</h2>
    </div>

    <!-- Corps -->
    <div class="p-6">
      <form @submit.prevent="createQuickTask" class="space-y-4">
        <!-- Titre -->
        <div>
          <label for="quick_title" class="block text-sm font-medium text-gray-700">
            Titre de la tâche
          </label>
          <input
            id="quick_title"
            type="text"
            v-model="quickTask.title"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <!-- Priorité & Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Priorité -->
          <div>
            <label for="quick_priority" class="block text-sm font-medium text-gray-700">
              Priorité
            </label>
            <select
              id="quick_priority"
              v-model="quickTask.priority"
              class="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm
                     focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </div>

          <!-- Date d’échéance -->
          <div>
            <label for="quick_due_date" class="block text-sm font-medium text-gray-700">
              Date d’échéance
            </label>
            <input
              id="quick_due_date"
              type="date"
              v-model="quickTask.due_date"
              class="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm
                     focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Bouton -->
        <button
          type="submit"
          :disabled="addingTask"
          class="inline-flex w-full justify-center rounded-md border border-transparent
                 px-4 py-2 text-sm font-medium text-white shadow-sm
                 bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span v-if="addingTask">Ajout en cours…</span>
          <span v-else>Ajouter la tâche</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import TaskService from '@/services/task.service'

export default {
  name: 'QuickAddTask',
  emits: ['task-created', 'error'],
  data() {
    return {
      addingTask: false,
      quickTask: {
        title: '',
        priority: 'moyenne',
        due_date: null,
      },
    }
  },
  methods: {
    async createQuickTask() {
      if (!this.quickTask.title.trim()) return

      this.addingTask = true
      try {
        // Appel à ton service centralisé
        const nouvelleTache = await TaskService.createTask(this.quickTask)
        this.$emit('task-created', nouvelleTache)
        // Réinitialisation
        this.quickTask = { title: '', priority: 'moyenne', due_date: null }
      } catch (err) {
        this.$emit('error', err)
      } finally {
        this.addingTask = false
      }
    },
  },
}
</script>

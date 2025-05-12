<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <!-- En-tête -->
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-800">Vos tâches</h2>
    </div>

    <!-- Corps -->
    <div class="p-6">
      <!-- Aucune tâche -->
      <div v-if="tasks.length === 0" class="text-center text-gray-500">
        Aucune tâche pour l’instant
      </div>

      <!-- Liste des tâches -->
      <ul v-else class="space-y-4">
        <li
          v-for="t in tasks"
          :key="t.id"
          class="flex justify-between items-center p-4 bg-gray-50 rounded-md"
        >
          <div>
            <p class="font-medium text-gray-800">{{ t.title }}</p>
            <p class="text-sm text-gray-500">
              Priorité : {{ t.priority }} • Échéance :
              {{ t.due_date ? new Date(t.due_date).toLocaleDateString() : '—' }}
            </p>
          </div>
          <button
            @click="$emit('delete', t.id)"
            class="text-red-500 hover:text-red-700 focus:outline-none"
          >
            🗑️
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TasksOverview',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  emits: ['delete']
}
</script>

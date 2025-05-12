<template>
    <section class="progress-stats">
      <h2>Progression</h2>
      <progress :value="completed" :max="total"></progress>
      <p>{{ completed }} / {{ total }} tâches terminées</p>
    </section>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'ProgressStats',
    computed: {
      ...mapGetters('tasks', ['completedCount', 'totalCount']),
      completed() {
        return this.completedCount
      },
      total() {
        return this.totalCount
      }
    }
  }
  </script>
  
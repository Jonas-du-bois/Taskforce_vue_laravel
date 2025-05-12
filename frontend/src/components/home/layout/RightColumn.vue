<template>
    <div class="right-column">
      <ProgressStats />
      <Reminders />
    </div>
  </template>
  
  <script>
  import ProgressStats from '@/components/ui/ProgressStats.vue'
  import Reminders from '@/components/ui/Reminders.vue'
  
  export default {
    name: 'RightColumn',
    components: { ProgressStats, Reminders }
  }
  </script>
  
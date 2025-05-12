<template>
    <div class="logged-in">
      <WelcomeBanner />
      <MainContent
        @open-task-modal="$emit('open-task-modal')"
        @open-delete-modal="$emit('open-delete-modal')"
      />
    </div>
  </template>
  
  <script>
  import WelcomeBanner from '@/components/ui/WelcomeBanner.vue'
  import MainContent from '@/components/layout/MainContent.vue'
  
  export default {
    name: 'LoggedInView',
    components: { WelcomeBanner, MainContent }
  }
  </script>
  
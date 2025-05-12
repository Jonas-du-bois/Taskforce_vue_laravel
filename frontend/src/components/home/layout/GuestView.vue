<template>
    <div class="guest">
      <FeaturesList />
      <CallToAction />
    </div>
  </template>
  
  <script>
  import FeaturesList from '@/components/ui/FeaturesList.vue'
  import CallToAction from '@/components/ui/CallToAction.vue'
  
  export default {
    name: 'GuestView',
    components: { FeaturesList, CallToAction }
  }
  </script>
  
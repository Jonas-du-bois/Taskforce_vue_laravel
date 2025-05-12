<template>
    <ul class="features-list">
      <li v-for="(feat, i) in features" :key="i">
        ✔️ {{ feat }}
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    name: 'FeaturesList',
    data() {
      return {
        features: [
          'Ajouter et organiser des tâches',
          'Suivre votre progression',
          'Planifier des rappels',
          'Accès multi-appareil'
        ]
      }
    }
  }
  </script>
  
<template>
    <section class="welcome-banner">
      <h1>Bonjour, {{ userName }} ! 🎉</h1>
      <p>Prêt·e à conquérir votre liste de tâches du jour ?</p>
    </section>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'WelcomeBanner',
    computed: {
      ...mapGetters(['userName'])
    }
  }
  </script>
  
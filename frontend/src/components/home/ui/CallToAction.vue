<template>
    <div class="cta">
      <p>Rejoignez-nous et boostez votre productivité !</p>
      <button @click="redirectTo('register')">Créer un compte</button>
      <button @click="redirectTo('login')">Se connecter</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CallToAction',
    methods: {
      redirectTo(route) {
        this.$router.push({ name: route })
      }
    }
  }
  </script>
  
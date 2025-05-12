<template>
    <div class="modal">
      <p>Confirmez-vous la suppression de cette tâche ?</p>
      <button @click="confirm">Oui</button>
      <button @click="$emit('close')">Non</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeleteConfirmModal',
    methods: {
      confirm() {
        // émettre un événement global ou appeler une action Vuex
        this.$emit('close')
      }
    }
  }
  </script>
  
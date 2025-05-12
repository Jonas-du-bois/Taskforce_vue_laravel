<template>
    <section class="reminders">
      <h2>Rappels à venir</h2>
      <ul>
        <li v-for="r in reminders" :key="r.id">
          ⏰ {{ r.time }} — {{ r.title }}
        </li>
      </ul>
    </section>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'Reminders',
    computed: {
      ...mapState({ reminders: state => state.tasks.reminders })
    }
  }
  </script>
  
<template>
    <li class="task-item">
      <span>{{ task.title }}</span>
      <button @click="$emit('delete', task.id)">🗑️</button>
    </li>
  </template>
  
  <script>
  export default {
    name: 'TaskItem',
    props: {
      task: { type: Object, required: true }
    }
  }
  </script>
  
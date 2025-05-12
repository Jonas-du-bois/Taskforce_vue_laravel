<template>
  <div class="bg-white p-4 rounded-lg shadow animate-pulse">
    <div class="flex justify-between items-start mb-2">
      <!-- Titre factice -->
      <div class="h-5 bg-gray-200 rounded w-3/4"></div>
      <!-- Badge priorité factice -->
      <div class="h-5 bg-gray-200 rounded" :class="randomWidth(['w-1/2', 'w-2/3', 'w-3/4'])"></div>
    </div>
    <!-- Description factice -->
    <div class="space-y-2 mt-3">
      <div class="h-3 bg-gray-200 rounded w-full"></div>
      <div class="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
    <!-- Date factice -->
    <div class="flex items-center mt-4">
      <div class="h-4 w-4 bg-gray-200 rounded mr-2"></div>
      <div class="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
</template>

<script setup>
const randomWidth = (widths) => {
  return widths[Math.floor(Math.random() * widths.length)];
};
</script>
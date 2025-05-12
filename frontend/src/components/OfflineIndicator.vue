<template>
  <div v-if="!isOnline" class="offline-indicator fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
    Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.
  </div>
</template>

<script>
export default {
  name: 'OfflineIndicator',
  data() {
    return {
      isOnline: true
    }
  },
  mounted() {
    // Vérifier l'état initial de la connexion
    this.isOnline = navigator.onLine;
    
    // Ajouter des écouteurs d'événements pour détecter les changements de l'état de connexion
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  beforeUnmount() {
    // Supprimer les écouteurs d'événements lors de la destruction du composant
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },
  methods: {
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
    }
  }
}
</script>

<style scoped>
.offline-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style> 
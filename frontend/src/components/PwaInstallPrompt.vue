<template>
  <div v-if="showInstallPrompt" class="pwa-prompt fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex justify-between items-center shadow-lg">
    <div>
      <h3 class="font-bold">Installer Taskforce</h3>
      <p>Installez l'application pour une meilleure expérience</p>
    </div>
    <div class="flex space-x-2">
      <button @click="closePrompt" class="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded">
        Plus tard
      </button>
      <button @click="installPwa" class="px-3 py-1 bg-white text-indigo-600 hover:bg-gray-100 rounded">
        Installer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PwaInstallPrompt',
  data() {
    return {
      deferredPrompt: null,
      showInstallPrompt: false,
      debug: true,
      debugInfo: 'En attente'
    }
  },
  mounted() {
    console.log('PwaInstallPrompt monté, en attente d\'événements...');
    
    // Vérifier si la PWA est déjà installée
    this.checkIfInstalled();
    
    // Écouter l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Événement beforeinstallprompt capturé !');
      // Empêcher Chrome de montrer automatiquement l'invite d'installation
      e.preventDefault();
      // Stocker l'événement pour pouvoir le déclencher plus tard
      this.deferredPrompt = e;
      // Mettre à jour l'UI pour montrer le bouton d'installation
      this.showInstallPrompt = true;
      this.debugInfo = 'Prêt à installer';
    });

    // Détecter quand l'app a été installée
    window.addEventListener('appinstalled', () => {
      console.log('PWA a été installée avec succès');
      // Masquer l'invite d'installation
      this.showInstallPrompt = false;
      this.deferredPrompt = null;
      this.debugInfo = 'Application installée';
      
      // Enregistrer que l'application a été installée
      localStorage.setItem('pwaInstalled', 'true');
    });
  },
  methods: {
    forceShowPrompt() {
      console.log('Affichage forcé du bandeau d\'installation');
      this.showInstallPrompt = true;
    },
    checkInstallability() {
      // Vérifier si le navigateur prend en charge l'API BeforeInstallPromptEvent
      const supportsInstallPrompt = 'BeforeInstallPromptEvent' in window;
      console.log('Le navigateur prend en charge BeforeInstallPromptEvent:', supportsInstallPrompt);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log('Service workers enregistrés:', registrations.length);
          this.debugInfo = `Service workers: ${registrations.length}, Prompt: ${this.deferredPrompt ? 'Disponible' : 'Non disponible'}`;
        });
      }
      
      // Forcer une tentative d'affichage de l'invite
      if (this.deferredPrompt) {
        console.log('Tentative de forcer l\'invite d\'installation...');
        this.installPwa();
      } else {
        console.log('Aucun événement prompt n\'est disponible - vérifiez que la PWA respecte les critères d\'installation');
        this.debugInfo = 'Aucun prompt disponible';
      }
    },
    async installPwa() {
      if (!this.deferredPrompt) {
        console.log('L\'installation n\'est pas disponible - prompt non capturé');
        return;
      }
      
      console.log('Tentative d\'affichage du prompt d\'installation...');
      // Montrer l'invite d'installation
      this.deferredPrompt.prompt();
      
      // Attendre que l'utilisateur réponde à l'invite
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`Choix d'installation: ${outcome}`);
      
      // On n'a plus besoin de l'événement prompt
      this.deferredPrompt = null;
      this.showInstallPrompt = false;
    },
    closePrompt() {
      this.showInstallPrompt = false;
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    },
    checkIfInstalled() {
      // Vérifier si l'application est en mode standalone (déjà installée)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('L\'application est déjà installée (mode standalone)');
        this.debugInfo = 'Déjà installée';
        return true;
      }
      
      // Sur iOS Safari, vérifier si l'app est sur l'écran d'accueil
      if (navigator.standalone === true) {
        console.log('L\'application est installée sur iOS');
        this.debugInfo = 'Installée sur iOS';
        return true;
      }
      
      // Vérifier dans localStorage
      if (localStorage.getItem('pwaInstalled') === 'true') {
        console.log('L\'application a déjà été installée (selon localStorage)');
        this.debugInfo = 'Installée (localStorage)';
        return true;
      }
      
      console.log('L\'application n\'est pas encore installée');
      return false;
    }
  }
}
</script>

<style scoped>
.pwa-prompt {
  z-index: 9999;
}
</style> 
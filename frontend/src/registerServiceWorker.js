// Ce fichier est pour l'enregistrement manuel du service worker
// Le plugin Vite PWA gère automatiquement l'enregistrement en production

export default function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Utiliser toujours sw.js (le fichier statique que nous avons créé)
        const swPath = '/sw.js';
        
        console.log(`Tentative d'enregistrement du Service Worker depuis: ${swPath}`);
        
        const registration = await navigator.serviceWorker.register(swPath, {
          scope: '/'
        });
        
        console.log('Service Worker enregistré avec succès:', registration.scope);
        
        // Vérifier les mises à jour périodiquement
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60); // Vérifier les mises à jour toutes les heures
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      }
    });
  } else {
    console.warn('Les Service Workers ne sont pas supportés par ce navigateur.');
  }
} 
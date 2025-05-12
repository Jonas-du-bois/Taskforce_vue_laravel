import axios from 'axios';
import { useAuthStore } from '../stores/auth';

// Configuration de l'intercepteur Axios pour la gestion des tokens
const setupInterceptors = () => {
  // Intercepteur pour les requêtes
  axios.interceptors.request.use(
    (config) => {
      // Récupération du token depuis le localStorage à chaque requête
      const token = localStorage.getItem('token');
      
      // Si un token existe, l'ajouter aux en-têtes
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur pour les réponses (gestion des erreurs d'authentification)
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Si l'erreur est 401 (non autorisé) et que ce n'est pas déjà une tentative de rafraîchissement
      if (error.response && (error.response.status === 401 || error.response.status === 419) && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Essayons de récupérer l'instance du store d'authentification
        // Note: cette approche peut nécessiter des ajustements selon votre configuration Pinia
        const authStore = useAuthStore();
        
        try {
          // Vérifier si l'utilisateur est connecté
          if (authStore.isAuthenticated) {
            // Tenter de rafraîchir le token (si vous avez cette fonctionnalité)
            // await authStore.refreshToken();
            
            // Si le rafraîchissement a réussi, réessayer la requête originale
            // token = localStorage.getItem('token');
            // originalRequest.headers['Authorization'] = `Bearer ${token}`;
            // return axios(originalRequest);
            
            // Si pas de rafraîchissement disponible, déconnecter l'utilisateur
            await authStore.logout();
            console.log('Session expirée. Déconnexion...');
            
            // Rediriger vers la page de connexion
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token:', refreshError);
          
          // En cas d'échec, déconnecter l'utilisateur
          await authStore.logout();
          
          // Rediriger vers la page de connexion
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors; 
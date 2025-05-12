import { useAuthStore } from '../stores/auth';
import router from '../router';
import notificationService from '../services/notification.service';

/**
 * Utilitaire pour tester les routes protégées
 * Cette fonction peut être utilisée pour vérifier si les redirections fonctionnent correctement
 * en fonction de l'état d'authentification
 * 
 * @param {string} routeName - Nom de la route à tester
 * @param {Object} params - Paramètres de la route (optionnel)
 * @returns {boolean} - True si l'accès est autorisé
 */
export const testProtectedRoute = async (routeName, params = {}) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  
  try {
    // Essayer de naviguer vers la route
    await router.push({ name: routeName, params });
    
    // Vérifier si on a été redirigé vers login (si non authentifié)
    const isLoginRoute = router.currentRoute.value.name === 'login';
    
    // Si on est sur la page de login alors qu'on ne devrait pas l'être
    if (isAuthenticated && isLoginRoute) {
      console.error(`Erreur: Redirection inattendue vers login alors que l'utilisateur est authentifié`);
      notificationService.error('Erreur de navigation: redirection incorrecte');
      return false;
    }
    
    // Si on n'est pas sur la page de login alors qu'on devrait l'être
    if (!isAuthenticated && !isLoginRoute && requiresAuth(routeName)) {
      console.error(`Erreur: Pas de redirection vers login alors que l'utilisateur n'est pas authentifié`);
      notificationService.error('Erreur de navigation: protection de route non fonctionnelle');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la navigation vers ${routeName}:`, error);
    notificationService.error(`Erreur de navigation: ${error.message}`);
    return false;
  }
};

/**
 * Détermine si une route nécessite l'authentification
 * @param {string} routeName - Nom de la route
 * @returns {boolean} - True si la route nécessite l'authentification
 */
export const requiresAuth = (routeName) => {
  const route = router.options.routes.find(r => r.name === routeName);
  return route && route.meta && route.meta.requiresAuth === true;
};

/**
 * Test complet de l'authentification
 * Cette fonction vérifie que les flux d'authentification fonctionnent correctement
 */
export const testAuthentication = async () => {
  const authStore = useAuthStore();
  
  try {
    // 1. Vérifier l'état initial
    console.log('État initial d\'authentification:', authStore.isAuthenticated);
    
    // 2. Tester une route protégée
    const testRoute = 'tasks';
    const result = await testProtectedRoute(testRoute);
    console.log(`Test de route protégée (${testRoute}):`, result ? 'Succès' : 'Échec');
    
    // 3. Vérifier le token dans localStorage
    const token = localStorage.getItem('token');
    console.log('Token présent dans localStorage:', !!token);
    
    return {
      isAuthenticated: authStore.isAuthenticated,
      hasToken: !!token,
      routeTestPassed: result
    };
  } catch (error) {
    console.error('Erreur lors du test d\'authentification:', error);
    return {
      isAuthenticated: false,
      hasToken: false,
      routeTestPassed: false,
      error: error.message
    };
  }
}; 
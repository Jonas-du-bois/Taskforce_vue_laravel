import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

/**
 * Composable pour gérer l'authentification dans les composants
 * 
 * @param {Object} options - Options de configuration
 * @param {boolean} options.requireAuth - Si true, redirige vers login si non authentifié
 * @param {boolean} options.redirectAuthenticated - Si true, redirige les utilisateurs authentifiés vers une autre page
 * @param {string} options.redirectTo - Page de redirection après authentification
 * 
 * @returns {Object} - Propriétés et méthodes liées à l'authentification
 */
export function useAuth(options = {}) {
  const {
    requireAuth = false,
    redirectAuthenticated = false,
    redirectTo = '/tasks'
  } = options;
  
  const router = useRouter();
  const authStore = useAuthStore();
  const authChecked = ref(false);
  
  // Getters réactifs
  const isLoading = computed(() => authStore.loading);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user.value);
  const isAdmin = computed(() => authStore.isAdmin);
  const authError = computed(() => authStore.error);
  
  /**
   * Fonction de login
   * @param {Object} credentials - Identifiants
   * @returns {Promise<boolean>} - Résultat du login
   */
  const login = async (credentials) => {
    try {
      const success = await authStore.login(credentials);
      
      if (success && redirectTo) {
        router.push(redirectTo);
      }
      
      return success;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Fonction d'inscription
   * @param {Object} userData - Données utilisateur
   * @returns {Promise<boolean>} - Résultat de l'inscription
   */
  const register = async (userData) => {
    try {
      const success = await authStore.register(userData);
      
      if (success && redirectTo) {
        router.push(redirectTo);
      }
      
      return success;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Fonction de déconnexion
   */
  const logout = async () => {
    await authStore.logout();
    router.push('/login');
  };

  // À l'initialisation du composant
  onMounted(async () => {
    // Vérifier l'authentification
    if (!authChecked.value) {
      await authStore.checkAuth();
      authChecked.value = true;
      
      // Rediriger si nécessaire selon les options
      if (requireAuth && !isAuthenticated.value) {
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      } else if (redirectAuthenticated && isAuthenticated.value) {
        router.push(redirectTo);
      }
    }
  });

  return {
    // État
    isLoading,
    isAuthenticated,
    user,
    isAdmin,
    authError,
    
    // Actions
    login,
    logout,
    register
  };
} 
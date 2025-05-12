import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import logger from '@/utils/logger'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userData = computed(() => user.value)
  const tokenValue = computed(() => token.value)
  
  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      logger.auth('AuthStore', 'Tentative de connexion', { login: credentials.login })
      
      // Utiliser le service d'authentification
      const result = await authService.login(credentials)
      
      // Mettre à jour le state
      token.value = result.token
      user.value = result.user
      
      logger.auth('AuthStore', 'Connexion réussie', { userId: user.value.id })
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la connexion'
      error.value = message
      logger.error('AuthStore', 'Échec de connexion', { 
        erreur: message, 
        status: err.response?.status || 'N/A' 
      })
      return false
    } finally {
      loading.value = false
    }
  }
  
  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      logger.auth('AuthStore', 'Tentative d\'inscription', { email: userData.email })
      
      // Utiliser le service d'authentification
      const result = await authService.register(userData)
      
      // Mettre à jour le state
      token.value = result.token
      user.value = result.user
      
      logger.auth('AuthStore', 'Inscription réussie', { userId: user.value.id })
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription'
      error.value = message
      logger.error('AuthStore', 'Échec d\'inscription', { 
        erreur: message, 
        status: err.response?.status || 'N/A' 
      })
      return false
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      if (token.value) {
        logger.auth('AuthStore', 'Déconnexion')
        
        // Utiliser le service d'authentification
        await authService.logout()
      }
    } catch (err) {
      logger.warn('AuthStore', 'Erreur lors de la déconnexion', err)
    } finally {
      // Nettoyage côté client
      clearAuthData()
      router.push('/login')
    }
  }
  
  const fetchUserData = async () => {
    if (!token.value) return null
    
    try {
      loading.value = true
      logger.auth('AuthStore', 'Récupération des données utilisateur')
      
      // Utiliser le service d'authentification
      const userData = await authService.fetchUserData()
      user.value = userData
      
      logger.auth('AuthStore', 'Données utilisateur récupérées', { userId: user.value.id })
      return user.value
    } catch (err) {
      logger.error('AuthStore', 'Échec récupération utilisateur', err)
      
      // Si erreur 401, le token n'est plus valide
      if (err.response?.status === 401) {
        clearAuthData()
      }
      return null
    } finally {
      loading.value = false
    }
  }
  
  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      // Utiliser le service d'authentification
      const isValid = await authService.checkAuth()
      
      if (isValid && !user.value) {
        // Si le token est valide mais qu'on n'a pas les données utilisateur, les récupérer
        await fetchUserData()
      }
      
      return isValid
    } catch (err) {
      clearAuthData()
      return false
    }
  }
  
  const refreshToken = async () => {
    try {
      // Utiliser le service d'authentification
      const success = await authService.refreshToken()
      
      if (success) {
        // Mettre à jour le token dans le store
        token.value = localStorage.getItem('token')
        
        // Mettre à jour les données utilisateur
        await fetchUserData()
        return true
      }
      
      return false
    } catch (err) {
      logger.error('AuthStore', 'Échec du rafraîchissement du token', err)
      clearAuthData()
      return false
    }
  }
  
  // Fonction utilitaire pour nettoyer les données d'authentification
  const clearAuthData = () => {
    user.value = null
    token.value = null
    authService.clearAuthData()
    logger.auth('AuthStore', 'Données d\'authentification effacées')
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userData,
    tokenValue,
    
    // Actions
    login,
    register,
    logout,
    fetchUserData,
    checkAuth,
    clearAuthData,
    refreshToken
  }
}) 
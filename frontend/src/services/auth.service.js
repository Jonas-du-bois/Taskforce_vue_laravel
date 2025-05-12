import apiService from './api.service';
import logger from '../utils/logger';

/**
 * Service d'authentification 
 * Gère les appels API liés à l'authentification et la gestion des tokens
 */
class AuthService {
  /**
   * Connecte un utilisateur et gère le stockage du token
   * @param {Object} credentials - Identifiants de connexion (email/login et mot de passe)
   * @returns {Promise<Object>} - Données utilisateur
   */
  async login(credentials) {
    try {
      logger.auth('AuthService', 'Tentative de connexion', { login: credentials.login || credentials.email });
      
      const response = await apiService.post('/login', credentials);
      const { user, token } = response.data;
      
      // Stockage du token et configuration du service API
      localStorage.setItem('token', token);
      apiService.setAuthToken(token);
      
      logger.auth('AuthService', 'Authentification réussie', user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données d'inscription
   * @returns {Promise<Object>} - Données utilisateur et token
   */
  async register(userData) {
    try {
      logger.auth('AuthService', 'Tentative d\'inscription', { email: userData.email });
      
      const response = await apiService.post('/register', userData);
      const { user, token } = response.data;
      
      // Stockage du token et configuration du service API
      localStorage.setItem('token', token);
      apiService.setAuthToken(token);
      
      logger.auth('AuthService', 'Inscription et authentification réussies', user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Déconnecte l'utilisateur
   */
  async logout() {
    try {
      logger.auth('AuthService', 'Tentative de déconnexion');
      await apiService.post('/v1/auth/logout');
      
      // Nettoyer le stockage local
      this.clearAuthData();
      logger.auth('AuthService', 'Déconnexion réussie');
    } catch (error) {
      logger.error('AuthService', 'Erreur lors de la déconnexion', error);
      // Nettoyer quand même en cas d'erreur
      this.clearAuthData();
      throw error;
    }
  }
  
  /**
   * Récupère les données de l'utilisateur connecté
   * @returns {Promise<Object>} - Données utilisateur
   */
  async fetchUserData() {
    try {
      const response = await apiService.get('/v1/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Vérifie si le token stocké est toujours valide
   * @returns {Promise<boolean>} - True si l'utilisateur est authentifié
   */
  async checkAuth() {
    try {
      // Vérifie si un token existe
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      // Met à jour le token dans le service API
      apiService.setAuthToken(token);
      
      // Utiliser la route correcte pour vérifier l'authentification
      await apiService.get('/v1/auth/check');
      return true;
    } catch (error) {
      // Token invalide ou expiré
      this.clearAuthData();
      return false;
    }
  }
  
  /**
   * Rafraîchit le token d'authentification
   * @returns {Promise<boolean>} - True si le token a été rafraîchi avec succès
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }
      
      const response = await apiService.post('/v1/auth/refresh', { 
        refresh_token: refreshToken 
      });
      
      const { token, refresh_token } = response.data;
      
      localStorage.setItem('token', token);
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }
      
      apiService.setAuthToken(token);
      logger.auth('AuthService', 'Token rafraîchi avec succès');
      
      return true;
    } catch (error) {
      logger.error('AuthService', 'Échec du rafraîchissement du token', error);
      this.clearAuthData();
      return false;
    }
  }
  
  /**
   * Nettoie les données d'authentification (déconnexion locale)
   */
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    apiService.setAuthToken(null);
  }
}

export default new AuthService(); 
import apiService from './api.service';
import logger from '../utils/logger';

/**
 * Service dédié à la gestion du profil utilisateur
 * Gère les appels API liés aux données de profil, mot de passe et token
 */
class ProfileService {
  /**
   * Met à jour les informations du profil utilisateur
   * @param {Object} profileData - Données du profil (nom, email, classe)
   * @returns {Promise<Object>} - Données utilisateur mises à jour
   */
  async updateProfile(profileData) {
    try {
      logger.info('ProfileService', 'Mise à jour du profil', { email: profileData.email });
      const response = await apiService.put('/v1/profile', profileData);
      return response.data;
    } catch (error) {
      logger.error('ProfileService', 'Erreur lors de la mise à jour du profil', error);
      throw error;
    }
  }
  
  /**
   * Met à jour le mot de passe de l'utilisateur
   * @param {Object} passwordData - Données de mot de passe (current_password, password, password_confirmation)
   * @returns {Promise<Object>} - Message de confirmation
   */
  async updatePassword(passwordData) {
    try {
      logger.info('ProfileService', 'Mise à jour du mot de passe');
      const response = await apiService.put('/v1/user/password', passwordData);
      return response.data;
    } catch (error) {
      logger.error('ProfileService', 'Erreur lors de la mise à jour du mot de passe', error);
      throw error;
    }
  }
  
  /**
   * Régénère le token API de l'utilisateur
   * @returns {Promise<Object>} - Données utilisateur avec nouveau token
   */
  async regenerateToken() {
    try {
      logger.info('ProfileService', 'Génération d\'un nouveau token API');
      const response = await apiService.post('/v1/user/token');
      return response.data;
    } catch (error) {
      logger.error('ProfileService', 'Erreur lors de la génération du token', error);
      throw error;
    }
  }
}

export default new ProfileService();

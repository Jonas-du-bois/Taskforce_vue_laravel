import { useNotificationStore } from '../stores/notification';

/**
 * Service de notification pour l'affichage de messages utilisateur
 */
class NotificationService {
  /**
   * Ajoute une notification avec un type et un message
   * @param {Object} options Options de notification
   * @param {string} options.message Message à afficher
   * @param {string} options.type Type de notification (success, info, warning, error)
   * @param {number} options.timeout Durée d'affichage en millisecondes (0 pour persistant)
   * @returns {string} ID de la notification
   */
  add({ message, type = 'info', timeout = 5000 }) {
    const store = useNotificationStore();
    return store.addNotification({
      type,
      message,
      timeout
    });
  }

  /**
   * Affiche une notification de succès
   * @param {string} message Message à afficher
   * @param {number} timeout Durée d'affichage en millisecondes (0 pour persistant)
   * @returns {string} ID de la notification
   */
  success(message, timeout = 5000) {
    return this.add({ message, type: 'success', timeout });
  }

  /**
   * Affiche une notification d'information
   * @param {string} message Message à afficher
   * @param {number} timeout Durée d'affichage en millisecondes (0 pour persistant)
   * @returns {string} ID de la notification
   */
  info(message, timeout = 5000) {
    return this.add({ message, type: 'info', timeout });
  }

  /**
   * Affiche une notification d'avertissement
   * @param {string} message Message à afficher
   * @param {number} timeout Durée d'affichage en millisecondes (0 pour persistant)
   * @returns {string} ID de la notification
   */
  warning(message, timeout = 7000) {
    return this.add({ message, type: 'warning', timeout });
  }

  /**
   * Affiche une notification d'erreur
   * @param {string} message Message à afficher
   * @param {number} timeout Durée d'affichage en millisecondes (0 pour persistant)
   * @returns {string} ID de la notification
   */
  error(message, timeout = 10000) {
    return this.add({ message, type: 'error', timeout });
  }

  /**
   * Supprime une notification spécifique
   * @param {string} id Identifiant de la notification
   */
  remove(id) {
    const store = useNotificationStore();
    store.removeNotification(id);
  }

  /**
   * Supprime toutes les notifications
   */
  clearAll() {
    const store = useNotificationStore();
    store.clearNotifications();
  }
}

export default new NotificationService(); 
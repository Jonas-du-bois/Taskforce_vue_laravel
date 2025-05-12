import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),
  
  getters: {
    getNotifications: (state) => state.notifications
  },
  
  actions: {
    /**
     * Ajoute une nouvelle notification
     * @param {Object} notification Objet notification
     * @param {string} notification.type Type de notification (success, info, warning, error)
     * @param {string} notification.message Message à afficher
     * @param {number} notification.timeout Délai avant disparition automatique (0 pour persistant)
     * @returns {string} ID de la notification créée
     */
    addNotification({ type = 'info', message, timeout = 5000 }) {
      const id = uuidv4();
      const notification = {
        id,
        type,
        message,
        timestamp: new Date()
      };
      
      this.notifications.push(notification);
      
      // Auto-suppression après le délai
      if (timeout > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, timeout);
      }
      
      return id;
    },
    
    /**
     * Supprime une notification par son ID
     * @param {string} id ID de la notification à supprimer
     */
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },
    
    /**
     * Supprime toutes les notifications
     */
    clearNotifications() {
      this.notifications = [];
    }
  }
}); 
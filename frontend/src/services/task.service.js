import ApiService from './api.service';
import logger from '../utils/logger';
import { ref, computed, onMounted, nextTick } from 'vue';

/**
 * Service de gestion des tâches
 * Centralise les appels API liés aux tâches et gère la mise en cache
 */
class TaskService {
  constructor() {
    // Cache local pour éviter des appels API inutiles
    this.taskCache = {
      tasks: null,
      lastFetched: null,
      filters: null
    };
    // Durée de validité du cache en millisecondes (5 minutes)
    this.cacheDuration = 5 * 60 * 1000;
  }

  /**
   * Méthodes utilitaires privées
   */
  _normalizeTaskData(taskData) {
    const normalizedData = { ...taskData };
    if (normalizedData.estimated_minutes !== undefined) {
      normalizedData.estimated_minutes = parseInt(normalizedData.estimated_minutes) || 0;
    }
    return normalizedData;
  }

  _updateCache(task, action = 'update') {
    if (!this.taskCache.tasks) return;

    switch (action) {
      case 'add':
        this.taskCache.tasks.push(task);
        break;
      case 'update':
        const index = this.taskCache.tasks.findIndex(t => t.id == task.id);
        if (index >= 0) {
          this.taskCache.tasks[index] = task;
        }
        break;
      case 'delete':
        this.taskCache.tasks = this.taskCache.tasks.filter(t => t.id != task.id);
        break;
    }
  }

  _logAndThrowError(operation, details, error) {
    logger.error('TaskService', `Erreur lors de ${operation}`, {
      ...details,
      message: error.message,
      status: error.response?.status,
      validation: error.response?.data?.errors
    });
    throw error;
  }

  /**
   * Vérifie si le cache est valide pour les filtres donnés
   * @param {Object} filters - Filtres actuels
   * @returns {boolean} - True si le cache est valide
   */
  isCacheValid(filters = {}) {
    if (!this.taskCache.tasks || !this.taskCache.lastFetched) return false;
    
    // Vérifier si les filtres ont changé
    if (JSON.stringify(this.taskCache.filters) !== JSON.stringify(filters)) return false;
    
    // Vérifier si le cache a expiré
    const now = new Date().getTime();
    return (now - this.taskCache.lastFetched) < this.cacheDuration;
  }

  /**
   * Récupère toutes les tâches avec filtres optionnels
   * @param {Object} filters - Filtres pour les tâches (status, search, etc.)
   * @param {boolean} forceRefresh - Force le rafraîchissement du cache
   * @returns {Promise<Array>} - Liste des tâches
   */
  async fetchTasks(filters = {}, forceRefresh = false) {
    if (!forceRefresh && this.isCacheValid(filters)) {
      logger.task('TaskService', 'Utilisation du cache pour les tâches', {
        count: this.taskCache.tasks.length,
        fromCache: true
      });
      return this.taskCache.tasks;
    }

    logger.task('TaskService', 'Récupération des tâches depuis l\'API', filters);
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key === 'sortBy' ? 'sort_by' : key, value);
      });
      
      const response = await ApiService.get('/v1/tasks', { params });
      
      this.taskCache = {
        tasks: response.data,
        lastFetched: new Date().getTime(),
        filters: { ...filters }
      };
      
      logger.task('TaskService', 'Tâches récupérées avec succès', { 
        count: response.data.length,
        fromCache: false
      });
      
      return response.data;
    } catch (error) {
      this._logAndThrowError('de la récupération des tâches', { filters }, error);
    }
  }

  /**
   * Récupère une tâche par son ID
   * @param {number|string} id - ID de la tâche
   * @returns {Promise<Object>} - Données de la tâche
   */
  async getTaskById(id) {
    if (this.taskCache.tasks) {
      const cachedTask = this.taskCache.tasks.find(task => task.id == id);
      if (cachedTask) {
        logger.task('TaskService', 'Tâche récupérée depuis le cache', { id, fromCache: true });
        return cachedTask;
      }
    }
    
    try {
      const response = await ApiService.get(`/v1/tasks/${id}`);
      this._updateCache(response.data);
      return response.data;
    } catch (error) {
      this._logAndThrowError('de la récupération de la tâche', { id }, error);
    }
  }

  /**
   * Crée une nouvelle tâche
   * @param {Object} taskData - Données de la tâche
   * @returns {Promise<Object>} - La tâche créée
   */
  async createTask(taskData) {
    try {
      const normalizedData = this._normalizeTaskData(taskData);
      const response = await ApiService.post('/v1/tasks', normalizedData);
      this.clearCache(); // Invalider le cache pour la création
      
      logger.task('TaskService', 'Tâche créée avec succès', { 
        id: response.data.id,
        title: response.data.title 
      });
      
      return response.data;
    } catch (error) {
      this._logAndThrowError('de la création de la tâche', { title: taskData.title }, error);
    }
  }

  /**
   * Met à jour une tâche existante
   * @param {Object} taskData - Données de la tâche avec ID
   * @returns {Promise<Object>} - La tâche mise à jour
   */
  async updateTask(taskData) {
    if (!taskData.id) {
      throw new Error('ID de tâche requis pour la mise à jour');
    }

    try {
      const normalizedData = this._normalizeTaskData(taskData);
      const response = await ApiService.put(`/v1/tasks/${taskData.id}`, normalizedData);
      this._updateCache(response.data);
      
      logger.task('TaskService', 'Tâche mise à jour avec succès', { 
        id: taskData.id,
        title: response.data.title 
      });
      
      return response.data;
    } catch (error) {
      this._logAndThrowError('de la mise à jour de la tâche', { id: taskData.id }, error);
    }
  }

  /**
   * Met à jour uniquement le statut d'une tâche
   * @param {number|string} id - ID de la tâche
   * @param {string} status - Nouveau statut
   * @returns {Promise<Object>} - La tâche mise à jour
   */
  async updateTaskStatus(id, status) {
    try {
      const response = await ApiService.patch(`/v1/tasks/${id}/status`, { status });
      this._updateCache({ ...response.data, status });
      
      logger.task('TaskService', 'Statut de tâche mis à jour avec succès', { id, status });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        try {
          logger.task('TaskService', 'Tentative alternative avec PUT', { id });
          const task = await this.getTaskById(id);
          task.status = status;
          return await this.updateTask(task);
        } catch (fallbackError) {
          this._logAndThrowError('de la mise à jour alternative du statut', { id }, fallbackError);
        }
      }
      this._logAndThrowError('de la mise à jour du statut', { id, status }, error);
    }
  }

  /**
   * Supprime une tâche
   * @param {number|string} id - ID de la tâche à supprimer
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    try {
      await ApiService.delete(`/v1/tasks/${id}`);
      this._updateCache({ id }, 'delete');
      logger.task('TaskService', 'Tâche supprimée avec succès', { id });
    } catch (error) {
      this._logAndThrowError('de la suppression de la tâche', { id }, error);
    }
  }

  /**
   * Invalidate le cache
   */
  clearCache() {
    this.taskCache = {
      tasks: null,
      lastFetched: null,
      filters: null
    };
    logger.debug('TaskService', 'Cache vidé');
  }
}

export default new TaskService();
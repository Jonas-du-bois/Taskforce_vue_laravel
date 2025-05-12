import { defineStore } from 'pinia'
import TaskService from '@/services/task.service'
import logger from '@/utils/logger'
import { useNotificationStore } from './notification'

/**
 * Store central pour la gestion des tâches
 * Utilise le TaskService pour les opérations d'API et gère l'état local
 */
export const useTaskStore = defineStore('task', {
  state: () => ({
    // Liste des tâches chargées
    tasks: [],
    // Indique si une opération est en cours
    loading: false,
    // Erreur actuelle
    error: null,
    // Filtres actifs
    activeFilters: {
      status: '',
      priority: '',
      search: '',
      sortBy: 'due_date',
      sortOrder: 'asc'
    }
  }),
  
  getters: {
    /**
     * Récupère toutes les tâches
     * @returns {Array} - Toutes les tâches
     */
    getAllTasks: (state) => state.tasks,
    
    /**
     * Récupère une tâche par son ID
     * @param {number|string} id - ID de la tâche
     * @returns {function} - Fonction qui renvoie la tâche correspondante
     */
    getTaskById: (state) => (id) => state.tasks.find(task => task.id == id),
    
    /**
     * Récupère les tâches par statut
     * @param {string} status - Statut des tâches à récupérer
     * @returns {function} - Fonction qui renvoie les tâches filtrées par statut
     */
    getTasksByStatus: (state) => (status) => state.tasks.filter(task => task.status === status),
    
    /**
     * Tâches en attente (à faire)
     */
    getPendingTasks: (state) => state.tasks.filter(task => task.status === 'à faire'),
    
    /**
     * Tâches en cours
     */
    getInProgressTasks: (state) => state.tasks.filter(task => task.status === 'en cours'),
    
    /**
     * Tâches terminées
     */
    getCompletedTasks: (state) => state.tasks.filter(task => task.status === 'terminée'),
    
    /**
     * Indique si les tâches sont en cours de chargement
     */
    isLoading: (state) => state.loading,
    
    /**
     * Nombre total de tâches
     */
    taskCount: (state) => state.tasks.length,
    
    /**
     * Nombre de tâches par statut
     */
    taskCountByStatus: (state) => {
      return state.tasks.reduce((acc, task) => {
        const status = task.status || 'à faire';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
    }
  },
  
  actions: {
    /**
     * Définit les filtres actifs et recharge les tâches
     * @param {Object} filters - Nouveaux filtres à appliquer
     */
    async setFilters(filters) {
      this.activeFilters = { ...this.activeFilters, ...filters };
      return this.fetchTasks(this.activeFilters);
    },
    
    /**
     * Récupère les tâches depuis l'API selon les filtres
     * @param {Object} filters - Filtres à appliquer (écrase les filtres actifs si fournis)
     * @param {boolean} forceRefresh - Force le rafraîchissement des données
     */
    async fetchTasks(filters = null, forceRefresh = false) {
      this.loading = true;
      this.error = null;
      
      try {
        // Utiliser les filtres fournis ou les filtres actifs
        const filtersToUse = filters || this.activeFilters;
        if (filters) {
          this.activeFilters = { ...this.activeFilters, ...filters };
        }
        
        logger.task('TaskStore', 'Chargement des tâches', filtersToUse);
        const tasks = await TaskService.fetchTasks(filtersToUse, forceRefresh);
        
        this.tasks = tasks;
        logger.task('TaskStore', 'Tâches chargées', { count: tasks.length });
        return tasks;
      } catch (error) {
        logger.error('TaskStore', 'Erreur de chargement des tâches', error);
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des tâches';
        
        // Si erreur d'authentification, propager l'erreur pour que l'application puisse rediriger vers la connexion
        if (error.response?.status === 401) {
          throw new Error('Authentification requise');
        }
        
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Recharge les tâches en forçant le rafraîchissement
     */
    async refreshTasks() {
      return this.fetchTasks(null, true);
    },
    
    /**
     * Crée une nouvelle tâche
     * @param {Object} taskData - Données de la tâche à créer
     */
    async createTask(taskData) {
      this.loading = true;
      this.error = null;
      
      try {
        logger.task('TaskStore', 'Création d\'une tâche', { title: taskData.title });
        const newTask = await TaskService.createTask(taskData);
        
        // Ajouter la tâche au début de la liste
        this.tasks.unshift(newTask);
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'success',
          message: 'Tâche créée avec succès'
        });
        
        logger.task('TaskStore', 'Tâche créée', { id: newTask.id, title: newTask.title });
        return newTask;
      } catch (error) {
        logger.error('TaskStore', 'Erreur de création de tâche', error);
        this.error = error.response?.data?.message || 'Erreur lors de la création de la tâche';
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'error',
          message: 'Erreur lors de la création de la tâche'
        });
        
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Met à jour une tâche existante
     * @param {Object} taskData - Données de la tâche avec ID
     */
    async updateTask(taskData) {
      if (!taskData.id) {
        const error = new Error('ID de tâche requis pour la mise à jour');
        logger.error('TaskStore', 'Erreur de mise à jour', error);
        throw error;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        logger.task('TaskStore', 'Mise à jour d\'une tâche', { 
          id: taskData.id, 
          title: taskData.title 
        });
        
        const updatedTask = await TaskService.updateTask(taskData);
        
        // Mise à jour optimiste dans le state
        const index = this.tasks.findIndex(task => task.id == taskData.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'success',
          message: 'Tâche mise à jour avec succès'
        });
        
        logger.task('TaskStore', 'Tâche mise à jour', { id: updatedTask.id });
        return updatedTask;
      } catch (error) {
        logger.error('TaskStore', 'Erreur de mise à jour de tâche', {
          id: taskData.id,
          error: error.message
        });
        
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour de la tâche';
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'error',
          message: 'Erreur lors de la mise à jour de la tâche'
        });
        
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Supprime une tâche
     * @param {number|string} id - ID de la tâche à supprimer
     */
    async deleteTask(id) {
      this.loading = true;
      this.error = null;
      
      try {
        logger.task('TaskStore', 'Suppression d\'une tâche', { id });
        await TaskService.deleteTask(id);
        
        // Mise à jour optimiste du state
        this.tasks = this.tasks.filter(task => task.id != id);
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'success',
          message: 'Tâche supprimée avec succès'
        });
        
        logger.task('TaskStore', 'Tâche supprimée', { id });
        return true;
      } catch (error) {
        logger.error('TaskStore', 'Erreur de suppression de tâche', {
          id,
          error: error.message
        });
        
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de la tâche';
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'error',
          message: 'Erreur lors de la suppression de la tâche'
        });
        
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Change le statut d'une tâche
     * @param {number|string} id - ID de la tâche
     * @param {string} status - Nouveau statut
     */
    async changeTaskStatus(id, status) {
      this.loading = true;
      this.error = null;
      
      try {
        logger.task('TaskStore', 'Changement de statut d\'une tâche', { id, status });
        
        // Mémoriser l'ancien état
        const taskIndex = this.tasks.findIndex(task => task.id == id);
        const oldTask = taskIndex !== -1 ? { ...this.tasks[taskIndex] } : null;
        
        // Mise à jour optimiste du state
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], status };
        }
        
        // Appel API
        await TaskService.updateTaskStatus(id, status);
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'success',
          message: `Tâche marquée comme "${status}"`
        });
        
        logger.task('TaskStore', 'Statut de tâche mis à jour', { id, status });
        return taskIndex !== -1 ? this.tasks[taskIndex] : null;
      } catch (error) {
        logger.error('TaskStore', 'Erreur de changement de statut', {
          id,
          status,
          error: error.message
        });
        
        // Restaurer l'ancien état en cas d'erreur
        if (oldTask) {
          const taskIndex = this.tasks.findIndex(task => task.id == id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = oldTask;
          }
        }
        
        this.error = error.response?.data?.message || 'Erreur lors du changement de statut';
        
        // Notifier l'utilisateur
        const notificationStore = useNotificationStore();
        notificationStore.addNotification({
          type: 'error',
          message: 'Erreur lors du changement de statut de la tâche'
        });
        
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Nettoie complètement le store et le cache
     */
    clearTaskStore() {
      this.tasks = [];
      this.loading = false;
      this.error = null;
      this.activeFilters = {
        status: '',
        priority: '',
        search: '',
        sortBy: 'due_date',
        sortOrder: 'asc'
      };
      
      // Vider également le cache du service
      TaskService.clearCache();
      logger.debug('TaskStore', 'Store et cache vidés');
    }
  }
});
import axios from 'axios';
import apiService from './api.service';
import logger from '../utils/logger';
import exampleData from '../agendaExample.json';
import { parseISO, isWithinInterval, format, isAfter, isBefore } from 'date-fns';
import notificationService from './notification.service';
import taskService from './task.service';
import { fr } from 'date-fns/locale';

/**
 * Service pour gérer les fonctionnalités liées à l'agenda et aux horaires
 */
class AgendaService {
  constructor() {
    this.useLocalData = false; // Utiliser l'API externe par défaut
    this.apiUrl = '/v1/schedules'; 
    this.localData = exampleData;
    this.includeTasks = true; // Inclure les tâches dans l'agenda par défaut
    logger.info('AgendaService', 'Service agenda initialisé' + (this.useLocalData ? ' (mode local)' : ' (mode API externe)'));
  }

  /**
   * Récupère les informations du profil utilisateur, y compris sa classe
   * @returns {Promise<Object>} Données de l'utilisateur
   */
  async getUserProfile() {
    try {
      logger.info('AgendaService', 'Récupération des données du profil utilisateur');
      const response = await apiService.get('/v1/profile');
      
      if (response.data && response.data.class) {
        logger.info('AgendaService', `Classe de l'utilisateur: ${response.data.class}`);
      } else {
        logger.warn('AgendaService', 'Aucune classe définie dans le profil utilisateur');
      }
      
      return response.data;
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors de la récupération du profil utilisateur', error);
      return null;
    }
  }

  /**
   * Récupère tous les emplois du temps entre deux dates
   * @param {string} startDate - Date de début (YYYY-MM-DD)
   * @param {string} endDate - Date de fin (YYYY-MM-DD)
   * @returns {Promise<Array>} Liste des événements
   */
  async getAllSchedules(startDate, endDate) {
    try {
      let events = [];
      
      if (this.useLocalData) {
        logger.info('AgendaService', `Récupération des événements locaux entre ${startDate} et ${endDate}`);
        events = this._filterLocalEventsByDateRange(startDate, endDate);
      } else {
        logger.info('AgendaService', `Requête API externe pour tous les événements`);
        // Récupérer tous les événements depuis l'API externe
        const response = await apiService.get(this.apiUrl);
        const allEvents = response.data;
        logger.debug('AgendaService', `${allEvents.length} événements récupérés depuis l'API externe`);
        
        // Filtrer les événements par date
        events = this.filterEventsByDateRange(allEvents, startDate, endDate);
        logger.info('AgendaService', `${events.length} événements filtrés pour la période ${startDate} - ${endDate}`);
      }
      
      // Ajouter les tâches si nécessaire
      if (this.includeTasks) {
        const tasksAsEvents = await this._getTasksAsEvents(startDate, endDate);
        events = [...events, ...tasksAsEvents];
        logger.debug('AgendaService', `${tasksAsEvents.length} tâches ajoutées à l'agenda`);
      }
      
      // Trier les événements par date de début
      events.sort((a, b) => {
        const dateA = new Date(a.start);
        const dateB = new Date(b.start);
        return dateA - dateB;
      });
      
      return events;
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors de la récupération des événements', error);
      
      // Fallback sur les données locales en cas d'erreur API
      logger.warn('AgendaService', 'Fallback sur les données locales');
      let localEvents = this._filterLocalEventsByDateRange(startDate, endDate);
      
      // Ajouter les tâches au fallback si nécessaire
      if (this.includeTasks) {
        try {
          const tasksAsEvents = await this._getTasksAsEvents(startDate, endDate);
          localEvents = [...localEvents, ...tasksAsEvents];
        } catch (taskError) {
          logger.error('AgendaService', 'Erreur lors de la récupération des tâches pour l\'agenda', taskError);
        }
      }
      
      // Trier les événements
      localEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
      
      return localEvents;
    }
  }

  /**
   * Récupère la liste des classes disponibles
   * @returns {Promise<Array>} Liste des classes
   */
  async getAvailableClasses() {
    try {
      if (this.useLocalData) {
        logger.info('AgendaService', 'Récupération des classes à partir des données locales');
        const classes = [...new Set(this.localData.map(event => event.class))];
        return classes;
      } else {
        logger.info('AgendaService', 'Requête API externe pour les classes disponibles');
        const response = await apiService.get(this.apiUrl);
        const allEvents = response.data;
        
        // Extraire la liste unique des classes
        const classes = [...new Set(allEvents.map(event => event.class))];
        logger.info('AgendaService', `${classes.length} classes uniques récupérées`);
        
        return classes;
      }
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors de la récupération des classes', error);
      
      // Fallback sur les données locales en cas d'erreur API
      logger.warn('AgendaService', 'Fallback sur les données locales pour les classes');
      const classes = [...new Set(this.localData.map(event => event.class))];
      return classes;
    }
  }

  /**
   * Récupère les détails d'un événement par son ID
   * @param {string|number} eventId - ID de l'événement
   * @returns {Promise<Object>} Détails de l'événement
   */
  async getEventById(eventId) {
    try {
      // Vérifier d'abord si c'est une tâche (les IDs de tâches commencent généralement par 'task-')
      if (typeof eventId === 'string' && eventId.startsWith('task-')) {
        const taskId = eventId.replace('task-', '');
        return await this._getTaskAsEvent(taskId);
      }
      
      if (this.useLocalData) {
        logger.info('AgendaService', `Récupération de l'événement local #${eventId}`);
        const event = this.localData.find(e => e.id === eventId);
        
        if (!event) {
          throw new Error(`Événement #${eventId} non trouvé`);
        }
        
        return event;
      } else {
        logger.info('AgendaService', `Requête API externe pour l'événement #${eventId}`);
        const response = await apiService.get(this.apiUrl);
        const allEvents = response.data;
        
        // Convertir eventId en nombre si c'est une chaîne
        const numericEventId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
        
        // Rechercher l'événement par ID
        const event = allEvents.find(e => e.id === numericEventId);
        
        if (!event) {
          throw new Error(`Événement #${eventId} non trouvé dans les données de l'API`);
        }
        
        return event;
      }
    } catch (error) {
      logger.error('AgendaService', `Erreur lors de la récupération de l'événement #${eventId}`, error);
      throw error;
    }
  }
  
  /**
   * Formate un événement pour l'affichage
   * @param {Object} event - Événement à formater
   * @returns {Object} Événement formaté
   */
  formatEvent(event) {
    if (!event) return null;
    
    try {
      const start = new Date(event.start);
      const end = new Date(event.end);
      
      return {
        ...event,
        formattedStart: format(start, 'HH:mm'),
        formattedEnd: format(end, 'HH:mm'),
        formattedDate: format(start, 'EEEE d MMMM yyyy', { locale: fr }),
        duration: Math.round((end - start) / (1000 * 60)) // Durée en minutes
      };
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors du formatage de l\'événement', error);
      return event;
    }
  }

  /**
   * Récupère l'emploi du temps d'une classe spécifique pour une période donnée
   * @param {string} className - Nom de la classe
   * @param {string} startDate - Date de début au format YYYY-MM-DD
   * @param {string} endDate - Date de fin au format YYYY-MM-DD
   * @returns {Promise<Array>} - Liste des événements de la classe
   */
  async getScheduleForClass(className, startDate, endDate) {
    try {
      logger.info('AgendaService', `Récupération de l'emploi du temps pour la classe ${className} du ${startDate} au ${endDate}`);
      
      let filteredEvents = [];
      
      if (this.useLocalData) {
        // Filtrer les données locales par classe et plage de dates
        filteredEvents = this.filterEventsByDateRange(exampleData, startDate, endDate)
          .filter(event => event.class === className);
        
        logger.debug('AgendaService', `${filteredEvents.length} événements trouvés pour la classe ${className}`);
      } else {
        // Récupérer tous les événements depuis l'API externe
        const response = await apiService.get(this.apiUrl);
        const allEvents = response.data;
        
        // Filtrer par classe et plage de dates
        filteredEvents = this.filterEventsByDateRange(allEvents, startDate, endDate)
          .filter(event => event.class === className);
        
        logger.debug('AgendaService', `${filteredEvents.length} événements trouvés pour la classe ${className}`);
      }
      
      // Ajouter les tâches si nécessaire
      if (this.includeTasks && className === 'MyTasks') {
        const tasksAsEvents = await this._getTasksAsEvents(startDate, endDate);
        filteredEvents = [...filteredEvents, ...tasksAsEvents];
        logger.debug('AgendaService', `${tasksAsEvents.length} tâches ajoutées à l'agenda de classe ${className}`);
      }
      
      // Trier les événements par date de début
      filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
      
      return filteredEvents;
    } catch (error) {
      logger.error('AgendaService', `Erreur lors de la récupération de l'emploi du temps pour la classe ${className}`, error);
      
      // Fallback sur les données locales en cas d'erreur
      logger.warn('AgendaService', 'Fallback sur les données locales pour la classe');
      let localEvents = this.filterEventsByDateRange(exampleData, startDate, endDate)
        .filter(event => event.class === className);
      
      // Ajouter les tâches au fallback si nécessaire
      if (this.includeTasks && className === 'MyTasks') {
        try {
          const tasksAsEvents = await this._getTasksAsEvents(startDate, endDate);
          localEvents = [...localEvents, ...tasksAsEvents];
        } catch (taskError) {
          logger.error('AgendaService', 'Erreur lors de la récupération des tâches pour l\'agenda', taskError);
        }
      }
      
      // Trier les événements
      localEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
      
      return localEvents;
    }
  }

  /**
   * Filtre les événements par plage de dates
   * @param {Array} events - Liste des événements à filtrer
   * @param {string} startDate - Date de début au format YYYY-MM-DD
   * @param {string} endDate - Date de fin au format YYYY-MM-DD
   * @returns {Array} - Événements filtrés
   * @private
   */
  filterEventsByDateRange(events, startDate, endDate) {
    try {
      // Convertir les dates de début et de fin en objets Date
      const start = parseISO(`${startDate}T00:00:00`);
      const end = parseISO(`${endDate}T23:59:59`);
      
      return events.filter(event => {
        const eventStart = parseISO(event.start);
        return isWithinInterval(eventStart, { start, end });
      });
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors du filtrage des événements par date', error);
      return [];
    }
  }

  /**
   * Récupère les horaires depuis l'API ou utilise les données d'exemple
   * @param {boolean} useLocalData - Indique si on doit utiliser les données locales
   * @returns {Promise<Object>} - Données d'horaires organisées par classe
   */
  async fetchSchedules(useLocalData = null) {
    try {
      // Utiliser la valeur passée en paramètre ou la valeur par défaut du service
      const useLocal = useLocalData !== null ? useLocalData : this.useLocalData;
      
      // Si on utilise les données locales, on retourne directement le fichier d'exemple
      if (useLocal) {
        logger.debug('AgendaService', 'Utilisation des données locales pour les horaires');
        return this.organizeByClass(exampleData);
      }
      
      // Sinon, on fait une requête à l'API externe
      logger.api('AgendaService', 'Récupération des horaires depuis l\'API externe');
      const response = await apiService.get(this.apiUrl);
      
      if (response.status === 200) {
        logger.info('AgendaService', 'Horaires récupérés avec succès depuis l\'API externe');
        const data = response.data;
        logger.debug('AgendaService', `${data.length} événements récupérés`);
        
        // Trier les événements par date de début
        data.sort((a, b) => new Date(a.start) - new Date(b.start));
        
        return this.organizeByClass(data);
      } else {
        throw new Error(`Échec de la récupération des horaires: ${response.status}`);
      }
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors de la récupération des horaires', error);
      
      // En cas d'erreur, on utilise les données locales comme fallback
      logger.warn('AgendaService', 'Utilisation des données locales comme solution de secours');
      notificationService.warning('Impossible de récupérer les données depuis le serveur, utilisation des données locales');
      
      // Trier les événements locaux
      const sortedExampleData = [...exampleData].sort((a, b) => 
        new Date(a.start) - new Date(b.start)
      );
      
      return this.organizeByClass(sortedExampleData);
    }
  }

  /**
   * Organise les données d'agenda par classe
   * @param {Array} data - Données brutes d'agenda
   * @returns {Object} - Données organisées par classe
   */
  organizeByClass(data) {
    if (!Array.isArray(data)) {
      logger.error('AgendaService', 'Les données d\'agenda ne sont pas un tableau');
      return {};
    }
    
    const schedulesByClass = {};
    
    // Ajouter une classe spéciale pour les tâches
    if (this.includeTasks) {
      schedulesByClass['MyTasks'] = [];
    }
    
    data.forEach(item => {
      if (!item.class) {
        logger.warn('AgendaService', 'Élément sans classe détecté', item);
        return;
      }
      
      if (!schedulesByClass[item.class]) {
        schedulesByClass[item.class] = [];
      }
      
      schedulesByClass[item.class].push(item);
    });
    
    // Trier les événements dans chaque classe
    Object.keys(schedulesByClass).forEach(className => {
      schedulesByClass[className].sort((a, b) => 
        new Date(a.start) - new Date(b.start)
      );
    });
    
    logger.debug('AgendaService', `Données organisées pour ${Object.keys(schedulesByClass).length} classes`);
    return schedulesByClass;
  }

  /**
   * Convertit les données de cours en événements pour FullCalendar
   * @param {Array} courses - Liste des cours
   * @returns {Array} - Liste des événements formatés pour FullCalendar
   */
  convertCoursesToEvents(courses) {
    if (!Array.isArray(courses)) {
      logger.error('AgendaService', 'Les données de cours ne sont pas un tableau');
      return [];
    }
    
    // Génère une couleur unique basée sur le nom du cours
    const getColorFromCourseName = (name) => {
      const colors = [
        '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', // Flat colors
        '#9b59b6', '#1abc9c', '#d35400', '#c0392b', // More flat colors
        '#8e44ad', '#16a085', '#27ae60', '#2980b9'  // Even more colors
      ];
      
      // Générer un index basé sur le nom du cours
      const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + acc;
      }, 0);
      
      return colors[hash % colors.length];
    };
    
    return courses.map((course, index) => {
      // Vérifier la présence des données requises
      if (!course.label || !course.start || !course.end) {
        logger.warn('AgendaService', 'Cours avec données incomplètes détecté', course);
        return null;
      }
      
      const color = getColorFromCourseName(course.label);
      
      return {
        id: course.id || `event-${index}`,
        title: course.label,
        start: course.start,
        end: course.end,
        color: color,
        extendedProps: {
          location: course.room || 'Non spécifié',
          classGroup: course.class || 'Non spécifié',
          original: course
        }
      };
    }).filter(event => event !== null); // Filtrer les événements invalides
  }

  /**
   * Génère une couleur cohérente pour un type d'événement
   * @param {string} eventLabel Libellé de l'événement
   * @returns {string} Code couleur au format hex
   */
  getEventColor(eventLabel) {
    if (!eventLabel) return '#cccccc';
    
    // Utiliser une simple fonction de hachage pour générer une couleur cohérente
    // basée sur le nom de l'événement
    let hash = 0;
    for (let i = 0; i < eventLabel.length; i++) {
      hash = eventLabel.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertir en couleur HSL pour avoir des couleurs plus distinctes
    // avec saturation et luminosité fixées
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 50%)`;
  }
  
  /**
   * Récupère les détails d'un événement spécifique
   * @param {string} eventId ID de l'événement
   * @returns {Promise<Object|null>} Détails de l'événement ou null si non trouvé
   */
  async getEventDetails(eventId) {
    try {
      if (!eventId) {
        logger.warn('AgendaService', 'Tentative de récupération d\'un événement sans ID');
        return null;
      }
      
      // Vérifier si c'est une tâche
      if (typeof eventId === 'string' && eventId.startsWith('task-')) {
        const taskId = eventId.replace('task-', '');
        return await this._getTaskAsEvent(taskId);
      }
      
      // Obtenir les événements, soit via l'API externe, soit via les données locales
      const events = this.useLocalData 
        ? this.localData 
        : (await apiService.get(this.apiUrl)).data;
      
      // Convertir eventId en nombre si c'est une chaîne
      const numericEventId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
      
      // Chercher l'événement par ID
      const event = events.find(e => e.id === numericEventId);
      
      if (event) {
        logger.debug('AgendaService', `Événement ${eventId} trouvé`);
        return event;
      }
      
      logger.warn('AgendaService', `Événement ${eventId} non trouvé`);
      return null;
    } catch (error) {
      logger.error('AgendaService', `Erreur lors de la récupération de l'événement ${eventId}`, error);
      throw error;
    }
  }

  // Filtrer les événements locaux par plage de dates
  _filterLocalEventsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.localData.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= start && eventStart <= end;
    }).sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA - dateB;
    });
  }

  /**
   * Convertit les tâches en événements pour l'agenda
   * @param {string} startDate - Date de début au format YYYY-MM-DD
   * @param {string} endDate - Date de fin au format YYYY-MM-DD
   * @returns {Promise<Array>} - Liste des tâches au format événement
   * @private
   */
  async _getTasksAsEvents(startDate, endDate) {
    try {
      logger.debug('AgendaService', 'Conversion des tâches en événements d\'agenda');
      
      // Récupérer toutes les tâches
      const tasks = await taskService.fetchTasks({
        due_date_from: startDate,
        due_date_to: endDate
      });
      
      if (!Array.isArray(tasks)) {
        logger.warn('AgendaService', 'Aucune tâche récupérée ou format invalide');
        return [];
      }
      
      logger.debug('AgendaService', `${tasks.length} tâches récupérées pour conversion en événements`);
      
      // Convertir chaque tâche en format événement
      return tasks.map(task => this._convertTaskToEvent(task));
    } catch (error) {
      logger.error('AgendaService', 'Erreur lors de la récupération des tâches pour l\'agenda', error);
      return [];
    }
  }
  
  /**
   * Récupère une tâche spécifique et la convertit en événement
   * @param {string|number} taskId - ID de la tâche
   * @returns {Promise<Object|null>} - Tâche au format événement ou null
   * @private
   */
  async _getTaskAsEvent(taskId) {
    try {
      const task = await taskService.getTaskById(taskId);
      if (!task) {
        logger.warn('AgendaService', `Tâche #${taskId} non trouvée`);
        return null;
      }
      
      return this._convertTaskToEvent(task);
    } catch (error) {
      logger.error('AgendaService', `Erreur lors de la récupération de la tâche #${taskId}`, error);
      return null;
    }
  }
  
  /**
   * Convertit une tâche en format événement d'agenda
   * @param {Object} task - Tâche à convertir
   * @returns {Object} - Événement d'agenda
   * @private
   */
  _convertTaskToEvent(task) {
    // Déterminer l'heure de début et de fin
    const dueDate = task.due_date ? new Date(task.due_date) : new Date();
    // Définir l'heure de fin 1 heure après l'heure de début
    const endDate = new Date(dueDate);
    endDate.setHours(dueDate.getHours() + 1);
    
    // Déterminer la couleur en fonction du statut de la tâche
    let color;
    switch (task.status) {
      case 'terminée':
        color = '#28a745'; // vert
        break;
      case 'en cours':
        color = '#ffc107'; // jaune
        break;
      case 'à faire':
      default:
        color = '#dc3545'; // rouge
        break;
    }
    
    // Définir la priorité (1-3) et lui associer un préfixe
    let priorityPrefix = '';
    if (task.priority) {
      const priorityNum = parseInt(task.priority, 10);
      if (priorityNum === 1) priorityPrefix = '🔴 ';
      else if (priorityNum === 2) priorityPrefix = '🟠 ';
      else if (priorityNum === 3) priorityPrefix = '🟡 ';
    }
    
    return {
      id: `task-${task.id}`,
      title: priorityPrefix + (task.title || 'Tâche sans titre'),
      label: priorityPrefix + (task.title || 'Tâche sans titre'),
      start: dueDate.toISOString(),
      end: endDate.toISOString(),
      color: color,
      room: task.status,
      class: 'MyTasks',
      isTask: true,
      priority: task.priority,
      status: task.status,
      description: task.description,
      original: task
    };
  }

  // Basculer entre l'API et les données locales
  toggleDataSource(useLocal) {
    this.useLocalData = useLocal;
    logger.info('AgendaService', `Mode de données défini sur ${useLocal ? 'local' : 'API externe'}`);
  }
  
  // Activer/désactiver l'inclusion des tâches dans l'agenda
  toggleTasksInAgenda(includeTasks) {
    this.includeTasks = includeTasks;
    logger.info('AgendaService', `Inclusion des tâches dans l'agenda ${includeTasks ? 'activée' : 'désactivée'}`);
  }
}

export default new AgendaService(); 
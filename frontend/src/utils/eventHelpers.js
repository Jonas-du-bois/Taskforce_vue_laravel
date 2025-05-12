/**
 * Utilitaires pour la gestion des événements et des tâches
 */

/**
 * Convertit une tâche en format d'événement pour l'affichage dans le calendrier
 * @param {Object} task - La tâche à convertir
 * @returns {Object|null} L'événement correspondant ou null si pas de date d'échéance
 */
export const convertTaskToEvent = (task) => {
  if (!task.due_date) return null;
  
  const dueDate = new Date(task.due_date);
  // Créer une date de fin (1 heure après la date d'échéance)
  const endDate = new Date(dueDate);
  endDate.setHours(dueDate.getHours() + 1);
  
  return {
    id: `task-${task.id}`,
    title: task.title,
    label: task.title,
    description: task.description,
    start: dueDate.toISOString(),
    end: endDate.toISOString(),
    status: task.status || 'à faire',
    priority: task.priority,
    isTask: true,
    original: task
  };
};

/**
 * Obtient la couleur correspondant au statut d'une tâche
 * @param {string} status - Le statut de la tâche
 * @returns {string} Le nom de la couleur à utiliser
 */
export const getTaskStatusColor = (status) => {
  if (!status) return 'gray';
  
  switch (status.toLowerCase()) {
    case 'terminée':
    case 'terminé':
    case 'done':
      return 'green';
    case 'en cours':
    case 'in_progress':
      return 'yellow';
    case 'à faire':
    case 'to_do':
    default:
      return 'red';
  }
};

/**
 * Génère des classes CSS pour les événements
 * @param {Object} event - L'événement
 * @returns {Object} Les classes CSS à appliquer
 */
export const getEventClasses = (event) => {
  if (event.isTask) {
    // Styles pour les tâches
    const color = getTaskStatusColor(event.status);
    return {
      [`bg-${color}-50`]: true,
      [`border-l-4 border-${color}-500`]: true
    };
  } else {
    // Générer une couleur pseudo-aléatoire basée sur le nom de la classe
    const classNameHash = event.class.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = (classNameHash % 360);
    
    return {
      [`bg-[hsl(${hue},85%,93%)]`]: true,
      [`border-l-4 border-[hsl(${hue},75%,60%)]`]: true
    };
  }
};

/**
 * Génère les classes CSS pour le badge de statut d'une tâche
 * @param {Object} event - L'événement
 * @returns {Object} Les classes CSS à appliquer
 */
export const getStatusBadgeClasses = (event) => {
  if (!event.isTask) return '';
  
  const color = getTaskStatusColor(event.status);
  return {
    [`bg-${color}-100 text-${color}-800`]: true
  };
};

/**
 * Récupère la classe CSS de couleur pour l'état d'un événement
 * @param {Object} event - L'événement
 * @returns {string} La classe CSS à appliquer
 */
export const getEventStatusColorClass = (event) => {
  if (!event.isTask) return 'bg-indigo-100';
  
  const color = getTaskStatusColor(event.status);
  return `bg-${color}-500`;
};

/**
 * Récupère la classe CSS de couleur pour le texte du statut
 * @param {Object} event - L'événement
 * @returns {string} La classe CSS à appliquer
 */
export const getTextStatusColorClass = (event) => {
  if (!event.isTask) return '';
  
  const color = getTaskStatusColor(event.status);
  return `text-${color}-600`;
};

export default {
  convertTaskToEvent,
  getTaskStatusColor,
  getEventClasses,
  getStatusBadgeClasses,
  getEventStatusColorClass,
  getTextStatusColorClass
}; 
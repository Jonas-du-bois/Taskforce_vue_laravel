/**
 * Formater la priorité pour l'affichage
 * @param {string} priority - Priorité d'une tâche ('basse', 'moyenne', 'haute')
 * @returns {string} - Priorité formatée
 */
export const formatPriority = (priority) => {
  const priorities = {
    'basse': 'Basse',
    'moyenne': 'Moyenne',
    'haute': 'Haute'
  };
  return priorities[priority] || priority;
};

/**
 * Obtenir la couleur CSS en fonction de la priorité
 * @param {string} priority - Priorité d'une tâche
 * @returns {Object} - Classes CSS pour la priorité
 */
export const getPriorityClasses = (priority) => {
  const classes = {
    'basse': 'bg-blue-100 text-blue-800',
    'moyenne': 'bg-yellow-100 text-yellow-800',
    'haute': 'bg-red-100 text-red-800'
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
};

/**
 * Formater le statut pour l'affichage
 * @param {string} status - Statut d'une tâche
 * @returns {string} - Statut formaté
 */
export const formatStatus = (status) => {
  const statuses = {
    'à faire': 'À faire',
    'en cours': 'En cours',
    'terminée': 'Terminée'
  };
  return statuses[status] || status;
};

/**
 * Obtenir la couleur CSS en fonction du statut
 * @param {string} status - Statut d'une tâche
 * @returns {Object} - Classes CSS pour le statut
 */
export const getStatusClasses = (status) => {
  const classes = {
    'à faire': 'bg-yellow-100 text-yellow-800',
    'en cours': 'bg-blue-100 text-blue-800',
    'terminée': 'bg-green-100 text-green-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Filtrer les tâches selon des critères
 * @param {Array} tasks - Liste des tâches
 * @param {Object} filters - Critères de filtrage (search, status, priority)
 * @returns {Array} - Tâches filtrées
 */
export const filterTasks = (tasks, filters = {}) => {
  return tasks.filter(task => {
    // Filtre par texte de recherche
    if (filters.search && !taskMatchesSearch(task, filters.search)) {
      return false;
    }
    
    // Filtre par statut
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    
    // Filtre par priorité
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    
    return true;
  });
};

/**
 * Détermine si une tâche correspond à une recherche textuelle
 * @param {Object} task - Tâche à vérifier
 * @param {string} searchTerm - Terme de recherche
 * @returns {boolean} - True si la tâche correspond
 */
export const taskMatchesSearch = (task, searchTerm) => {
  if (!searchTerm) return true;
  
  const search = searchTerm.toLowerCase();
  
  // Recherche dans le titre
  if (task.title && task.title.toLowerCase().includes(search)) {
    return true;
  }
  
  // Recherche dans la description
  if (task.description && task.description.toLowerCase().includes(search)) {
    return true;
  }
  
  return false;
}; 
/**
 * Formate une date pour l'affichage
 * @param {string|Date} date - La date à formater
 * @param {Object} options - Options de formatage (voir Intl.DateTimeFormat)
 * @returns {string} - Date formatée
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'Aucune date';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  
  const defaultOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return dateObj.toLocaleDateString('fr-FR', { ...defaultOptions, ...options });
};

/**
 * Calcule le nombre de jours restants avant une date
 * @param {string|Date} date - La date cible
 * @returns {number|null} - Nombre de jours ou null si date invalide
 */
export const getDaysRemaining = (date) => {
  if (!date) return null;
  
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Retourne si une date est dépassée
 * @param {string|Date} date - La date à vérifier
 * @returns {boolean} - True si la date est dépassée
 */
export const isDateOverdue = (date) => {
  if (!date) return false;
  
  const daysRemaining = getDaysRemaining(date);
  if (daysRemaining === null) return false;
  
  return daysRemaining < 0;
};

/**
 * Ajoute un nombre de jours à une date
 * @param {string|Date} date - La date de départ
 * @param {number} days - Nombre de jours à ajouter
 * @returns {Date} - Nouvelle date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Formate une date pour l'input HTML de type 'date'
 * @param {string|Date} date - La date à formater
 * @returns {string} - Date au format YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}; 
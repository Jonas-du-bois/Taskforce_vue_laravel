/**
 * Utilitaire de logging centralisé
 * Permet de gérer les logs de manière cohérente et de les désactiver en production
 */

// Détermine si le logging est activé
const isLoggingEnabled = () => {
  return import.meta.env.DEV || localStorage.getItem('enableLogging') === 'true';
};

// Niveaux de log avec leurs couleurs respectives
const LOG_LEVELS = {
  DEBUG: { name: 'DEBUG', color: 'color: #808080', enabled: true },
  INFO: { name: 'INFO', color: 'color: #0077FF', enabled: true },
  WARN: { name: 'WARN', color: 'color: #FF9900', enabled: true },
  ERROR: { name: 'ERROR', color: 'color: #FF0000', enabled: true },
  AUTH: { name: 'AUTH', color: 'color: #9900FF', enabled: true },
  API: { name: 'API', color: 'color: #00AAAA', enabled: true },
  TASK: { name: 'TASK', color: 'color: #33AA33', enabled: true },
};

/**
 * Fonction de log de base
 * @param {string} level - Niveau de log
 * @param {string} module - Module émetteur du log
 * @param {string} message - Message à logger
 * @param {any} data - Données additionnelles
 */
const log = (level, module, message, data) => {
  if (!isLoggingEnabled() || !LOG_LEVELS[level].enabled) return;

  const timestamp = new Date().toISOString().substr(11, 12);
  const prefix = `%c[${timestamp}][${level}][${module}]`;
  
  if (data !== undefined) {
    console.log(prefix, LOG_LEVELS[level].color, message, data);
  } else {
    console.log(prefix, LOG_LEVELS[level].color, message);
  }
};

// Fonctions spécifiques par niveau
const logger = {
  debug: (module, message, data) => log('DEBUG', module, message, data),
  info: (module, message, data) => log('INFO', module, message, data),
  warn: (module, message, data) => log('WARN', module, message, data),
  error: (module, message, data) => log('ERROR', module, message, data),
  auth: (module, message, data) => log('AUTH', module, message, data),
  api: (module, message, data) => log('API', module, message, data),
  task: (module, message, data) => log('TASK', module, message, data),
  
  // Activer/désactiver les logs en runtime
  enable: () => localStorage.setItem('enableLogging', 'true'),
  disable: () => localStorage.setItem('enableLogging', 'false'),
  
  // Activer/désactiver un niveau spécifique
  enableLevel: (level) => {
    if (LOG_LEVELS[level]) LOG_LEVELS[level].enabled = true;
  },
  disableLevel: (level) => {
    if (LOG_LEVELS[level]) LOG_LEVELS[level].enabled = false;
  }
};

export default logger; 
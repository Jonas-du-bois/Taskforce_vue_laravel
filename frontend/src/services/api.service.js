import axios from 'axios';
import logger from '../utils/logger';

/**
 * Service API centralisé
 * Gère les appels API et intègre les tokens d'authentification
 */
class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      // Option pour journaliser les problèmes potentiels
      withCredentials: true
    });
    
    // Intercepteurs pour logging, traitement des tokens, etc.
    this.setupInterceptors();
  }
  
  /**
   * Configure les intercepteurs pour les requêtes et réponses
   */
  setupInterceptors() {
    // Interceptor de requête
    this.client.interceptors.request.use(config => {
      // Ajouter automatiquement le token d'authentification à chaque requête
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      logger.api('ApiService', `${config.method.toUpperCase()} ${config.url}`, { params: config.params });
      return config;
    }, error => {
      logger.error('ApiService', 'Erreur requête', error);
      return Promise.reject(error);
    });
    
    // Interceptor de réponse
    this.client.interceptors.response.use(response => {
      logger.api('ApiService', `${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
      return response;
    }, error => {
      logger.error('ApiService', `Erreur ${error.response?.status || 'réseau'}`, { 
        url: error.config?.url,
        message: error.response?.data?.message 
      });
      return Promise.reject(error);
    });
  }
  
  /**
   * Définit le token d'authentification pour les requêtes
   * @param {string} token - Token JWT
   */
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }
  
  /**
   * Méthodes HTTP
   */
  get(url, config = {}) {
    return this.client.get(url, config);
  }
  
  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }
  
  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }
  
  patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }
  
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

export default new ApiService(); 
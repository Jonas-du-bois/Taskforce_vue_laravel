import apiService from './api.service';
import logger from '../utils/logger';

class MarkService {
    constructor() {
        this.endpoint = '/v1/marks';
        this.manualEndpoint = '/v1/manual';
    }

    /**
     * Récupère les notes depuis l'API
     * @returns {Promise<Object>} Objet contenant les données de notes et l'information de cache
     */
    async getMarks() {
        try {
            logger.info('MarkService', 'Récupération des notes depuis l\'API');
            const response = await apiService.get(this.endpoint);
            
            return {
                data: response.data,
                cached: false,
                success: true
            };
        } catch (error) {
            logger.warn('MarkService', 'Impossible de récupérer les notes GAPS', error);
            // Retourner un tableau vide au lieu de throw
            return {
                data: [],
                cached: false,
                success: false,
                error: 'Notes GAPS non disponibles'
            };
        }
    }

    /**
     * Récupère les notes manuelles depuis l'API
     * @returns {Promise<Object>} Objet contenant les données de notes manuelles
     */
    async getManualNotes() {
        try {
            logger.info('MarkService', 'Récupération des notes manuelles depuis l\'API');
            const response = await apiService.get(this.manualEndpoint);
            
            // Si data est undefined, retourner un tableau vide
            if (!response?.data) {
                return {
                    data: [],
                    success: true
                };
            }

            // Normaliser la réponse pour toujours avoir un tableau
            const marks = Array.isArray(response.data) ? response.data :
                         Array.isArray(response.data.data) ? response.data.data : [];

            return {
                data: marks,
                success: true
            };
        } catch (error) {
            logger.error('MarkService', 'Erreur lors de la récupération des notes manuelles', error);
            return {
                data: [],
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la récupération des notes manuelles'
            };
        }
    }

    /**
     * Ajoute une note manuelle
     * @param {Object} markData Données de la note manuelle
     * @returns {Promise<Object>} Objet contenant la note ajoutée
     */
    async addManualMark(markData) {
        try {
            logger.info('MarkService', 'Ajout d\'une note manuelle');
            const response = await apiService.post(this.manualEndpoint, markData);
            
            // L'API renvoie directement les données de la note créée
            return response.data;
        } catch (error) {
            logger.error('MarkService', 'Erreur lors de l\'ajout d\'une note manuelle', error);
            throw error;
        }
    }

    /**
     * Supprime une note manuelle
     * @param {Number} noteId ID de la note à supprimer
     * @returns {Promise<Object>} Résultat de la suppression
     */
    async deleteManualMark(noteId) {
        try {
            logger.info('MarkService', 'Suppression d\'une note manuelle', { noteId });
            const response = await apiService.delete(`${this.manualEndpoint}/${noteId}`);
            return response.data;
        } catch (error) {
            logger.error('MarkService', 'Erreur lors de la suppression d\'une note manuelle', error);
            throw error;
        }
    }

    /**
     * Met à jour une note manuelle
     * @param {Number} noteId ID de la note à mettre à jour
     * @param {Object} markData Nouvelles données de la note
     * @returns {Promise<Object>} Note mise à jour
     */
    async updateManualMark(noteId, markData) {
        try {
            logger.info('MarkService', 'Mise à jour d\'une note manuelle', { noteId });
            const response = await apiService.put(`${this.manualEndpoint}/${noteId}`, markData);
            return response.data;
        } catch (error) {
            logger.error('MarkService', 'Erreur lors de la mise à jour d\'une note manuelle', error);
            throw error;
        }
    }

    /**
     * Vérifie si de nouvelles notes sont disponibles
     * @returns {Promise<boolean>}
     */
    async checkNewMarks() {
        try {
            const response = await this.getMarks();
            // Vérifier si de nouvelles notes sont disponibles en comparant avec les données locales
            return false; // À implémenter selon les besoins
        } catch (error) {
            logger.error('MarkService', 'Erreur lors de la vérification des nouvelles notes', error);
            return false;
        }
    }

    /**
     * Récupère toutes les notes (GAPS + manuelles)
     * @returns {Promise<Object>} Toutes les notes combinées
     */
    async getAllMarks() {
        const [gapsMarks, manualMarks] = await Promise.allSettled([
            this.getMarks(),
            this.getManualNotes()
        ]);

        return {
            gaps: gapsMarks.status === 'fulfilled' ? gapsMarks.value.data : [],
            manual: manualMarks.status === 'fulfilled' ? manualMarks.value.data : [],
            hasGapsError: gapsMarks.status === 'rejected',
            hasManualError: manualMarks.status === 'rejected'
        };
    }
}

export default new MarkService();
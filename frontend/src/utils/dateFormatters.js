import { format, parseISO, startOfWeek, endOfWeek, isSameDay, addWeeks, subWeeks, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formatage des dates pour l'application
 */
export const dateFormatters = {
  /**
   * Formate une plage de dates au format dd/MM/yyyy - dd/MM/yyyy
   */
  formatDateRange: (start, end) => {
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  },

  /**
   * Formate une date au format "jour 01 mois année"
   */
  formatDate: (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  },

  /**
   * Formate une heure au format HH:mm
   */
  formatTime: (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'HH:mm');
  },

  /**
   * Vérifie si une date est aujourd'hui
   */
  isToday: (date) => {
    return isSameDay(date, new Date());
  },

  /**
   * Obtient la date de début de semaine (lundi)
   */
  getStartOfWeek: (date = new Date()) => {
    return startOfWeek(date, { weekStartsOn: 1 });
  },

  /**
   * Obtient la date de fin de semaine (dimanche)
   */
  getEndOfWeek: (date = new Date()) => {
    return endOfWeek(date, { weekStartsOn: 1 });
  },

  /**
   * Avance d'une semaine
   */
  nextWeek: (date) => {
    return addWeeks(date, 1);
  },

  /**
   * Recule d'une semaine
   */
  previousWeek: (date) => {
    return subWeeks(date, 1);
  },

  /**
   * Obtient tous les jours de la semaine entre deux dates
   */
  getWeekDays: (startDate, endDate) => {
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });
    
    return days.map(day => ({
      name: format(day, 'EEEE', { locale: fr }),
      date: format(day, 'dd/MM'),
      fullDate: day
    }));
  }
};

export default dateFormatters; 
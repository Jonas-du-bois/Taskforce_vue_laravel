import { ref } from 'vue';
import { useTaskStore } from '@/stores/task';
import { useNotificationStore } from '@/stores/notification';
import logger from '@/utils/logger';

export function useTasks() {
  const taskStore = useTaskStore();
  const notificationStore = useNotificationStore();
  const addingTask = ref(false);

  const createQuickTask = async (quickTask) => {
    if (!quickTask.title.trim()) {
      notificationStore.addNotification({
        type: 'error',
        message: 'Veuillez saisir un titre pour la tâche'
      });
      return null;
    }

    addingTask.value = true;

    try {
      logger.task('useTasks', 'Création tâche rapide', {
        title: quickTask.title
      });

      const newTask = await taskStore.createTask({
        ...quickTask,
        status: 'à faire'
      });

      notificationStore.addNotification({
        type: 'success',
        message: 'Tâche créée avec succès'
      });

      logger.task('useTasks', 'Tâche rapide créée');
      return newTask;

    } catch (error) {
      logger.error('useTasks', 'Erreur lors de la création de la tâche rapide', error);
      notificationStore.addNotification({
        type: 'error',
        message: 'Erreur lors de la création de la tâche'
      });
      return null;
    } finally {
      addingTask.value = false;
    }
  };

  return {
    addingTask,
    createQuickTask
  };
}
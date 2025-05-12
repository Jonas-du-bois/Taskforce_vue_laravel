<template>
  <div class="flex-1 bg-gray-50 home-view">
    <!-- Contenu commun à tous les utilisateurs -->
    <div class="relative">
      <!-- Bannière de bienvenue avec dégradé -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <template v-if="isLoggedIn">
            <!-- Contenu pour utilisateurs connectés -->
            <h1 class="text-4xl font-extrabold text-white mb-2">
              Bienvenue, {{ user?.name || 'utilisateur' }} !
            </h1>
            <p class="text-indigo-100 text-xl max-w-3xl mx-auto italic mt-4">
              "La productivité n'est pas une question de temps, mais d'organisation et de concentration."
            </p>
            <div class="mt-8">
              <button @click="openCreateTaskModal"
                class="bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Commencer une nouvelle tâche
              </button>
            </div>
          </template>
          <template v-else>
            <!-- Contenu pour visiteurs -->
            <h1 class="text-5xl font-extrabold text-white mb-4">
              Gérez vos tâches avec <span class="text-indigo-200">Vue - TaskForce</span>
            </h1>
            <p class="text-indigo-100 text-xl max-w-3xl mx-auto mt-4 mb-8">
              La solution simple et efficace pour organiser votre travail, suivre vos projets et améliorer votre
              productivité.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <router-link to="/register"
                class="bg-white text-indigo-600 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Créer un compte
              </router-link>
              <router-link to="/login"
                class="bg-transparent text-white border-2 border-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition-all">
                Se connecter
              </router-link>
            </div>
          </template>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-if="isLoggedIn">
        <!-- Contenu pour utilisateurs connectés -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Colonne gauche: Aperçu des tâches -->
            <div class="md:col-span-2 space-y-8">
              <!-- Aperçu des tâches en cours -->
              <div class="bg-white rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tâches actuelles
                  </h2>
                  <router-link to="/tasks" class="text-sm text-indigo-600 hover:text-indigo-800 transition">
                    Voir toutes les tâches <span aria-hidden="true">→</span>
                  </router-link>
                </div>

                <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <HomeViewSkeleton v-for="n in 6" :key="n" />
  </div>

                <div v-else-if="error" class="py-6 text-center text-red-500">
                  {{ error }}
                </div>

                <div v-else-if="pendingAndInProgressTasks.length === 0" class="py-6 text-center text-gray-500">
                  Aucune tâche en cours pour le moment.
                </div>

                <div v-else class="space-y-4">
                  <div v-for="task in pendingAndInProgressTasks" :key="task.id"
                    class="border-b border-gray-200 last:border-0 py-4">
                    <div class="flex justify-between">
                      <div class="flex-1">
                        <router-link :to="`/tasks/${task.id}`"
                          class="font-medium text-gray-900 hover:text-indigo-600 transition block mb-1 truncate">
                          {{ task.title }}
                        </router-link>
                        <div class="flex items-center flex-wrap gap-2">
                          <div class="relative">
                            <button @click="openStatusMenu(task)"
                              class="text-sm inline-flex items-center rounded-full px-3 py-1" :class="{
                                'bg-red-100 text-red-800': task.status === 'pending' || task.status === 'à faire',
                                'bg-yellow-100 text-yellow-800': task.status === 'in_progress' || task.status === 'en cours',
                                'bg-green-100 text-green-800': task.status === 'completed' || task.status === 'terminée'
                              }">
                              <span>{{ statusLabel(task.status) }}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clip-rule="evenodd" />
                              </svg>
                            </button>

                            <!-- Menu de statut -->
                            <div v-if="activeStatusMenu === task.id"
                              class="status-menu absolute mt-1 z-10 bg-white rounded-md shadow-lg py-1 min-w-[150px]">
                              <button @click="changeTaskStatus(task, 'à faire')"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                :class="{ 'bg-gray-100': task.status === 'pending' || task.status === 'à faire' }">
                                À faire
                              </button>
                              <button @click="changeTaskStatus(task, 'en cours')"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                :class="{ 'bg-gray-100': task.status === 'in_progress' || task.status === 'en cours' }">
                                En cours
                              </button>
                              <button @click="changeTaskStatus(task, 'terminée')"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                :class="{ 'bg-gray-100': task.status === 'completed' || task.status === 'terminée' }">
                                Terminée
                              </button>
                            </div>
                          </div>

                          <span v-if="task.due_date" class="text-sm text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {{ formatDate(task.due_date) }}
                          </span>

                          <span class="text-sm inline-flex items-center rounded-full px-3 py-1" :class="{
                            'bg-red-100 text-red-800': task.priority === 'haute',
                            'bg-orange-100 text-orange-800': task.priority === 'moyenne',
                            'bg-gray-100 text-gray-800': task.priority === 'basse'
                          }">
                            {{ priorityLabel(task.priority) }}
                          </span>
                        </div>
                      </div>
                      <!--bouton de modification-->
                      <div class="ml-4 flex-shrink-0 flex">
                        <button @click="editTask(task)" class="text-gray-400 hover:text-indigo-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <!--bouton de suppression-->
                        </button>
                      </div>
                      <div class="ml-4 flex-shrink-0 flex">
                        <button @click="confirmDeleteTask(task)" class="text-gray-400 hover:text-red-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ajout rapide d'une tâche -->
              <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200">
                  <h2 class="text-xl font-bold text-gray-800">Ajout rapide</h2>
                </div>
                <div class="p-6">
                  <form @submit.prevent="createQuickTask" class="space-y-4">
                    <div>
                      <label for="quick_title" class="block text-sm font-medium text-gray-700">Titre de la tâche</label>
                      <input type="text" v-model="quickTask.title" id="quick_title" required
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="quick_priority" class="block text-sm font-medium text-gray-700">Priorité</label>
                        <select v-model="quickTask.priority" id="quick_priority"
                          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="basse">Basse</option>
                          <option value="moyenne">Moyenne</option>
                          <option value="haute">Haute</option>
                        </select>
                      </div>
                      <div>
                        <label for="quick_due_date" class="block text-sm font-medium text-gray-700">Date
                          d'échéance</label>
                        <input type="date" v-model="quickTask.due_date" id="quick_due_date"
                          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      </div>
                    </div>
                    <button type="submit" :disabled="addingTask"
                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span v-if="addingTask">Ajout en cours...</span>
                      <span v-else>Ajouter la tâche</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <!-- Colonne droite: Statistiques, notifications, etc. -->
            <div class="space-y-8">
              <!-- Statistiques de progression -->
              <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200">
                  <h2 class="text-xl font-bold text-gray-800">Votre progression</h2>
                </div>
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-gray-500">Tâches terminées aujourd'hui</span>
                    <span class="text-2xl font-bold text-indigo-600">{{ completedTodayCount }}</span>
                  </div>
                  <div class="flex items-center justify-between mb-8">
                    <span class="text-gray-500">Tâches terminées cette semaine</span>
                    <span class="text-2xl font-bold text-indigo-600">{{ completedThisWeekCount }}</span>
                  </div>

                  <!-- Graphique de progression -->
                  <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500 mb-2">Répartition des tâches</h3>
                    <div class="relative pt-1">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center">
                          <span class="inline-block w-2 h-2 bg-indigo-600 rounded-full mr-1"></span>
                          <span class="text-xs text-gray-500">{{ todoTasksCount }} à faire</span>
                        </div>
                        <div class="flex items-center">
                          <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          <span class="text-xs text-gray-500">{{ inProgressTasksCount }} en cours</span>
                        </div>
                        <div class="flex items-center">
                          <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          <span class="text-xs text-gray-500">{{ completedTasksCount }} terminées</span>
                        </div>
                      </div>
                      <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div class="flex w-full">
                          <div v-if="taskTotalCount > 0"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                            :style="`width: ${todoTasksPercent}%`"></div>
                          <div v-if="taskTotalCount > 0"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            :style="`width: ${inProgressTasksPercent}%`"></div>
                          <div v-if="taskTotalCount > 0"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                            :style="`width: ${completedTasksPercent}%`"></div>
                          <div v-if="taskTotalCount === 0"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-400 w-full">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Temps estimé -->
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">Temps estimé passé sur les tâches</span>
                    <div class="text-right">
                      <span class="text-lg font-semibold text-gray-800">
                        {{ estimatedTime }}
                      </span>
                      <router-link to="/tasks/create" class="block text-xs text-indigo-600 hover:text-indigo-800 mt-1">
                        Ajouter une tâche avec estimation
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notifications et rappels -->
              <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200">
                  <h2 class="text-xl font-bold text-gray-800">Rappels</h2>
                </div>
                <div class="p-4">
                  <div v-if="loading" class="flex justify-center py-6">
                    <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                  </div>
                  <ul v-else-if="overdueTasks.length > 0 || dueSoonTasks.length > 0" class="divide-y divide-gray-200">
                    <li v-for="task in overdueTasks" :key="'overdue-' + task.id" class="py-3 flex items-start">
                      <div class="flex-shrink-0 rounded-full bg-red-200 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">En retard: {{ task.title }}</p>
                        <p class="text-sm text-red-600">
                          Échéance dépassée ({{ formatDaysAgo(task.due_date) }})
                        </p>
                      </div>
                    </li>
                    <li v-for="task in dueSoonTasks" :key="'due-soon-' + task.id" class="py-3 flex items-start">
                      <div class="flex-shrink-0 rounded-full bg-yellow-200 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">À venir: {{ task.title }}</p>
                        <p class="text-sm text-yellow-600">
                          Échéance bientôt ({{ formatDueDate(task.due_date) }})
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div v-else class="text-center py-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p class="text-gray-500">Aucun rappel pour le moment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- Contenu pour visiteurs -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Pourquoi choisir Vue - TaskForce?</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all">
              <div class="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Organisation intuitive</h3>
              <p class="text-gray-600">Créez, organisez et suivez facilement vos tâches avec une interface simple et
                conviviale. Catégorisez et priorisez pour une gestion efficace.</p>
            </div>

            <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all">
              <div class="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Rappels & Notifications</h3>
              <p class="text-gray-600">Ne manquez jamais une échéance grâce à notre système de rappels. Recevez des
                notifications pour rester informé de l'état de vos tâches.</p>
            </div>

            <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all">
              <div class="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Suivi de progression</h3>
              <p class="text-gray-600">Visualisez facilement votre avancement et analysez votre productivité avec des
                graphiques et statistiques détaillés.</p>
            </div>
          </div>
        </div>

        <!-- Appel à l'action -->
        <div class="bg-indigo-50 py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-indigo-900 mb-4">Prêt à augmenter votre productivité?</h2>
            <p class="text-indigo-700 text-lg max-w-2xl mx-auto mb-8">
              Rejoignez des milliers d'utilisateurs qui ont transformé leur façon de travailler grâce à Vue - TaskForce.
            </p>
            <router-link to="/register"
              class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all">
              Commencer gratuitement
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour éditer une tâche -->
  <TaskModal :show="showTaskModal" :task="taskForm" :loading="submitting" @close="closeTaskModal" @submit="saveTask" />

  <!-- Modal de confirmation de suppression -->
  <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
        @click="closeDeleteModal"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Supprimer la tâche
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer cette tâche ? Cette
                  action est irréversible.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="deleteTask" :disabled="deleting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Supprimer
          </button>
          <button type="button" @click="closeDeleteModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '@/stores/auth';
import { useTaskStore } from '@/stores/task';
import { useNotificationStore } from '@/stores/notification';
import TaskModal from '@/components/tasks/TaskModal.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import { storeToRefs } from 'pinia';
import logger from '@/utils/logger';
import HomeViewSkeleton from '@/components/home/HomeViewSkeleton.vue';

// Définir les événements émis par ce composant
defineEmits(['notify']);

const router = useRouter();
const authStore = useAuthStore();
const taskStore = useTaskStore();
const notificationStore = useNotificationStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const { loading: storeLoading, error: storeError } = storeToRefs(taskStore);

// Utiliser uniquement Pinia pour l'authentification
const isLoggedIn = computed(() => isAuthenticated.value);

// Observer l'état de chargement du store pour mettre à jour l'état local
watch(storeLoading, (newValue) => {
  // Si le store est en cours de chargement, mettre à jour l'état local
  if (newValue !== loading.value) {
    loading.value = newValue;
  }
});

// Observer l'erreur du store pour mettre à jour l'état local
watch(storeError, (newValue) => {
  error.value = newValue;
});

// Log de l'état d'authentification (réduit et organisé)
logger.auth('HomeView', 'État authentification', {
  user: user.value?.id,
  isAuthenticated: isAuthenticated.value,
  hasToken: !!localStorage.getItem('token')
});

// État des données
const loading = ref(true);
const addingTask = ref(false);
const tasks = ref([]);
const quickTask = ref({
  title: '',
  priority: 'moyenne', // Format du backend
  due_date: '',
  status: 'à faire'    // Format du backend
});
const activeStatusMenu = ref(null);
const error = ref(null);

// États pour le modal d'édition de tâche
const showTaskModal = ref(false);
const editingTask = ref(null);
const submitting = ref(false);
const validationErrors = ref({});
const taskForm = ref({
  title: '',
  description: '',
  status: 'à faire',
  priority: 'moyenne',
  due_date: ''
});

// Statistiques calculées
const ongoingTasks = computed(() => tasks.value.filter(task => task.status !== 'terminée' && task.status !== 'completed'));
const pendingAndInProgressTasks = computed(() => {
  // Filtrer d'abord les tâches en cours et à faire
  const filteredTasks = tasks.value.filter(
    task => task.status === 'pending' || task.status === 'in_progress' ||
      task.status === 'à faire' || task.status === 'en cours'
  );
  
  // Trier par date d'échéance (du plus proche au plus éloigné)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Si les deux tâches n'ont pas de date d'échéance, ne pas changer l'ordre
    if (!a.due_date && !b.due_date) return 0;
    
    // Si une seule tâche n'a pas de date, la placer à la fin
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    
    // Sinon, comparer les dates (de la plus proche à la plus éloignée)
    return new Date(a.due_date) - new Date(b.due_date);
  });
  
  // Limiter à 8 tâches maximum
  return sortedTasks.slice(0, 5);
});
const overdueTasks = computed(() => tasks.value.filter(task =>
  (task.status !== 'terminée' && task.status !== 'completed') && task.due_date && isTaskOverdue(task)
));
const dueSoonTasks = computed(() => tasks.value.filter(task => {
  if (!task.due_date || task.status === 'terminée' || task.status === 'completed') return false;

  // Si la tâche est en retard, ne pas l'inclure dans "bientôt"
  if (isTaskOverdue(task)) return false;

  const dueDate = new Date(task.due_date);
  dueDate.setHours(0, 0, 0, 0); // Ignorer l'heure

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignorer l'heure

  // Calculer la différence en jours
  const diffTime = Math.abs(dueDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Inclure aujourd'hui (0 jours) et jusqu'à 3 jours dans le futur

  return diffDays <= 3;
}));

const todoTasksCount = computed(() => tasks.value.filter(task =>
  task.status === 'pending' || task.status === 'à faire'
).length);
const inProgressTasksCount = computed(() => tasks.value.filter(task =>
  task.status === 'in_progress' || task.status === 'en cours'
).length);
const completedTasksCount = computed(() => tasks.value.filter(task =>
  task.status === 'completed' || task.status === 'terminée'
).length);
const taskTotalCount = computed(() => tasks.value.length);

const todoTasksPercent = computed(() => taskTotalCount.value ? (todoTasksCount.value / taskTotalCount.value) * 100 : 0);
const inProgressTasksPercent = computed(() => taskTotalCount.value ? (inProgressTasksCount.value / taskTotalCount.value) * 100 : 0);
const completedTasksPercent = computed(() => taskTotalCount.value ? (completedTasksCount.value / taskTotalCount.value) * 100 : 0);

const completedTodayCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tasks.value.filter(task =>
    task.status === 'completed' &&
    task.updated_at &&
    new Date(task.updated_at) >= today
  ).length;
});

const completedThisWeekCount = computed(() => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return tasks.value.filter(task =>
    task.status === 'completed' &&
    task.updated_at &&
    new Date(task.updated_at) >= startOfWeek
  ).length;
});

const estimatedTime = computed(() => {
  // Calculer le temps total estimé en minutes, mais seulement pour les tâches à faire et en cours
  const totalMinutes = tasks.value
    .filter(task => task.status === 'à faire' || task.status === 'en cours' || 
            task.status === 'pending' || task.status === 'in_progress')
    .reduce((total, task) => {
      return total + (parseInt(task.estimated_minutes) || 0);
    }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
});

// Méthodes
const fetchTasks = async () => {
  if (!isLoggedIn.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    logger.task('HomeView', 'Chargement des tâches');
    await taskStore.fetchTasks();
    // Récupérer directement les tâches depuis le store Pinia
    tasks.value = [...taskStore.tasks];
    logger.task('HomeView', 'Tâches chargées', { count: tasks.value.length });
  } catch (error) {
    logger.error('HomeView', 'Erreur chargement tâches', error);
  } finally {
    loading.value = false;
  }
};

const createQuickTask = async () => {
  if (!quickTask.value.title.trim()) {
    notificationStore.addNotification({
      type: 'error',
      message: 'Veuillez saisir un titre pour la tâche'
    });
    return;
  }

  addingTask.value = true;

  try {
    logger.task('HomeView', 'Création tâche rapide', {
      title: quickTask.value.title
    });

    // Créer la tâche via le store
    const newTask = await taskStore.createTask({
      ...quickTask.value,
      status: 'à faire'
    });

    // Ajouter la nouvelle tâche directement à la liste locale
    tasks.value.unshift(newTask);

    // Réinitialiser le formulaire
    quickTask.value = {
      title: '',
      priority: 'moyenne',
      due_date: '',
      status: 'à faire'
    };

    logger.task('HomeView', 'Tâche rapide créée');

  } catch (error) {
    logger.error('HomeView', 'Erreur lors de la création de la tâche rapide', error);
    notificationStore.addNotification({
      type: 'error',
      message: 'Erreur lors de la création de la tâche'
    });
  } finally {
    addingTask.value = false;
  }
};

const isTaskOverdue = (task) => {
  if (!task.due_date) return false;

  // Convertir la date d'échéance en objet Date
  const dueDate = new Date(task.due_date);

  // Date actuelle sans l'heure (juste la date)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Comparer les dates sans tenir compte de l'heure
  // Une tâche n'est en retard que si sa date d'échéance est strictement antérieure à aujourd'hui
  return dueDate < today;
};


const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

const formatDaysAgo = (dateString) => {
  if (!dateString) return '';

  // Convertir la date d'échéance en objet Date et enlever l'heure
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);

  // Date actuelle sans l'heure
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date d'hier sans l'heure
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Comparer les dates
  if (dueDate.getTime() === yesterday.getTime()) {
    return 'hier';
  } else {
    // Calculer la différence en jours (toujours positif pour le passé)
    const diffTime = today - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `il y a ${diffDays} jours`;
  }
};

const formatDueDate = (dateString) => {
  if (!dateString) return '';

  // Convertir la date d'échéance en objet Date et enlever l'heure
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);

  // Date actuelle sans l'heure
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date de demain sans l'heure
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Comparer les dates
  if (dueDate.getTime() === today.getTime()) {
    return 'aujourd\'hui';
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return 'demain';
  } else {
    // Calculer la différence en jours
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `dans ${diffDays} jours`;
  }
};

const statusLabel = (status) => {
  switch (status) {
    case 'pending':
    case 'à faire':
      return 'À faire';
    case 'in_progress':
    case 'en cours':
      return 'En cours';
    case 'completed':
    case 'terminée':
      return 'Terminée';
    default:
      return status;
  }
};

const priorityLabel = (priority) => {
  switch (priority) {
    case 'low':
    case 'basse':
      return 'Faible';
    case 'medium':
    case 'moyenne':
      return 'Moyenne';
    case 'high':
    case 'haute':
      return 'Élevée';
    default:
      return priority;
  }
};

const openStatusMenu = (task) => {
  activeStatusMenu.value = activeStatusMenu.value === task.id ? null : task.id;
};

const changeTaskStatus = async (task, newStatus) => {
  try {
    logger.task('HomeView', 'Changement statut', { id: task.id, de: task.status, vers: newStatus });

    // Fermer le menu immédiatement pour une meilleure expérience utilisateur
    activeStatusMenu.value = null;

    // Optimistic update - mettre à jour l'UI avant la réponse du serveur
    const oldStatus = task.status;
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], status: newStatus };
    }

    // Appeler l'API
    try {
      await taskStore.changeTaskStatus(task.id, newStatus);
      logger.task('HomeView', 'Statut mis à jour', task.id);
    } catch (apiError) {
      logger.error('HomeView', 'Erreur API statut', apiError);

      // Essayer une méthode de secours avec axios directement
      try {
        logger.api('HomeView', 'Tentative méthode secours');

        // Récupérer les données complètes de la tâche
        const taskData = { ...task, status: newStatus };

        // Assurer que le token est inclus
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Faire la requête directement
        await axios.put(`/api/v1/tasks/${task.id}`, taskData, { headers });
        logger.api('HomeView', 'Méthode secours réussie');

        // La mise à jour optimiste est déjà faite, pas besoin de refaire
        return;
      } catch (fallbackError) {
        logger.error('HomeView', 'Échec méthode secours', fallbackError);

        // Annuler le changement optimiste en cas d'erreur
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], status: oldStatus };
        }

        // Relancer l'erreur originale
        throw apiError;
      }
    }
  } catch (error) {
    logger.error('HomeView', 'Erreur mise à jour statut', error);
  }
};

// Ajouter un gestionnaire de clic global pour fermer le menu de statut
const handleGlobalClick = (event) => {
  // Si le menu est ouvert et que le clic n'est pas sur un élément du menu
  if (activeStatusMenu.value !== null) {
    const statusMenus = document.querySelectorAll('.status-menu');
    let clickedOnMenu = false;

    // Vérifier si le clic est sur un bouton de statut (qui ont un attribut @click qui contient openStatusMenu)
    const statusButtons = document.querySelectorAll('button[class*="rounded-full"]');
    for (const button of statusButtons) {
      if (button.contains(event.target)) {
        clickedOnMenu = true;
        break;
      }
    }

    // Vérifier si le clic est sur un menu de statut
    if (!clickedOnMenu) {
      for (const menu of statusMenus) {
        if (menu.contains(event.target)) {
          clickedOnMenu = true;
          break;
        }
      }
    }

    // Si le clic n'est ni sur un bouton ni sur un menu, fermer le menu
    if (!clickedOnMenu) {
      activeStatusMenu.value = null;
    }
  }
};

// Fonction pour ouvrir le modal en vue de créer une nouvelle tâche
function openCreateTaskModal() {
  taskForm.value = {
    title: '',
    description: '',
    status: 'à faire',
    priority: 'moyenne',
    due_date: ''
  };
  editingTask.value = null;
  showTaskModal.value = true;
}

// Fonction pour ouvrir le modal d'édition d'une tâche existante
function editTask(task) {
  logger.task('HomeView', 'Édition de tâche', { id: task.id });
  editingTask.value = { ...task };
  taskForm.value = { ...task };
  showTaskModal.value = true;
}

// Fonction pour fermer le modal de tâche
function closeTaskModal() {
  showTaskModal.value = false;
  validationErrors.value = {};
}

// Fonction pour sauvegarder une tâche (création ou mise à jour)
async function saveTask(task) {
  submitting.value = true;
  validationErrors.value = {};

  try {
    if (editingTask.value) {
      await taskStore.updateTask(task);
    } else {
      await taskStore.createTask(task);
    }

    // Fermer la modal
    closeTaskModal();
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la tâche:', error);

    // Gérer les erreurs de validation
    if (error.response?.status === 422) {
      validationErrors.value = error.response.data.errors;
    } else {
      notificationStore.addNotification({
        type: 'error',
        message: 'Une erreur est survenue lors de la sauvegarde de la tâche'
      });
    }
  } finally {
    submitting.value = false;
  }
}

// Dans la section des déclarations d'état
const showDeleteModal = ref(false);
const taskToDelete = ref(null);
const deleting = ref(false);

// Fonction pour afficher la confirmation de suppression
function confirmDeleteTask(task) {
  taskToDelete.value = task;
  showDeleteModal.value = true;
}

// Fonction pour supprimer une tâche
async function deleteTask() {
  if (!taskToDelete.value) return;

  deleting.value = true;

  try {
    logger.task('HomeView', 'Suppression de tâche', { id: taskToDelete.value.id });
    await taskStore.deleteTask(taskToDelete.value.id);
    
    closeDeleteModal();
    
    // Rafraîchir les tâches
    await fetchTasks();
    
    // Émettre un événement personnalisé pour notifier d'autres composants que les tâches ont été mises à jour
    window.dispatchEvent(new CustomEvent('tasks-updated'));
  } catch (error) {
    logger.error('HomeView', 'Erreur lors de la suppression de tâche', error);
    
    notificationStore.addNotification({
      type: 'error',
      message: 'Erreur lors de la suppression de la tâche'
    });
  } finally {
    deleting.value = false;
  }
}

// Fonction pour fermer la modal de confirmation de suppression
function closeDeleteModal() {
  showDeleteModal.value = false;
  taskToDelete.value = null;
}

// Cycle de vie
onMounted(async () => {
  document.title = "Accueil - Vue - TaskForce";

  logger.info('HomeView', 'Montage composant', {
    token: !!localStorage.getItem('token'),
    isLoggedIn: isLoggedIn.value
  });

  // Initialiser l'authentification si nécessaire
  if (localStorage.getItem('token') && !user.value) {
    try {
      logger.auth('HomeView', 'Initialisation authentification');
      await authStore.fetchCurrentUser();
      logger.auth('HomeView', 'Authentification initialisée', { userId: authStore.user?.id });
    } catch (error) {
      logger.error('HomeView', 'Erreur initialisation authentification', error);
    }
  }

  // Charger les tâches
  await fetchTasks();

  // Ajouter le gestionnaire de clic global pour fermer le menu de statut
  document.addEventListener('click', handleGlobalClick);

  // Ajouter un écouteur d'événement pour détecter les mises à jour de tâches
  window.addEventListener('tasks-updated', fetchTasks);
});

// Nettoyage
onUnmounted(() => {
  // Supprimer le gestionnaire de clic global pour éviter les fuites de mémoire
  document.removeEventListener('click', handleGlobalClick);

  // Supprimer l'écouteur d'événement pour les mises à jour de tâches
  window.removeEventListener('tasks-updated', fetchTasks);
});
</script>

<style scoped>
.home-view {
  height: calc(100vh - 9rem);
  overflow-y: auto;
}

@media (max-height: 800px) {
  .home-view {
    min-height: calc(100vh - 9rem);
    height: auto;
  }
}
</style>
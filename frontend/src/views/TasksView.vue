<template>
  <div class="flex h-[calc(100vh-4rem)] bg-gray-100">
    <!-- Sidebar - Maintenant responsive avec classe conditionnelle -->
    <aside
      class="w-64 bg-white shadow-md absolute z-10 h-full overflow-y-auto transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0"
      :class="{
        'translate-x-0': showSidebar,
        '-translate-x-full': !showSidebar,
      }">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">TaskForce</h2>
        <button @click="showSidebar = false" class="p-1 rounded-md hover:bg-gray-200 sm:hidden">
          <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav class="mt-4 space-y-1">
        <a href="#" @click.prevent="setStatusFilter('')"
          class="flex items-center px-4 py-2 text-gray-700 rounded-md mx-2"
          :class="{ 'bg-gray-200': filters.status === '' }">
          <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span class="flex-1">Toutes les tâches</span>
          <span
            class="bg-gray-100 text-gray-800 ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full">
            {{ totalTasks }}
          </span>
        </a>
        <a href="#" @click.prevent="setStatusFilter('à faire')"
          class="flex items-center px-4 py-2 text-gray-700 rounded-md mx-2"
          :class="{ 'bg-gray-200': filters.status === 'à faire' }">
          <svg class="h-5 w-5 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="flex-1">À faire</span>
          <span
            class="bg-red-100 text-red-800 ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full">
            {{ taskCountByStatus["à faire"] || 0 }}
          </span>
        </a>
        <a href="#" @click.prevent="setStatusFilter('en cours')"
          class="flex items-center px-4 py-2 text-gray-700 rounded-md mx-2"
          :class="{ 'bg-gray-200': filters.status === 'en cours' }">
          <svg class="h-5 w-5 mr-2 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="flex-1">En cours</span>
          <span
            class="bg-yellow-100 text-yellow-800 ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full">
            {{ taskCountByStatus["en cours"] || 0 }}
          </span>
        </a>
        <a href="#" @click.prevent="setStatusFilter('terminée')"
          class="flex items-center px-4 py-2 text-gray-700 rounded-md mx-2"
          :class="{ 'bg-gray-200': filters.status === 'terminée' }">
          <svg class="h-5 w-5 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="flex-1">Terminé</span>
          <span
            class="bg-green-100 text-green-800 ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full">
            {{ taskCountByStatus["terminée"] || 0 }}
          </span>
        </a>
        <div class="border-t border-gray-200 my-3"></div>
        <a href="#" @click.prevent="openAddTaskModal"
          class="flex items-center px-4 py-2 text-indigo-700 rounded-md mx-2 font-medium">
          <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvelle tâche
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header avec bouton menu pour mobile -->
      <header class="bg-white shadow-sm p-4 sm:hidden">
        <button @click="showSidebar = true" class="p-2 rounded-md hoverbg-gray-100">
          <svg class="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div class="w-full mx-auto px-16 lg">
          <!-- Titre et actions -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Gestion des tâches
              </h1>
              <p class="mt-1 text-sm text-gray-600">
                {{ totalTasks }} tâches au total
              </p>
            </div>
            <div class="mt-4 sm:mt-0 flex gap-2">
              <button @click="openAddTaskModal"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvelle tâche
              </button>
            </div>
          </div>

          <!-- Utilisation du composant TaskFilters -->
          <TaskFilters 
            :initialFilters="filters" 
            @change="handleFilterChange" 
            class="mb-6"
          />

          <!-- État de chargement
          <div v-if="loading" class="flex justify-center py-20">
            <svg class="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div> -->

          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Load colonne "À faire" -->
            <div class="bg-red-50 rounded-lg p-4 shadow">
              <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                À faire
              </h3>
              <div class="space-y-4">
                <TaskSkeleton v-for="n in 3" :key="'todo-' + n" />
              </div>
            </div>

            <!-- load colonne "En cours" -->
            <div class="bg-yellow-50 rounded-lg p-4 shadow">
              <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                En cours
              </h3>
              <div class="space-y-4">
                <TaskSkeleton v-for="n in 2" :key="'progress-' + n" />
              </div>
            </div>

            <!-- Load colonne "Terminé" -->
            <div class="bg-gray-200 rounded-lg p-4 shadow">
              <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Terminé
              </h3>
              <div class="space-y-4">
                <TaskSkeleton v-for="n in 2" :key="'done-' + n" />
              </div>
            </div>
          </div>

          <!-- Colonnes de tâches -->
          <div v-else class="select-none"
            :class="{ 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4': !filters.status, 'flex flex-col gap-4': filters.status }">
            <!-- Colonne 'À faire' -->
            <transition name="fade-slide" mode="out-in">
              <div v-if="shouldShowColumn('à faire')" class="bg-red-50 rounded-lg p-4 shadow"
                :class="{ 'w-full': filters.status }">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  À faire
                </h3>
                <draggable :list="groupedTasks['à faire'] || []" group="tasks" @end="handleDragEnd" item-key="id"
                  class="space-y-4 min-h-[100px]" data-status="à faire">
                  <template #item="{ element }">
                    <div class="bg-white p-4 rounded-lg shadow cursor-move group relative">
                      <div
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 z-10">
                        <button @click.stop="editTask(element)"
                          class="p-1 text-gray-500 hover:text-indigo-600 bg-white rounded-full shadow">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button @click.stop="confirmDeleteTask(element)"
                          class="p-1 text-gray-500 hover:text-red-600 bg-white rounded-full shadow">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div @click="$router.push(`/tasks/${element.id}`)">
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="text-base font-medium text-gray-800">
                            {{ element.title }}
                          </h4>
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="{
                            'bg-red-100 text-red-800':
                              element.priority === 'haute',
                            'bg-yellow-100 text-yellow-800':
                              element.priority === 'moyenne',
                            'bg-blue-100 text-blue-800':
                              element.priority === 'basse',
                          }">
                            {{ formatPriority(element.priority) }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">
                          {{ element.description }}
                        </p>
                        <div class="text-xs text-gray-500 flex items-center">
                          <svg class="mr-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Échéance : {{ formatDate(element.due_date) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </draggable>
                <p v-if="
                  !loading &&
                  (!groupedTasks['à faire'] ||
                    groupedTasks['à faire'].length === 0)
                " class="text-center text-gray-500 text-sm mt-4">
                  Aucune tâche
                </p>
              </div>
            </transition>

            <!-- Colonne 'En cours' -->
            <transition name="fade-slide" mode="out-in">
              <div v-if="shouldShowColumn('en cours')" class="bg-yellow-50 rounded-lg p-4 shadow"
                :class="{ 'w-full': filters.status }">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  En cours
                </h3>
                <draggable :list="groupedTasks['en cours'] || []" group="tasks" @end="handleDragEnd" item-key="id"
                  class="space-y-4 min-h-[100px]" data-status="en cours">
                  <template #item="{ element }">
                    <div class="bg-white p-4 rounded-lg shadow cursor-move group relative">
                      <div
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 z-10">
                        <button @click.stop="editTask(element)"
                          class="p-1 text-gray-500 hover:text-indigo-600 bg-white rounded-full shadow">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button @click.stop="confirmDeleteTask(element)"
                          class="p-1 text-gray-500 hover:text-red-600 bg-white rounded-full shadow">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div @click="$router.push(`/tasks/${element.id}`)">
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="text-base font-medium text-gray-800">
                            {{ element.title }}
                          </h4>
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="{
                            'bg-red-100 text-red-800':
                              element.priority === 'haute',
                            'bg-yellow-100 text-yellow-800':
                              element.priority === 'moyenne',
                            'bg-blue-100 text-blue-800':
                              element.priority === 'basse',
                          }">
                            {{ formatPriority(element.priority) }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">
                          {{ element.description }}
                        </p>
                        <div class="text-xs text-gray-500 flex items-center">
                          <svg class="mr-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Échéance : {{ formatDate(element.due_date) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </draggable>
                <p v-if="
                  !loading &&
                  (!groupedTasks['en cours'] ||
                    groupedTasks['en cours'].length === 0)
                " class="text-center text-gray-500 text-sm mt-4">
                  Aucune tâche
                </p>
              </div>
            </transition>

            <!-- Colonne 'Terminé' -->
            <transition name="fade-slide" mode="out-in">
              <div v-if="shouldShowColumn('terminée')" class="bg-gray-200 rounded-lg p-4 shadow"
                :class="{ 'w-full': filters.status }">
                <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Terminé
                </h3>
                <draggable :list="groupedTasks['terminée'] || []" group="tasks" @end="handleDragEnd" item-key="id"
                  class="space-y-4 min-h-[100px]" data-status="terminée">
                  <template #item="{ element }">
                    <div class="bg-white p-4 rounded-lg shadow cursor-move group relative opacity-70 hover:opacity-100">
                      <div
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 z-10">
                        <button @click.stop="editTask(element)"
                          class="p-1 text-gray-500 hover:text-indigo-600 bg-white rounded-full shadow">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button @click.stop="confirmDeleteTask(element)"
                          class="p-1 text-gray-500 hover:text-red-600 bg-white rounded-full shadow">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div @click="$router.push(`/tasks/${element.id}`)">
                        <div class="flex justify-between items-start mb-2">
                          <h4 class="text-base font-medium text-gray-800 line-through">
                            {{ element.title }}
                          </h4>
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="{
                            'bg-red-100 text-red-800':
                              element.priority === 'haute',
                            'bg-yellow-100 text-yellow-800':
                              element.priority === 'moyenne',
                            'bg-blue-100 text-blue-800':
                              element.priority === 'basse',
                          }">
                            {{ formatPriority(element.priority) }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3 line-through">
                          {{ element.description }}
                        </p>
                        <div class="text-xs text-gray-500 flex items-center">
                          <svg class="mr-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Échéance : {{ formatDate(element.due_date) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </draggable>
                <p v-if="
                  !loading &&
                  (!groupedTasks['terminée'] ||
                    groupedTasks['terminée'].length === 0)
                " class="text-center text-gray-500 text-sm mt-4">
                  Aucune tâche
                </p>
              </div>
            </transition>
          </div>

          <!-- Affichage si aucune tâche après filtrage -->
          <div v-if="
            !loading && totalTasks > 0 && filteredAndGroupedTaskCount === 0
          " class="bg-white shadow rounded-lg overflow-hidden mt-6">
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">
                Aucune tâche trouvée
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Aucune tâche ne correspond à vos critères de filtre ou de
                recherche.
              </p>
            </div>
          </div>

          <!-- Affichage si aucune tâche du tout -->
          <div v-if="!loading && totalTasks === 0" class="bg-white shadow rounded-lg overflow-hidden mt-6">
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">
                Commencez à organiser !
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Créez votre première tâche pour la voir apparaître ici.
              </p>
              <div class="mt-6">
                <button @click="openAddTaskModal"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Créer une tâche
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal pour ajouter/modifier une tâche -->
    <TaskModal :show="showTaskModal" :task="taskForm" :loading="submitting" @close="closeTaskModal"
      @submit="saveTask" />

    <!-- Modal de confirmation -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import draggable from "vuedraggable";
import { useTaskStore } from '../stores/task';
import { useNotificationStore } from '../stores/notification';
import { useAuthStore } from '@/stores/auth';
import TaskModal from '@/components/tasks/TaskModal.vue';
import TaskFilters from '@/components/tasks/TaskFilters.vue';
import logger from '@/utils/logger';
import TaskSkeleton from '@/components/tasks/TaskViewSkeleton.vue';

const taskStore = useTaskStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// États
const tasks = ref([]);
const loading = ref(true);
const error = ref(null);
const showTaskModal = ref(false);
const showDeleteModal = ref(false);
const editingTask = ref(null);
const taskToDelete = ref(null);
const submitting = ref(false);
const deleting = ref(false);
const validationErrors = ref({});
const showSidebar = ref(false);
const showFilters = ref(false);

// Formulaire
const taskForm = ref({
  title: "",
  description: "",
  status: "à faire",
  priority: "moyenne",
  due_date: new Date().toISOString().split("T")[0],
});

// Filtres
const filters = ref({
  search: "",
  status: "",
  priority: "",
});

// Helper pour regrouper les tâches
const groupTasksByStatus = (tasksToGroup) => {
  return tasksToGroup.reduce((acc, task) => {
    const status = task.status || "à faire"; // Fallback si le statut est manquant
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});
};

// Computed properties
const totalTasks = computed(() => tasks.value.length);

// Propriété calculée pour compter les tâches par statut
const taskCountByStatus = computed(() => {
  return tasks.value.reduce((acc, task) => {
    const status = task.status || "à faire";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
});

// Propriété calculée pour les tâches filtrées (avant regroupement)
const filteredTasks = computed(() => {
  let result = [...tasks.value];

  // Filtre par statut
  if (filters.value.status) {
    result = result.filter((task) => task.status === filters.value.status);
  }

  // Filtre par priorité
  if (filters.value.priority) {
    result = result.filter((task) => task.priority === filters.value.priority);
  }

  // Filtre par recherche
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description &&
          task.description.toLowerCase().includes(searchLower))
    );
  }

  // Tri par date d'échéance (optionnel pour le drag-and-drop, peut être retiré si l'ordre dans les colonnes est géré autrement)
  // return result.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  return result;
});

/* // Propriété calculée pour les tâches groupées par statut (pour les colonnes draggable)*/
const groupedTasks = ref({});

/* // Watcher pour mettre à jour groupedTasks quand filteredTasks change */
watch(
  filteredTasks,
  (newFilteredTasks) => {
    groupedTasks.value = groupTasksByStatus(newFilteredTasks);
    logger.debug('TasksView', 'Groupes de tâches mis à jour', groupedTasks.value);
  },
  { immediate: true }
);

// Compter le nombre total de tâches après filtrage et regroupement
const filteredAndGroupedTaskCount = computed(() => {
  return Object.values(groupedTasks.value).reduce(
    (sum, group) => sum + group.length,
    0
  );
});

// Pour déterminer si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return filters.value.priority !== '' || filters.value.search !== '' || filters.value.status !== '';
});

// Méthodes pour les filtres
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    priority: ''
  };
  applyFilters();
};

const applyFilters = () => {
  fetchTasks();
};

// Méthodes
const fetchTasks = async () => {
  if (!authStore.isAuthenticated) {
    logger.warn('TasksView', 'Tentative de chargement des tâches sans authentification');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    logger.task('TasksView', 'Chargement des tâches');

    // Utiliser le store Pinia pour récupérer les tâches
    const taskFilters = {
      status: filters.value.status,
      priority: filters.value.priority,
      search: filters.value.search
    };

    await taskStore.fetchTasks(taskFilters);
    tasks.value = taskStore.getAllTasks;

    logger.task('TasksView', 'Tâches chargées avec succès', { count: tasks.value.length });
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des tâches';
    logger.error('TasksView', 'Erreur de chargement des tâches', err);
    notificationStore.addNotification({
      type: 'error',
      message: 'Impossible de charger les tâches'
    });
  } finally {
    loading.value = false;
  }
};

const openAddTaskModal = () => {
  editingTask.value = null;
  resetTaskForm();
  showTaskModal.value = true;
  validationErrors.value = {};
};

const editTask = (task) => {
  logger.task('TasksView', 'Édition de tâche', { id: task.id });
  editingTask.value = { ...task };
  taskForm.value = { ...task };
  showTaskModal.value = true;
};

const resetTaskForm = () => {
  taskForm.value = {
    title: "",
    description: "",
    status: "à faire",
    priority: "moyenne",
    due_date: new Date().toISOString().split("T")[0],
  };
};

const saveTask = async (task) => {
  submitting.value = true;
  validationErrors.value = {};

  try {
    // Si nous avons un ID, c'est une mise à jour
    if (editingTask.value) {
      const updatedTask = await taskStore.updateTask({
        id: editingTask.value.id,
        ...task
      });
      
      // Mettre à jour la tâche dans la liste locale
      const index = tasks.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
        // Regrouper les tâches après la mise à jour
        groupedTasks.value = groupTasksByStatus(filteredTasks.value);
      }
    } else {
      // Pour une création, ajouter directement la nouvelle tâche
      const newTask = await taskStore.createTask(task);
      tasks.value.unshift(newTask);
      // Regrouper les tâches après l'ajout
      groupedTasks.value = groupTasksByStatus(filteredTasks.value);
    }

    // Fermer la modal
    closeTaskModal();
  } catch (error) {
    logger.error('TasksView', 'Erreur lors de la sauvegarde de la tâche', error);

    if (error.response && error.response.status === 422 && error.response.data.errors) {
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
};

const confirmDeleteTask = (task) => {
  taskToDelete.value = task;
  showDeleteModal.value = true;
};

const deleteTask = async () => {
  if (!taskToDelete.value) return;

  deleting.value = true;

  try {
    logger.task('TasksView', 'Suppression de tâche', { id: taskToDelete.value.id });
    await taskStore.deleteTask(taskToDelete.value.id);

    closeDeleteModal();

    await fetchTasks();

    // Émettre un événement personnalisé pour notifier d'autres composants que les tâches ont été mises à jour
    window.dispatchEvent(new CustomEvent('tasks-updated'));
  } catch (err) {
    logger.error('TasksView', 'Erreur lors de la suppression de tâche', err);
  } finally {
    deleting.value = false;
  }
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  editingTask.value = null;
  resetTaskForm();
  validationErrors.value = {}; // Reset errors on close
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  taskToDelete.value = null;  // Mettre à null même si déjà null
};

// Formatters
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

const formatPriority = (priority) => {
  const priorityMap = {
    basse: "Basse",
    moyenne: "Moyenne",
    haute: "Haute",
  };
  return priorityMap[priority] || priority;
};

// Méthode pour filtrer les tâches par statut depuis la sidebar
const setStatusFilter = (status) => {
  filters.value.status = status;
  // Effacer les autres filtres pour une expérience utilisateur plus claire
  filters.value.search = "";
  logger.info('TasksView', 'Filtre par statut appliqué', status);

  // Rafraîchir les tâches avec le nouveau filtre
  fetchTasks();
};

// Nouvelle méthode pour gérer la fin du drag & drop
const handleDragEnd = async (event) => {
  const { item, to, from, newIndex, oldIndex } = event;
  const taskId = item._underlying_vm_.id;
  const newStatus = to.dataset.status;
  const oldStatus = from.dataset.status;

  logger.task('TasksView', 'Tâche déplacée', {
    id: taskId,
    de: oldStatus,
    vers: newStatus
  });

  // Si la tâche est déplacée dans la même colonne, ne rien faire
  if (to === from && newIndex === oldIndex) {
    logger.debug('TasksView', 'Aucun changement de position ou statut');
    return;
  }

  // Trouver la tâche dans le state principal
  const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    logger.error('TasksView', 'Tâche déplacée non trouvée dans la liste principale');
    return;
  }

  const taskToUpdate = tasks.value[taskIndex];

  // Si le statut a changé
  if (newStatus && newStatus !== taskToUpdate.status) {
    const originalStatus = taskToUpdate.status;

    // Mise à jour optimiste de l'UI
    const updatedTask = { ...taskToUpdate, status: newStatus };
    tasks.value[taskIndex] = updatedTask;
    groupedTasks.value = groupTasksByStatus(filteredTasks.value);

    try {
      await taskStore.changeTaskStatus(taskId, newStatus);
      // Pas besoin de recharger toutes les tâches
    } catch (error) {
      // Restaurer l'état précédent en cas d'erreur
      tasks.value[taskIndex] = { ...taskToUpdate, status: originalStatus };
      groupedTasks.value = groupTasksByStatus(filteredTasks.value);

      notificationStore.addNotification({
        type: "error",
        message: "Erreur lors de la mise à jour du statut."
      });
    }
  }
};

// Méthode pour déterminer si une colonne doit être affichée
const shouldShowColumn = (status) => {
  // Si aucun filtre n'est sélectionné, afficher toutes les colonnes
  if (!filters.value.status) return true;

  // Sinon, n'afficher que la colonne correspondant au filtre sélectionné
  return filters.value.status === status;
};

// Surveillance des changements d'authentification
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    logger.auth('TasksView', 'Utilisateur authentifié, chargement des tâches');
    fetchTasks();
  } else {
    logger.auth('TasksView', 'Utilisateur non authentifié, redirection');
    router.push('/login');
  }
}, { immediate: true });

// Initialisation
onMounted(() => {
  logger.info('TasksView', 'Montage du composant');
  if (authStore.isAuthenticated) {
    fetchTasks();
  }

  // Initialiser la sidebar visible sur desktop
  showSidebar.value = window.innerWidth >= 640; // sm breakpoint

  // Écouter l'événement d'ouverture du modal
  window.addEventListener("openTaskModal", openAddTaskModal);

  // Vérifier si la route contient un paramètre "create"
  if (route.query.create === "true") {
    openAddTaskModal();
  }
});

onUnmounted(() => {
  // Nettoyer l'écouteur d'événement
  window.removeEventListener("openTaskModal", openAddTaskModal);
});

// Méthode pour gérer les changements de filtres
const handleFilterChange = (newFilters) => {
  filters.value = {
    ...filters.value,
    ...newFilters
  };
  applyFilters();
};
</script>

<style scoped>
/* Styles pour l'animation de transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Styles pour améliorer l'apparence du glisser-déposer */
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.drag-area {
  min-height: 50px;
  /* Assure qu'une zone de dépôt est toujours visible */
}

/* Style pour les cartes tâches */
.task-card {
  /* Ajoutez ici des styles spécifiques aux cartes si nécessaire */
  transition: box-shadow 0.2s ease-in-out;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

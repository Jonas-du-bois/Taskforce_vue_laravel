<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête de la page avec bouton d'ajout -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Mes notes</h1>
        <p class="text-gray-600 mt-2">Consultez vos notes récupérées depuis GAPS</p>
      </div>
      <button 
        @click="openAddModal" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Ajouter une note
      </button>
    </div>

    <!-- Message pour configuration des identifiants GAPS -->
    <div v-if="needsSetup" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Pour consulter vos notes, vous devez configurer vos identifiants GAPS.
            <router-link to="/profile" class="font-medium underline text-yellow-700 hover:text-yellow-600">
              Configurer maintenant
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Afficher le chargement -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Afficher l'erreur -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg text-center">
      <svg class="h-12 w-12 text-red-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-lg font-medium">{{ error }}</p>
      <p class="mt-2 text-sm">Assurez-vous que vos identifiants GAPS sont corrects dans votre profil.</p>
      <button @click="loadMarks" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
        Réessayer
      </button>
    </div>

    <!-- Aucune note disponible -->
    <div v-else-if="marks.length === 0" class="bg-white rounded-lg shadow-lg overflow-hidden text-center py-12 px-6">
      <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Aucune note disponible</h2>
      <p class="text-gray-500 max-w-md mx-auto">
        Nous n'avons pas trouvé de notes dans GAPS. Les notes seront affichées ici dès qu'elles seront disponibles.
      </p>
      <button @click="loadMarks" class="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
        Actualiser
      </button>
    </div>

    <!-- Afficher les notes -->
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- En-tête -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Notes récupérées</h2>
          <p v-if="isCached" class="text-sm text-gray-500 mt-1">
            Dernière mise à jour: {{ formatDate(new Date()) }}
            <span class="text-xs text-gray-400 ml-1">(récupérées depuis le cache)</span>
          </p>
        </div>
        <div class="flex space-x-4">
          <button @click="loadMarks" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Tableau -->
      <div class="p-6">
        <!-- Statistiques globales -->
        <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div class="bg-indigo-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-indigo-800">Moyenne générale</h3>
            <p class="mt-2 text-3xl font-bold text-indigo-600">{{ formatAverage(globalAverage) }}</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800">Nombre de notes</h3>
            <p class="mt-2 text-3xl font-bold text-blue-600">{{ totalMarksCount }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-green-800">Nombre de cours</h3>
            <p class="mt-2 text-3xl font-bold text-green-600">{{ Object.keys(groupedByCourse).length }}</p>
          </div>
        </div>

        <!-- Liste des cours -->
        <div class="space-y-6">
          <div v-for="(courseMarks, courseName) in groupedByCourse" :key="courseName" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-800">{{ courseName }}</h3>
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 mr-2">Moyenne :</span>
                <span class="px-3 py-1 rounded-full text-sm font-semibold" :class="getAverageClass(courseAverages[courseName])">
                  {{ formatAverage(courseAverages[courseName]) }}
                </span>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="mark in courseMarks" :key="mark.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ mark.description || mark.test_name }}</div>
                      <div v-if="mark.is_manual" class="text-xs text-blue-500 font-medium">Note manuelle</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="getScoreClass(mark.note || mark.score, mark.max_note || mark.max_score)">
                        {{ mark.note || mark.score }} / {{ mark.max_note || mark.max_score }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ mark.coefficient || 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(mark.date_note || mark.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div v-if="mark.is_manual" class="flex justify-end space-x-2">
                        <button @click="editNote(mark)" class="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button @click="deleteManualNote(mark.id)" class="text-red-600 hover:text-red-900" title="Supprimer">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modale d'ajout de note -->
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="showAddModal = false"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- En-tête amélioré -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 sm:px-6 flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
              <span v-if="editingNote" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Modifier la note
              </span>
              <span v-else class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Nouvelle note
              </span>
            </h3>
            <button 
              type="button" 
              class="text-white hover:text-gray-200 focus:outline-none"
              @click="showAddModal = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Formulaire amélioré -->
          <form @submit.prevent="saveNote" class="divide-y divide-gray-200">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <!-- Champ cours avec icône -->
              <div class="mb-5">
                <label for="course" class="block text-sm font-medium text-gray-700 mb-1">Cours <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 a1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <input
                    v-model="newNote.course_name"
                    type="text"
                    id="course"
                    required
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="Nom du cours"div
                  />
                </div>
              </div>

              <!-- Champ description avec icône -->
              <div class="mb-5">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute top-3 left-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <textarea
                    id="description"
                    v-model="newNote.description"
                    rows="3"
                    required
                    class="pl-10 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="Description de l'évaluation"
                  ></textarea>
                </div>
              </div>

              <!-- Champ date avec icône -->
              <div class="mb-5">
                <label for="date_note" class="block text-sm font-medium text-gray-700 mb-1">Date <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="date_note"
                    v-model="newNote.date_note"
                    required
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                  />
                </div>
              </div>

              <!-- Note -->
              <div class="mb-5">
                <label for="note" class="block text-sm font-medium text-gray-700 mb-1">Note <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="6"
                    id="note"
                    v-model="newNote.note"
                    required
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="Saisir votre note sur 6"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">La note doit être sur 6</p>
              </div>

              <!-- Coefficient -->
              <div class="mb-5">
                <label for="coefficient" class="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698V5.56c0 .41.335.75.75.75h16.5a.75.75 0 00.75-.75V3.824a.75.75 0 00-.552-.698 45.645 45.645 0 00-2.445-.564v-.387a.75.75 0 00-.629-.74A48.24 48.24 0 0010 1zm6.75 3.484c.376.023.75.05 1.124.08C18.41 4.615 19 5.37 19 6.244V16.5a3.5 3.5 0 01-3.5 3.5h-11a3.5 3.5 0 01-3.5-3.5V6.244c0-.874.59-1.63 1.126-1.68.375-.03.748-.057 1.124-.08V4.57c0-.782.59-1.43 1.376-1.495a45.459 45.459 0 0110.748 0c.786.065 1.376.713 1.376 1.495v.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    id="coefficient"
                    v-model="newNote.coefficient"
                    class="pl-10 h-12 text-base focus:ring-indigo-500 focus:border-indigo-500 focus:border-2 block w-full border-gray-300 border-2 rounded-md transition-all duration-200 shadow-sm hover:border-indigo-300"
                    placeholder="Coefficient de la note"
                  />
                </div>
              </div>

              <!-- Inclure dans la moyenne -->
              <div class="flex items-center mb-5">
                <input
                  type="checkbox"
                  id="include_in_average"
                  v-model="newNote.include_in_average"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="include_in_average" class="ml-2 block text-sm text-gray-900">
                  Inclure dans la moyenne
                </label>
              </div>
            </div>

            <!-- Boutons d'action améliorés -->
            <div class="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 sm:ml-3 sm:w-auto sm:text-sm"
                :disabled="isLoading"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="editingNote">Mettre à jour</span>
                <span v-else>Ajouter</span>
              </button>
              
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="showAddModal = false"
                :disabled="isLoading"
              >
                <svg class="-ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>

  <!-- Toast de notification -->
  <div v-if="toast.show" 
       class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100"
       :class="{
         'bg-green-500': toast.type === 'success',
         'bg-red-500': toast.type === 'error',
         'bg-yellow-500': toast.type === 'warning',
         'bg-blue-500': toast.type === 'info'
       }">
    <div class="flex items-center">
      <span class="text-white font-medium">{{ toast.message }}</span>
      <button @click="toast.show = false" class="ml-4 text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>

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
                Supprimer la note
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer cette note ? Cette
                  action est irréversible.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="mark in marks" :key="mark.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ mark.course_name || mark.course }}</div>
                  <div v-if="mark.is_manual" class="text-xs text-blue-500 font-medium">Note manuelle</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ mark.description || mark.test_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="getScoreClass(mark.note || mark.score, mark.max_note || mark.max_score)">
                    {{ mark.note || mark.score }} / {{ mark.max_note || mark.max_score }}
                  </span>
                  <div v-if="mark.coefficient && mark.coefficient != 1" class="text-xs text-gray-500 mt-1">
                    Coef. {{ mark.coefficient }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(mark.date_note || mark.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div v-if="mark.is_manual" class="flex justify-end space-x-2">
                    <button @click="editNote(mark)" class="text-indigo-600 hover:text-indigo-900" title="Modifier">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button @click="deleteManualNote(mark.id)" class="text-red-600 hover:text-red-900" title="Supprimer">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="confirmDeleteNote" :disabled="isLoading"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
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
import { ref, onMounted, computed } from 'vue';
import markService from '../services/mark.service';
import notificationService from '../services/notification.service';
import axios from 'axios';

const isLoading = ref(false);
const loading = ref(false);
const marks = ref([]);
const error = ref(null);
const needsSetup = ref(false);
const isCached = ref(false);
const showAddModal = ref(false);
const editingNote = ref(null);
const showDeleteModal = ref(false);
const noteToDeleteId = ref(null);

const newNote = ref({
  course_name: '',
  description: '',
  date_note: new Date().toISOString().split('T')[0],
  note: null,
  max_note: 6,
  coefficient: 1,
  include_in_average: true
});

// Notification Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success' // success, error, warning, info
});

// Fonction pour afficher un toast de notification
const showToast = (message, type = 'success') => {
  toast.value.message = message;
  toast.value.type = type;
  toast.value.show = true;
  
  // Cacher le toast après 3 secondes
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Fonction pour réinitialiser le formulaire avec des valeurs par défaut
const resetForm = () => {
  newNote.value = {
    course_name: '',
    description: '',
    date_note: new Date().toISOString().split('T')[0],
    note: null,
    max_note: 6,
    coefficient: 1,
    include_in_average: true
  };
  editingNote.value = null;
};

// Créer une nouvelle fonction pour ouvrir la modale d'ajout
const openAddModal = () => {
  resetForm(); // Réinitialiser complètement le formulaire
  showAddModal.value = true;
};

// Fonction pour ouvrir le modal d'édition avec les données de la note sélectionnée
const editNote = (note) => {
  if (!note || !note.id) {
    console.error('Erreur: Tentative de modification d\'une note non valide');
    return;
  }

  try {
    // Stocker l'ID de la note en cours d'édition
    editingNote.value = note.id;
    
    // Formater la date correctement pour l'input type="date"
    const formattedDate = note.date_note ? 
      new Date(note.date_note).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0];
    
    // Copier les valeurs de la note dans le formulaire
    newNote.value = {
      course_name: note.course_name || '',
      description: note.description || '',
      date_note: formattedDate, // Utiliser la date formatée
      note: note.note || null,
      max_note: 6,
      coefficient: note.coefficient || 1,
      include_in_average: note.include_in_average !== undefined ? note.include_in_average : true
    };
    
    // Afficher le modal d'édition
    showAddModal.value = true;
  } catch (error) {
    console.error('Erreur lors de l\'édition de la note:', error);
    notificationService.error('Une erreur est survenue lors de l\'édition de la note');
  }
};

// Fonction pour sauvegarder une note (ajout ou modification)
const saveNote = async () => {
  error.value = null;
  
  // Validation des données du formulaire
  if (!newNote.value.course_name) {
    error.value = "Le nom du cours est requis";
    return;
  }
  
  if (newNote.value.note === null || newNote.value.note === '') {
    error.value = "La note est requise";
    return;
  }
  
  if (isNaN(parseFloat(newNote.value.note)) || parseFloat(newNote.value.note) < 0) {
    error.value = "La note doit être un nombre positif";
    return;
  }
  
  if (parseFloat(newNote.value.note) > 6) {
    error.value = "La note ne peut pas dépasser 6";
    return;
  }
  
  // Vérifier que la note est un multiple de 0.5
  const noteValue = parseFloat(newNote.value.note);
  if (Math.round(noteValue * 2) / 2 !== noteValue) {
    error.value = "La note doit être un multiple de 0.5";
    return;
  }
  
  // Toujours fixer la note maximale à 6
  newNote.value.max_note = 6;
  
  if (parseFloat(newNote.value.note) > parseFloat(newNote.value.max_note)) {
    error.value = "La note ne peut pas être supérieure à la note maximale";
    return;
  }
  
  try {
    isLoading.value = true;
    
    // Préparation des données pour l'API
    const noteData = {
      course_name: newNote.value.course_name,
      description: newNote.value.description,
      date_note: newNote.value.date_note,
      note: parseFloat(newNote.value.note),
      max_note: 6, // Toujours envoyer 6 comme note maximale
      coefficient: parseFloat(newNote.value.coefficient),
      include_in_average: newNote.value.include_in_average
    };
    
    let response;
    
    // S'assurer que le token est à jour dans les headers
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Si on est en mode édition
    if (editingNote.value) {
      response = await axios.put(`/v1/manual/${editingNote.value}`, noteData, { headers });
      notificationService.success('Note modifiée avec succès!');
    } 
    // Sinon, on ajoute une nouvelle note
    else {
      response = await axios.post('/v1/manual', noteData, { headers });
      notificationService.success('Note ajoutée avec succès!');
    }
    
    // Fermer le modal et rafraîchir les données
    showAddModal.value = false;
    resetForm();
    await loadAllNotes();
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err);
    error.value = err.response?.data?.message || "Une erreur est survenue lors de la sauvegarde";
    notificationService.error(error.value);
  } finally {
    isLoading.value = false;
  }
};

// Ajouter la fonction handleError manquante
const handleError = (error) => {
  console.error(error);
  error.value = error?.response?.data?.message || "Une erreur est survenue lors de la récupération des notes";
};

// Charger à la fois les notes GAPS et manuelles
const loadAllNotes = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const [gapsResponse, manualResponse] = await Promise.all([
      markService.getMarks(),
      markService.getManualNotes()
    ]);
    
    console.log('Réponse GAPS:', gapsResponse);
    console.log('Réponse notes manuelles:', manualResponse);
    
    // Extraction des données GAPS
    let gapsNotes = [];
    if (gapsResponse && gapsResponse.success) {
      // Déterminer où se trouvent les données
      if (Array.isArray(gapsResponse.data)) {
        gapsNotes = gapsResponse.data;
      } else if (gapsResponse.data && gapsResponse.data.data && Array.isArray(gapsResponse.data.data)) {
        gapsNotes = gapsResponse.data.data;
      } else if (gapsResponse.data && typeof gapsResponse.data === 'object') {
        // Tenter de convertir en tableau si c'est un objet
        gapsNotes = Object.values(gapsResponse.data);
      }
    }
    
    // Extraction des données notes manuelles
    let manualNotes = [];
    if (manualResponse && manualResponse.success) {
      // Déterminer où se trouvent les données
      if (Array.isArray(manualResponse.data)) {
        manualNotes = manualResponse.data;
      } else if (manualResponse.data && manualResponse.data.data && Array.isArray(manualResponse.data.data)) {
        manualNotes = manualResponse.data.data;
      } else if (manualResponse.data && typeof manualResponse.data === 'object') {
        // Tenter de convertir en tableau si c'est un objet
        manualNotes = Object.values(manualResponse.data);
      }
    }
    
    // Normaliser et ajouter la propriété is_manual
    const normalizedGapsNotes = gapsNotes.map(note => ({
      ...note,
      is_manual: false
    }));
    
    const normalizedManualNotes = manualNotes.map(note => ({
      ...note,
      is_manual: true
    }));
    
    // Combiner les notes
    marks.value = [
      ...normalizedGapsNotes,
      ...normalizedManualNotes
    ].sort((a, b) => new Date(b.date || b.date_note) - new Date(a.date || a.date_note));
    
    // Si nous avons récupéré les notes depuis le cache
    isCached.value = gapsResponse.cached === true;
    
    // Exécuter le débogage pour comprendre les valeurs
    debugCourseAverages();
    
  } catch (e) {
    console.error('Erreur complète dans loadAllNotes:', e);
    handleError(e);
  } finally {
    loading.value = false;
  }
};

// Renommer loadMarks en loadAllNotes dans le template ou ajouter cette fonction
const loadMarks = () => {
  loadAllNotes();
};

// Ajouter une note manuelle
const addNote = async () => {
  saveNote();
};

// Ajouter la fonction de suppression
const deleteManualNote = async (noteId) => {
  noteToDeleteId.value = noteId;
  showDeleteModal.value = true;
};

// Fermer la modale de suppression
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  noteToDeleteId.value = null;
};

// Confirmer la suppression
const confirmDeleteNote = async () => {
  if (!noteToDeleteId.value) return;
  
  try {
    isLoading.value = true;
    await markService.deleteManualMark(noteToDeleteId.value);
    notificationService.success('Note supprimée avec succès!');
    await loadAllNotes();
    closeDeleteModal();
  } catch (e) {
    error.value = "Erreur lors de la suppression de la note";
    console.error(e);
    notificationService.error("Erreur lors de la suppression de la note");
  } finally {
    isLoading.value = false;
  }
};

// Charger les notes au montage du composant
onMounted(() => {
  document.title = "Mes notes - TaskForce";
  loadAllNotes();
});

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Obtenir la classe de couleur en fonction de la note
const getScoreClass = (score, maxScore) => {
  if (!score || !maxScore) return 'bg-gray-100 text-gray-800';
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) {
    return 'bg-green-100 text-green-800';
  } else if (percentage >= 60) {
    return 'bg-blue-100 text-blue-800';
  } else if (percentage >= 40) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-red-100 text-red-800';
  }
};

// Propriété calculée pour regrouper les notes par cours
const groupedByCourse = computed(() => {
  const grouped = {};
  
  marks.value.forEach(mark => {
    const courseName = mark.course_name || mark.course || 'Autre';
    
    if (!grouped[courseName]) {
      grouped[courseName] = [];
    }
    
    grouped[courseName].push(mark);
  });
  
  // Trier les notes de chaque cours par date décroissante
  Object.keys(grouped).forEach(course => {
    grouped[course].sort((a, b) => 
      new Date(b.date_note || b.date) - new Date(a.date_note || a.date)
    );
  });
  
  return grouped;
});

// Propriété calculée pour le nombre total de notes
const totalMarksCount = computed(() => marks.value.length);

// Propriété calculée pour les moyennes par cours
const courseAverages = computed(() => {
  const averages = {};
  
  Object.entries(groupedByCourse.value).forEach(([courseName, courseMarks]) => {
    let weightedSum = 0;
    let totalCoefficient = 0;
    
    courseMarks.forEach(mark => {
      // Ne calculer la moyenne que si la note doit être incluse (par défaut oui)
      if (mark.include_in_average !== false) {
        // Récupérer la note directement, déjà sur échelle de 0-6
        const note = parseFloat(mark.note || mark.score || 0);
        const coef = parseFloat(mark.coefficient || 1);
        
        // Pas besoin de normaliser, car les notes sont déjà sur 6
        weightedSum += note * coef;
        totalCoefficient += coef;
      }
    });
    
    averages[courseName] = totalCoefficient > 0 ? weightedSum / totalCoefficient : 0;
  });
  
  return averages;
});

// Ajouter une fonction de débogage pour afficher les valeurs dans la console
// et comprendre ce qui se passe avec les notes
const debugCourseAverages = () => {
  marks.value.forEach(mark => {
    console.log(`Note: ${mark.note || mark.score}, Max: ${mark.max_note || mark.max_score}, Coefficient: ${mark.coefficient || 1}`);
  });
  
  Object.entries(groupedByCourse.value).forEach(([courseName, courseMarks]) => {
    console.log(`Cours: ${courseName}`);
    
    let sum = 0;
    courseMarks.forEach(mark => {
      const note = parseFloat(mark.note || mark.score || 0);
      console.log(`- Note: ${note}`);
      sum += note;
    });
    
    console.log(`Somme: ${sum}, Nombre: ${courseMarks.length}, Moyenne simple: ${sum/courseMarks.length}`);
  });
};

// Propriété calculée pour la moyenne générale (sur tous les cours)
const globalAverage = computed(() => {
  const averages = Object.values(courseAverages.value);
  if (averages.length === 0) return 0;
  
  return averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
});

// Méthode pour formater la moyenne avec 2 décimales
const formatAverage = (average) => {
  if (average === undefined || average === null) return '-';
  return average.toFixed(2) + '/6';
};

// Méthode pour déterminer la classe CSS de la moyenne
const getAverageClass = (average) => {
  if (average === undefined || average === null) return 'bg-gray-100 text-gray-800';
  
  if (average >= 5) {         // Équivalent à 16/20 ou plus
    return 'bg-green-100 text-green-800';
  } else if (average >= 4) {  // Équivalent à 12/20 ou plus
    return 'bg-blue-100 text-blue-800';
  } else if (average >= 2.5) { // Équivalent à 8/20 ou plus
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-red-100 text-red-800';
  }
};
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 9rem);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Style pour améliorer l'apparence des champs date sur tous les navigateurs */
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
  opacity: 0.6;
  transition: opacity 0.2s;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
<template>
  <div class="flex-1 bg-gray-50">
    <!-- Bannière avec dégradé -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-white mb-2">À propos de notre projet</h1>
        <p class="text-indigo-100 text-xl max-w-3xl mx-auto italic mt-4">
          "Innovation, collaboration et passion au cœur de notre application Laravel."
        </p>
      </div>
    </div>
    
    <!-- Section Mission et Vision -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Notre Mission</h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          Notre projet Laravel, combiné à Tailwind CSS, a pour objectif de fournir une interface moderne, intuitive et performante pour tous vos besoins web.
          Nous mettons l'accent sur l'innovation et la qualité pour transformer vos idées en réalité.
        </p>
        <h2 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Notre Vision</h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          En anticipant les évolutions technologiques, nous développons une application agile, sécurisée et évolutive,
          afin de vous accompagner dans tous vos défis numériques. Ensemble, faisons de l'innovation une réalité.
        </p>
      </div>
    </div>
    
    <!-- Section Équipe avec emplacements pour photos -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">Rencontrez Notre Équipe</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Carte Membre 1 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img class="w-full h-48 object-cover" src="" alt="Photo de membre">
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">Nom Prénom</h3>
            <p class="text-gray-600">Fonction</p>
          </div>
        </div>
        <!-- Carte Membre 2 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img class="w-full h-48 object-cover" src="" alt="Photo de membre">
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">Nom Prénom</h3>
            <p class="text-gray-600">Fonction</p>
          </div>
        </div>
        <!-- Carte Membre 3 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img class="w-full h-48 object-cover" src="" alt="Photo de membre">
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">Nom Prénom</h3>
            <p class="text-gray-600">Fonction</p>
          </div>
        </div>
        <!-- Carte Membre 4 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img class="w-full h-48 object-cover" src="" alt="Photo de membre">
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">Nom Prénom</h3>
            <p class="text-gray-600">Fonction</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section Historique / Timeline -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">Notre Histoire</h2>
        <div class="relative">
          <!-- Ligne verticale -->
          <div class="border-l-2 border-indigo-600 pl-8">
            <!-- Événement 1 -->
            <div class="mb-8">
              <h3 class="text-xl font-bold text-gray-800">Lancement du projet</h3>
              <span class="text-sm text-gray-500">Janvier 2020</span>
              <p class="text-gray-700 mt-2">La première version de notre application voit le jour, marquant le début d'une aventure passionnante.</p>
            </div>
            <!-- Événement 2 -->
            <div class="mb-8">
              <h3 class="text-xl font-bold text-gray-800">Première mise à jour majeure</h3>
              <span class="text-sm text-gray-500">Août 2020</span>
              <p class="text-gray-700 mt-2">Nous avons amélioré l'expérience utilisateur en ajoutant de nouvelles fonctionnalités innovantes.</p>
            </div>
            <!-- Événement 3 -->
            <div class="mb-8">
              <h3 class="text-xl font-bold text-gray-800">Expansion internationale</h3>
              <span class="text-sm text-gray-500">Mars 2021</span>
              <p class="text-gray-700 mt-2">Notre application se déploie sur de nouveaux marchés, renforçant notre position dans le domaine numérique.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section Témoignages -->
    <div class="bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">Témoignages</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Témoignage 1 -->
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-700 italic">"Grâce à cette application, notre productivité a augmenté de manière significative !"</p>
            <h4 class="mt-4 text-gray-800 font-bold">Client Satisfait</h4>
          </div>
          <!-- Témoignage 2 -->
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-700 italic">"L'interface est tellement intuitive que même mes parents l'ont adoptée en un clin d'œil."</p>
            <h4 class="mt-4 text-gray-800 font-bold">Utilisateur Heureux</h4>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section Partenaires -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">Nos Partenaires</h2>
      <div class="flex flex-wrap justify-center items-center gap-8">
        <!-- Logo Partenaire 1 -->
        <img class="h-16" src="" alt="Logo partenaire">
        <!-- Logo Partenaire 2 -->
        <img class="h-16" src="" alt="Logo partenaire">
        <!-- Logo Partenaire 3 -->
        <img class="h-16" src="" alt="Logo partenaire">
        <!-- Logo Partenaire 4 -->
        <img class="h-16" src="" alt="Logo partenaire">
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = "À propos - Taskforce";
});
</script>
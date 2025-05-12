<template>
  <div class="flex-1 bg-gray-50">
    <!-- Bannière avec dégradé -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-white mb-2">Mentions légales</h1>
        <p class="text-indigo-100 text-xl max-w-3xl mx-auto italic mt-4">
          "Informations juridiques et engagement de confidentialité."
        </p>
      </div>
    </div>
    
    <!-- Section Éditeur du site -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Éditeur du site</h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          Taskforce<br>
          123 Rue de l'Innovation<br>
          1200 Genève, Suisse<br>
          Email : contact@taskforce.com<br>
          Téléphone : +41 22 123 45 67
        </p>
      </div>
    </div>
    
    <!-- Section Hébergement -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Hébergement</h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          Le site est hébergé par Exemple Hébergement SA, société anonyme au capital de 100 000 CHF,
          dont le siège social est situé 1 rue de l'Exemple, 1200 Genève, Suisse.
        </p>
      </div>
    </div>
    
    <!-- Section Propriété intellectuelle -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Propriété intellectuelle</h2>
          <p class="text-gray-700 text-lg leading-relaxed">
            Tous les contenus présents sur le site Taskforce sont protégés par le droit d'auteur selon la législation suisse.
            Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Section Protection des données personnelles -->
    <div class="bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Protection des données personnelles</h2>
          <p class="text-gray-700 text-lg leading-relaxed">
            Conformément à la Loi fédérale sur la protection des données (LPD), vous disposez d'un droit d'accès,
            de rectification, de suppression et d'opposition aux données vous concernant.
            Pour exercer ce droit, veuillez nous contacter à l'adresse : contact@taskforce.com.
          </p>
          <p class="text-gray-700 text-lg leading-relaxed mt-4">
            Taskforce s'engage à ne collecter que les données strictement nécessaires au fonctionnement de l'application
            et à ne jamais les partager avec des tiers non autorisés. Aucun cookie de suivi ou de publicité n'est utilisé
            sur notre plateforme, démontrant notre engagement envers la protection de votre vie privée.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Section Confidentialité renforcée -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Engagement de confidentialité</h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          En tant qu'entreprise suisse, nous adhérons aux standards stricts de protection des données en vigueur dans le pays.
          Notre application est conçue selon les principes de "privacy by design", garantissant une protection optimale de vos informations
          dès la conception et par défaut.
        </p>
      </div>
    </div>
    
    <!-- Section Accès au site -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Accès au site</h2>
          <p class="text-gray-700 text-lg leading-relaxed">
            L'éditeur s'efforce de permettre l'accès au site 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure
            ou d'un événement hors du contrôle de l'éditeur, et sous réserve des éventuelles pannes et interventions de
            maintenance nécessaires au bon fonctionnement du site et des services.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Section Loi applicable -->
    <div class="bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Loi applicable</h2>
          <p class="text-gray-700 text-lg leading-relaxed">
            Les présentes mentions légales sont régies par la loi suisse. En cas de litige, les tribunaux suisses seront compétents.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = "Mentions légales - Taskforce";
});
</script>
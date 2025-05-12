<template>
  <div class="flex-1 bg-gray-50">
    <!-- Bannière avec dégradé -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-white mb-2">Contactez-nous</h1>
        <p class="text-indigo-100 text-xl max-w-3xl mx-auto italic mt-4">
          "Nous sommes à votre écoute pour répondre à toutes vos questions."
        </p>
      </div>
    </div>
    
    <!-- Formulaire de contact -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <div v-if="formSubmitted" class="mb-6">
          <div :class="[
            formSuccess ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700',
            'px-4 py-3 rounded relative'
          ]">
            {{ formMessage }}
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-4">Envoyez-nous un message</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Nom -->
          <div>
            <label for="name" class="block text-gray-600 font-medium">Nom</label>
            <input type="text" v-model="form.name" id="name"
                 class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600" 
                 placeholder="Votre nom">
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name[0] }}</p>
          </div>
          
          <!-- Email -->
          <div>
            <label for="email" class="block text-gray-600 font-medium">Email</label>
            <input type="email" v-model="form.email" id="email"
                 class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600" 
                 placeholder="Votre email">
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email[0] }}</p>
          </div>
          
          <!-- Sujet -->
          <div>
            <label for="subject" class="block text-gray-600 font-medium">Sujet</label>
            <input type="text" v-model="form.subject" id="subject"
                 class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600" 
                 placeholder="Objet de votre message">
            <p v-if="errors.subject" class="mt-2 text-sm text-red-600">{{ errors.subject[0] }}</p>
          </div>
          
          <!-- Message -->
          <div>
            <label for="message" class="block text-gray-600 font-medium">Message</label>
            <textarea v-model="form.message" id="message" rows="5" 
                    class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600" 
                    placeholder="Votre message"></textarea>
            <p v-if="errors.message" class="mt-2 text-sm text-red-600">{{ errors.message[0] }}</p>
          </div>
          
          <!-- Bouton d'envoi -->
          <div class="mt-4">
            <button type="submit" 
                  :disabled="submitting"
                  class="w-full bg-indigo-600 text-white rounded-md px-6 py-3 hover:bg-indigo-700 transition-all">
              <span v-if="submitting">Envoi en cours...</span>
              <span v-else>Envoyer le message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitting = ref(false);
const formSubmitted = ref(false);
const formSuccess = ref(false);
const formMessage = ref('');
const errors = ref({});

const submitForm = async () => {
  submitting.value = true;
  errors.value = {};
  
  try {
    await axios.post('/api/contact', form);
    formSuccess.value = true;
    formMessage.value = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
    formSubmitted.value = true;
    
    // Réinitialiser le formulaire
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
  } catch (error) {
    formSuccess.value = false;
    
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {};
      formMessage.value = 'Veuillez corriger les erreurs dans le formulaire.';
    } else {
      formMessage.value = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.';
    }
    
    formSubmitted.value = true;
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  document.title = 'Contact - Vue - TaskForce';
});
</script> 
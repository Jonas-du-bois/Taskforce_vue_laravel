import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import ContactView from '../views/ContactView.vue';
import TasksView from '../views/TasksView.vue';
import TasksBoardView from '../views/TasksBoardView.vue';
import TaskDetailView from '../views/TaskDetailView.vue';
import TaskCreateView from '../views/TaskCreateView.vue';
import AboutView from '../views/AboutView.vue';
import MentionsLegalesView from '../views/MentionsLegalesView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import AgendaView from '../views/AgendaView.vue';
import MarksView from '../views/MarksView.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        public: true 
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { 
        guest: true 
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { 
        guest: true 
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: {
        public: true 
      }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '/tasks/board',
      name: 'tasks-board',
      component: TasksBoardView,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '/agenda',
      name: 'agenda',
      component : AgendaView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/marks',
      name: 'marks',
      component : MarksView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/create',
      name: 'task-create',
      component: TaskCreateView,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: TaskDetailView,
      meta: { 
        requiresAuth: true 
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        public: true 
      }
    },
    {
      path: '/mentions-legales',
      name: 'mentions-legales',
      component: MentionsLegalesView,
      meta: {
        public: true 
      }
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Utiliser le store Pinia pour l'authentification
  const authStore = useAuthStore();
  
  // Pour les routes protégées, vérifier l'authentification de manière asynchrone
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifier l'authentification de manière asynchrone
    const isAuthenticated = await authStore.checkAuth();
    
    if (!isAuthenticated) {
      // Rediriger vers login avec la route cible en query parameter
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // Si l'accès est autorisé, continuer
      next();
    }
  } 
  // Routes pour les invités uniquement (login, register)
  else if (to.matched.some(record => record.meta.guest)) {
    // Pour les routes guest, vérifier également de manière asynchrone
    const isAuthenticated = await authStore.checkAuth();
    
    if (isAuthenticated) {
      // Si l'utilisateur est connecté, le rediriger vers la page d'accueil
      next({ name: 'tasks' });
    } else {
      // Si l'utilisateur n'est pas connecté, laisser accéder à la page
      next();
    }
  } 
  // Routes publiques
  else {
    next();
  }
});

export default router; 
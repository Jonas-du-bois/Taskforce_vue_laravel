<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier s'il y a des utilisateurs pour assigner les tâches
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('Aucun utilisateur trouvé. Création d\'un utilisateur test...');
            
            // Créer un utilisateur test si nécessaire
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
            
            $users = collect([$user]);
        }
        
        // Tâches réalistes pour un environnement professionnel
        $tasks = [
            // Projet de développement web
            [
                'title' => 'Mise en place de l\'environnement de développement',
                'description' => 'Installer et configurer les outils nécessaires (IDE, serveur local, bases de données, etc.) pour le nouveau projet.',
                'status' => 'terminée',
                'priority' => 'haute',
                'due_date' => Carbon::now()->subDays(5),
                'estimated_minutes' => 180
            ],
            [
                'title' => 'Conception de la base de données',
                'description' => 'Créer le schéma de la base de données pour le projet e-commerce incluant les tables produits, utilisateurs, commandes et paiements.',
                'status' => 'terminée',
                'priority' => 'haute',
                'due_date' => Carbon::now()->subDays(3),
                'estimated_minutes' => 240
            ],
            [
                'title' => 'Développement de l\'API REST',
                'description' => 'Créer les endpoints pour les fonctionnalités principales : authentification, produits, panier et commandes.',
                'status' => 'en cours',
                'priority' => 'haute',
                'due_date' => Carbon::now()->addDays(2),
                'estimated_minutes' => 480
            ],
            [
                'title' => 'Intégration du design frontend',
                'description' => 'Convertir les maquettes Figma en composants Vue.js fonctionnels et responsive.',
                'status' => 'à faire',
                'priority' => 'moyenne',
                'due_date' => Carbon::now()->addDays(5),
                'estimated_minutes' => 360
            ],
            [
                'title' => 'Tests unitaires du backend',
                'description' => 'Écrire des tests PHPUnit pour les contrôleurs et services développés.',
                'status' => 'à faire',
                'priority' => 'moyenne',
                'due_date' => Carbon::now()->addDays(7),
                'estimated_minutes' => 300
            ],
            
            // Projet marketing
            [
                'title' => 'Analyse de la concurrence',
                'description' => 'Identifier et analyser les principales forces et faiblesses des concurrents directs sur le marché.',
                'status' => 'terminée',
                'priority' => 'moyenne',
                'due_date' => Carbon::now()->subDays(7),
                'estimated_minutes' => 240
            ],
            [
                'title' => 'Conception de la stratégie des médias sociaux',
                'description' => 'Élaborer un calendrier de contenu pour les réseaux sociaux pour le prochain trimestre.',
                'status' => 'en cours',
                'priority' => 'moyenne',
                'due_date' => Carbon::now()->addDay(),
                'estimated_minutes' => 180
            ],
            [
                'title' => 'Préparation de la newsletter mensuelle',
                'description' => 'Rédiger et concevoir la newsletter du mois prochain incluant les dernières actualités et offres promotionnelles.',
                'status' => 'à faire',
                'priority' => 'basse',
                'due_date' => Carbon::now()->addDays(10),
                'estimated_minutes' => 120
            ],
            
            // Tâches administratives
            [
                'title' => 'Mise à jour de la documentation du projet',
                'description' => 'Actualiser la documentation technique et le guide utilisateur suite aux dernières fonctionnalités ajoutées.',
                'status' => 'à faire',
                'priority' => 'basse',
                'due_date' => Carbon::now()->addDays(14),
                'estimated_minutes' => 240
            ],
            [
                'title' => 'Rapport mensuel d\'activité',
                'description' => 'Préparer le rapport d\'activité mensuel pour la direction incluant les KPIs et statistiques pertinentes.',
                'status' => 'à faire',
                'priority' => 'moyenne',
                'due_date' => Carbon::now()->addDays(3),
                'estimated_minutes' => 150
            ],
            
            // Maintenances
            [
                'title' => 'Optimisation des performances du site',
                'description' => 'Analyser et améliorer les performances du site web (temps de chargement, SEO, accessibilité).',
                'status' => 'à faire',
                'priority' => 'haute',
                'due_date' => Carbon::now()->addDays(6),
                'estimated_minutes' => 300
            ],
            [
                'title' => 'Mise à jour des dépendances',
                'description' => 'Mettre à jour les packages npm et composer vers les dernières versions stables en tenant compte des problèmes de compatibilité.',
                'status' => 'en cours',
                'priority' => 'basse',
                'due_date' => Carbon::now()->addDays(2),
                'estimated_minutes' => 90
            ],
            
            // Tâches du jour
            [
                'title' => 'Réunion d\'équipe hebdomadaire',
                'description' => 'Participer à la réunion d\'équipe pour faire le point sur l\'avancement des projets et planifier la semaine.',
                'status' => 'à faire',
                'priority' => 'moyenne',
                'due_date' => Carbon::now(),
                'estimated_minutes' => 60
            ],
            [
                'title' => 'Correction de bugs urgents',
                'description' => 'Résoudre les bugs critiques signalés par les utilisateurs sur la plateforme de production.',
                'status' => 'à faire',
                'priority' => 'haute',
                'due_date' => Carbon::now(),
                'estimated_minutes' => 180
            ],
            [
                'title' => 'Préparation de la démo client',
                'description' => 'Préparer une démonstration des nouvelles fonctionnalités pour la réunion client de demain.',
                'status' => 'à faire',
                'priority' => 'haute',
                'due_date' => Carbon::now()->addDay(),
                'estimated_minutes' => 120
            ],
        ];

        // Ajouter des tâches en retard
        $lateTasks = [
            [
                'title' => 'Migration vers le nouveau serveur',
                'description' => 'Planifier et exécuter la migration de l\'application vers le nouveau serveur cloud.',
                'status' => 'à faire',
                'priority' => 'haute',
                'due_date' => Carbon::now()->subDays(2),
                'estimated_minutes' => 360
            ],
            [
                'title' => 'Revue de code du sprint précédent',
                'description' => 'Effectuer une revue de code complète des fonctionnalités développées lors du dernier sprint.',
                'status' => 'à faire',
                'priority' => 'moyenne',
                'due_date' => Carbon::now()->subDays(1),
                'estimated_minutes' => 240
            ],
        ];

        $allTasks = array_merge($tasks, $lateTasks);
        
        // Répartir les tâches entre les utilisateurs
        foreach ($allTasks as $taskData) {
            $user = $users->random();
            
            Task::create([
                'user_id' => $user->id,
                'title' => $taskData['title'],
                'description' => $taskData['description'],
                'status' => $taskData['status'],
                'priority' => $taskData['priority'],
                'due_date' => $taskData['due_date'],
                'estimated_minutes' => $taskData['estimated_minutes'],
            ]);
        }
        
        $this->command->info('Tâches de test créées avec succès!');
    }
} 
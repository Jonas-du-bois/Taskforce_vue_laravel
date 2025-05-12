<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\ScheduleController;
use App\Http\Controllers\API\MarkController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\ContactController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes API organisées et optimisées pour l'application TaskForce
|
*/

// Routes publiques (sans authentification)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/contact', [ContactController::class, 'send']);
Route::get('/classes', [ProfileController::class, 'getAvailableClasses']);

// API v1 - Routes sans middleware d'authentification mais avec vérification manuelle du token
Route::prefix('v1')->group(function () {
    // Routes d'authentification
    Route::prefix('auth')->group(function () {
        // Vérifier l'authentification
        Route::get('/check', function(Request $request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return [
                    'authenticated' => false,
                    'message' => 'Aucun token trouvé'
                ];
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return [
                    'authenticated' => false,
                    'message' => 'Token invalide'
                ];
            }
            
            return [
                'authenticated' => true,
                'user' => $user
            ];
        });

        // Déconnexion
        Route::post('/logout', function(Request $request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Token non fourni'], 400);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if ($user) {
                $user->api_token = null;
                $user->save();
                return response()->json(['message' => 'Déconnexion réussie']);
            }
            
            return response()->json(['message' => 'Token invalide ou utilisateur non trouvé'], 404);
        });
    });

    // Profil utilisateur
    Route::get('/profile', function(Request $request) {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 401);
        }
        
        return response()->json($user);
    });

    // Mise à jour du profil utilisateur
    Route::put('/profile', function(Request $request) {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'class' => 'nullable|string|max:100',
            'gaps_login' => 'nullable|string|max:100',
            'gaps_password' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        
        if ($request->has('class')) {
            $user->class = $request->class;
        }
        
        // Mise à jour des identifiants GAPS
        if ($request->has('gaps_login')) {
            $user->gaps_login = $request->gaps_login;
        }
        
        if ($request->has('gaps_password') && $request->gaps_password !== '••••••••') {
            $user->gaps_password = $request->gaps_password;
        }
        
        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    });

    // Mise à jour du mot de passe
    Route::put('/user/password', function(Request $request) {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 401);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }
        
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Mot de passe modifié avec succès'
        ]);
    });

    // Génération d'un nouveau token API
    Route::post('/user/token', function(Request $request) {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 401);
        }

        $newToken = md5(uniqid($user->id . time(), true));
        $user->api_token = $newToken;
        $user->save();

        return response()->json([
            'message' => 'Token API généré avec succès',
            'user' => $user
        ]);
    });

    // Routes pour les tâches
    Route::prefix('tasks')->group(function () {
        // Lister les tâches
        Route::get('/', function(Request $request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }
            
            $tasks = $user->tasks()->orderBy('created_at', 'desc')->get();
            return response()->json($tasks);
        });

        // Obtenir les détails d'une tâche
        Route::get('/{id}', function(Request $request, $id) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }
            
            $task = Task::where('id', $id)
                        ->where('user_id', $user->id)
                        ->first();

            if (!$task) {
                return response()->json(['message' => 'Tâche non trouvée'], 404);
            }

            return response()->json($task);
        });

        // Créer une tâche
        Route::post('/', function(Request $request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                Log::error('API Tasks: Création tâche - Token manquant');
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                Log::error('API Tasks: Création tâche - Token invalide', ['token_partial' => substr($token, 0, 10) . '...']);
                return response()->json(['message' => 'Token invalide'], 401);
            }
            
            Log::info('API Tasks: Tentative création tâche', [
                'user_id' => $user->id,
                'username' => $user->username,
                'données_reçues' => $request->all()
            ]);
            
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'due_date' => 'nullable|date',
                'priority' => 'required|string|in:basse,moyenne,haute',
                'status' => 'required|string|in:à faire,en cours,terminée',
                'estimated_minutes' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                Log::warning('API Tasks: Validation échouée', [
                    'user_id' => $user->id,
                    'erreurs' => $validator->errors()->toArray()
                ]);
                return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
            }

            try {
                $task = new Task();
                $task->title = $request->title;
                $task->description = $request->description;
                $task->due_date = $request->due_date;
                $task->priority = $request->priority;
                $task->status = $request->status;
                $task->user_id = $user->id;
                
                // Traitement du temps estimé
                if ($request->has('estimated_minutes')) {
                    $task->estimated_minutes = (int)$request->estimated_minutes;
                    Log::info('API Tasks: Temps estimé défini', [
                        'estimated_minutes' => $task->estimated_minutes
                    ]);
                }
                
                $task->save();
                
                Log::info('API Tasks: Tâche créée avec succès', [
                    'task_id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority
                ]);

                return response()->json($task, 201);
            } catch (\Exception $e) {
                Log::error('API Tasks: Erreur lors de la création', [
                    'user_id' => $user->id,
                    'erreur' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json(['message' => 'Erreur lors de la création de la tâche', 'error' => $e->getMessage()], 500);
            }
        });

        // Mettre à jour une tâche
        Route::put('/{id}', function(Request $request, $id) {
            $token = $request->bearerToken();
            
            if (!$token) {
                Log::error('API Tasks: Mise à jour tâche - Token manquant');
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                Log::error('API Tasks: Mise à jour tâche - Token invalide', ['token_partial' => substr($token, 0, 10) . '...']);
                return response()->json(['message' => 'Token invalide'], 401);
            }
            
            $task = Task::where('id', $id)
                        ->where('user_id', $user->id)
                        ->first();

            if (!$task) {
                Log::warning('API Tasks: Mise à jour - Tâche non trouvée', [
                    'task_id' => $id,
                    'user_id' => $user->id
                ]);
                return response()->json(['message' => 'Tâche non trouvée'], 404);
            }
            
            Log::info('API Tasks: Tentative mise à jour tâche', [
                'task_id' => $id,
                'user_id' => $user->id,
                'données_reçues' => $request->all()
            ]);

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'due_date' => 'nullable|date',
                'priority' => 'required|string|in:basse,moyenne,haute',
                'status' => 'required|string|in:à faire,en cours,terminée',
                'estimated_minutes' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                Log::warning('API Tasks: Validation mise à jour échouée', [
                    'task_id' => $id,
                    'user_id' => $user->id,
                    'erreurs' => $validator->errors()->toArray()
                ]);
                return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
            }

            try {
                $task->title = $request->title;
                $task->description = $request->description;
                $task->due_date = $request->due_date;
                $task->priority = $request->priority;
                $task->status = $request->status;
                
                // Traiter les minutes estimées
                if ($request->has('estimated_minutes')) {
                    $task->estimated_minutes = (int)$request->estimated_minutes;
                    Log::info('API Tasks: Mise à jour du temps estimé', [
                        'task_id' => $task->id,
                        'estimated_minutes' => $task->estimated_minutes
                    ]);
                }
                
                $task->save();
                
                Log::info('API Tasks: Tâche mise à jour avec succès', [
                    'task_id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority
                ]);

                return response()->json($task);
            } catch (\Exception $e) {
                Log::error('API Tasks: Erreur lors de la mise à jour', [
                    'task_id' => $id,
                    'user_id' => $user->id,
                    'erreur' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json(['message' => 'Erreur lors de la mise à jour de la tâche', 'error' => $e->getMessage()], 500);
            }
        });

        // Supprimer une tâche
        Route::delete('/{id}', function(Request $request, $id) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }
            
            $task = Task::where('id', $id)
                        ->where('user_id', $user->id)
                        ->first();

            if (!$task) {
                return response()->json(['message' => 'Tâche non trouvée'], 404);
            }

            $task->delete();

            return response()->json(['message' => 'Tâche supprimée avec succès']);
        });
        
        // Mise à jour du statut uniquement (patch)
        Route::patch('/{id}/status', function(Request $request, $id) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }
            
            $task = Task::where('id', $id)
                        ->where('user_id', $user->id)
                        ->first();

            if (!$task) {
                return response()->json(['message' => 'Tâche non trouvée'], 404);
            }
            
            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:à faire,en cours,terminée',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
            }
            
            $task->status = $request->status;
            $task->save();
            
            return response()->json($task);
        });
    });

    // Routes pour réccuperer les données de l'agenda
    Route::get('/schedules', [ScheduleController::class, 'getSchedules']);

    // Route pour les notes
    Route::get('/marks', function(Request $request) {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Authentification requise'], 401);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 401);
        }

        // Injecter l'utilisateur dans la requête pour que le contrôleur puisse y accéder
        $request->setUserResolver(function() use ($user) {
            return $user;
        });
        
        // Journaliser pour le débogage
        Log::info('Appel à /marks', [
            'user_id' => $user->id,
            'token_présent' => true
        ]);
        
        return app()->call([new MarkController(), 'getMarks'], ['request' => $request]);
    });

    // Routes pour les notes manuelles
    Route::prefix('manual')->group(function () {
        // GET - Récupérer les notes manuelles
        Route::get('/', function(Request $request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Injecter l'utilisateur dans la requête pour que le contrôleur puisse y accéder
            $request->setUserResolver(function() use ($user) {
                return $user;
            });
            
            // Journaliser pour le débogage
            Log::info('Appel à /manual (GET)', [
                'user_id' => $user->id,
                'token_présent' => true
            ]);
            
            return app()->call([new MarkController(), 'getManualNotes'], ['request' => $request]);
        });
        
        // POST - Ajouter une note manuelle
        Route::post('/', function(Request $request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Injecter l'utilisateur dans la requête pour que le contrôleur puisse y accéder
            $request->setUserResolver(function() use ($user) {
                return $user;
            });
            
            return app()->call([new MarkController(), 'addManualNote'], ['request' => $request]);
        });
        
        // PUT - Mettre à jour une note manuelle
        Route::put('/{id}', function(Request $request, $id) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Injecter l'utilisateur dans la requête pour que le contrôleur puisse y accéder
            $request->setUserResolver(function() use ($user) {
                return $user;
            });
            
            return app()->call([new MarkController(), 'updateManualNote'], ['request' => $request, 'id' => $id]);
        });
        
        // DELETE - Supprimer une note manuelle
        Route::delete('/{id}', function(Request $request, $id) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Authentification requise'], 401);
            }
            
            $user = User::where('api_token', $token)->first();
            
            if (!$user) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Injecter l'utilisateur dans la requête pour que le contrôleur puisse y accéder
            $request->setUserResolver(function() use ($user) {
                return $user;
            });
            
            return app()->call([new MarkController(), 'deleteManualNote'], ['request' => $request, 'id' => $id]);
        });
    });
});

/* Routes de débogage sans middleware pour tester l'API
Route::prefix('debug')->group(function () {
    Route::post('/direct-login', function(Request $request) {
        Log::info('Debug: Tentative de connexion directe', $request->except('password'));
        
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            Log::error('Debug: Échec de validation', $validator->errors()->toArray());
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        Log::info('Debug: Champ de connexion', ['field' => $loginField, 'value' => $request->login]);
        
        $credentials = [
            $loginField => $request->login,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            Log::error('Debug: Identifiants incorrects');
            return response()->json([
                'message' => 'Les identifiants fournis sont incorrects.'
            ], 401);
        }

        $user = User::where($loginField, $request->login)->firstOrFail();
        Log::info('Debug: Utilisateur trouvé', ['id' => $user->id, 'username' => $user->username]);
        
        // Générer un token d'API
        $token = md5(uniqid($user->id . time(), true));
        $user->api_token = $token;
        $user->save();
        
        Log::info('Debug: Token généré', ['token' => substr($token, 0, 10) . '...']);

        return response()->json([
            'message' => 'Connexion directe réussie',
            'token' => $token,
            'user' => $user,
        ]);
    });
});

// Pour des raisons de développement uniquement - À supprimer en production
Route::prefix('v1/auth')->group(function () {
    Route::get('/create-test-user', function() {
        $user = User::create([
            'name' => 'Test User',
            'username' => 'testuser' . rand(1000, 9999),
            'email' => 'test' . rand(1000, 9999) . '@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        
        $token = md5(uniqid($user->id . time(), true));
        $user->api_token = $token;
        $user->save();
        
        return [
            'message' => 'Utilisateur test créé',
            'user' => $user,
            'token' => $token,
            'login_with' => [
                'username' => $user->username,
                'password' => 'password'
            ]
        ];
    });
}); */
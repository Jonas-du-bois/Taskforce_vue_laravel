<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login user with email or username
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        Log::info('🔑 Tentative de connexion', $request->except('password'));
        
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            Log::error('❌ Échec de validation lors de la connexion', $validator->errors()->toArray());
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        Log::info('📝 Champ de connexion identifié', ['field' => $loginField, 'value' => $request->login]);
        
        $credentials = [
            $loginField => $request->login,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            Log::error('❌ Échec de connexion: identifiants incorrects', ['login' => $request->login]);
            return response()->json([
                'message' => 'Les identifiants fournis sont incorrects.'
            ], 401);
        }

        Log::info('✅ Authentification réussie', ['user' => $request->login]);
        $user = User::where($loginField, $request->login)->firstOrFail();
        
        // Générer un token d'API personnalisé
        $token = md5(uniqid($user->id . time(), true));
        $previousToken = $user->api_token;
        $user->api_token = $token;
        $user->save();
        
        Log::info('🔐 Token généré avec succès', [
            'user_id' => $user->id,
            'previous_token' => $previousToken ? substr($previousToken, 0, 10) . '...' : 'aucun',
            'new_token' => substr($token, 0, 10) . '...'
        ]);

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Register a new user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        Log::info('Tentative d\'inscription', $request->all());
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users|alpha_dash',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            Log::error('Échec de validation lors de l\'inscription', $validator->errors()->toArray());
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Générer un token d'API personnalisé
        $token = md5(uniqid($user->id . time(), true));
        $user->api_token = $token;
        $user->save();

        return response()->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * Logout user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->api_token = null;
            $user->save();
        }
        
        Auth::logout();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
    
    /**
     * Logout user using token from Authorization header
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logoutWithToken(Request $request)
    {
        $token = $request->bearerToken();
        Log::info('Tentative de déconnexion avec token:', ['token' => $token]);
        
        if (!$token) {
            return response()->json([
                'message' => 'Token non fourni'
            ], 400);
        }
        
        $user = User::where('api_token', $token)->first();
        
        if ($user) {
            Log::info('Utilisateur trouvé pour déconnexion:', ['user_id' => $user->id]);
            $user->api_token = null;
            $user->save();
            
            return response()->json([
                'message' => 'Déconnexion réussie'
            ]);
        }
        
        return response()->json([
            'message' => 'Token invalide ou utilisateur non trouvé'
        ], 404);
    }
} 
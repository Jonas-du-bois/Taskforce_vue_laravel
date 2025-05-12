<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ApiAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Obtenir le token depuis le header Authorization
        $token = $request->bearerToken();
        
        Log::info('⚡ API Request:', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'token' => $token ? substr($token, 0, 10) . '...' : 'absent'
        ]);
        
        // Vérifier si le token est présent
        if (!$token) {
            Log::warning('❌ Auth failed: No token provided');
            return response()->json(['message' => 'Authentification requise'], 401);
        }
        
        // Vérifier si le token est valide en cherchant l'utilisateur correspondant
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            Log::warning('❌ Auth failed: Invalid token', [
                'token_partial' => substr($token, 0, 10) . '...'
            ]);
            
            return response()->json(['message' => 'Token invalide'], 401);
        }
        
        // Ajouter l'utilisateur à la requête pour qu'il soit accessible dans les contrôleurs
        Auth::login($user);
        
        Log::info('✅ Auth success', [
            'user_id' => $user->id,
            'username' => $user->username
        ]);
        
        return $next($request);
    }
} 
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        Log::info('ApiTokenMiddleware - Requête reçue', [
            'path' => $request->path(),
            'method' => $request->method(),
            'headers' => $request->headers->all()
        ]);
        
        $token = $request->bearerToken();
        
        if (!$token) {
            Log::warning('ApiTokenMiddleware - Aucun token Bearer trouvé');
            return response()->json(['message' => 'Authentification requise'], 401);
        }

        Log::info('ApiTokenMiddleware - Token trouvé', ['token' => $token]);
        
        $user = User::where('api_token', $token)->first();
        
        if (!$user) {
            Log::warning('ApiTokenMiddleware - Token invalide, aucun utilisateur trouvé');
            return response()->json(['message' => 'Token invalide'], 401);
        }

        Log::info('ApiTokenMiddleware - Utilisateur authentifié', ['user_id' => $user->id, 'username' => $user->username]);
        
        Auth::login($user);
        
        return $next($request);
    }
}

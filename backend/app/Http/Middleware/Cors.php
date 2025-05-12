<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class Cors
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
        // Traiter la requête
        $response = $next($request);
        
        // Gérer les requêtes OPTIONS (preflight)
        if ($request->getMethod() === 'OPTIONS') {
            $response->setStatusCode(200);
            Log::info('CORS: OPTIONS request handled');
        }
        
        // Définir les en-têtes CORS
        $origin = $request->header('Origin');
        Log::info('CORS: Origin', ['origin' => $origin]);
        
        // Accepter toutes les origines en développement
        $response->headers->set('Access-Control-Allow-Origin', $origin ?: '*');
        Log::info('CORS: Setting origin', ['origin' => $origin ?: '*']);
        
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, Origin, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        Log::info('CORS: Headers set', [
            'allow-origin' => $response->headers->get('Access-Control-Allow-Origin'),
            'allow-methods' => $response->headers->get('Access-Control-Allow-Methods'),
            'allow-credentials' => $response->headers->get('Access-Control-Allow-Credentials')
        ]);
        
        return $response;
    }
}

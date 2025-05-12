<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ScheduleController extends Controller
{
    private $apiUrl = 'https://chabloz.eu/files/horaires/all';

    public function getSchedules()
    {
        try {
            // Utiliser le cache pour éviter trop d'appels à l'API externe
            return Cache::remember('schedules', 3600, function () {
                // Configurer la requête HTTP avec un timeout et des options spécifiques
                $response = Http::timeout(15)
                    ->withOptions([
                        'verify' => false, // Désactiver la vérification SSL si nécessaire
                    ])
                    ->get($this->apiUrl);

                if (!$response->successful()) {
                    Log::error('Échec de la requête API', [
                        'status' => $response->status(),
                        'body' => $response->body()
                    ]);
                    throw new \Exception('Échec de la requête vers l\'API externe');
                }

                $data = $response->json();
                if (!is_array($data)) {
                    throw new \Exception('Format de données invalide');
                }

                return response()->json($data);
            });
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des horaires', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la récupération des horaires',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\ManualNote;

class MarkController extends Controller
{
    private $gapsUrl = 'https://gaps.heig-vd.ch/consultation/controlescontinus/consultation.php';

    public function getMarks(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }
            
            // Vérifier si l'utilisateur a configuré ses identifiants GAPS
            if (!$user->gaps_login || !$user->gaps_password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants GAPS non configurés',
                    'needs_setup' => true
                ], 400);
            }
            
            // Vérifier si les notes ont déjà été récupérées aujourd'hui
            $lastFetch = DB::table('marks_fetch_log')
                ->where('user_id', $user->id)
                ->orderBy('fetched_at', 'desc')
                ->first();
                
            $shouldFetch = true;
            
            if ($lastFetch) {
                $lastFetchDate = Carbon::parse($lastFetch->fetched_at)->startOfDay();
                $today = Carbon::now()->startOfDay();
                
                if ($lastFetchDate->equalTo($today)) {
                    $shouldFetch = false;
                    Log::info('Utilisation du cache pour les notes', [
                        'user_id' => $user->id,
                        'last_fetch' => $lastFetch->fetched_at
                    ]);
                }
            }
            
            // Clé de cache spécifique à l'utilisateur
            $cacheKey = 'user_marks_' . $user->id;
            
            if (!$shouldFetch) {
                // Récupérer les notes depuis le cache
                $cachedMarks = Cache::get($cacheKey);
                if ($cachedMarks) {
                    return response()->json([
                        'success' => true,
                        'data' => $cachedMarks,
                        'cached' => true
                    ]);
                }
            }
            
            // Si on doit récupérer les notes ou si le cache est vide
            $marks = $this->fetchMarksFromGaps($user->gaps_login, $user->gaps_password);
            
            // Enregistrer la date de récupération
            DB::table('marks_fetch_log')->insert([
                'user_id' => $user->id,
                'fetched_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
            
            // Stocker dans le cache pour 24 heures
            Cache::put($cacheKey, $marks, 60 * 60 * 24);
            
            return response()->json([
                'success' => true,
                'data' => $marks,
                'cached' => false
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des notes', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function fetchMarksFromGaps($username, $password)
    {
        try {
            // Étape 1 : Se connecter à GAPS avec les identifiants fournis
            $loginUrl = 'https://gaps.heig-vd.ch/consultation/controlescontinus/consultation.php';
            
            // Préparer les données de connexion (utiliser le modèle de scriptGaps.js)
            $postData = [
                'rs' => 'identify',
                'rsargs' => [$username, $password, 'true'] // Format requis par GAPS
            ];
            
            // Initialiser une session cURL pour maintenir les cookies
            $curl = curl_init();
            
            // Configurer la requête de connexion
            curl_setopt_array($curl, [
                CURLOPT_URL => $loginUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query($postData),
                CURLOPT_COOKIEJAR => storage_path('app/gaps_cookies_' . md5($username) . '.txt'),
                CURLOPT_COOKIEFILE => storage_path('app/gaps_cookies_' . md5($username) . '.txt'),
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ]);
            
            // Exécuter la requête de connexion
            $loginResponse = curl_exec($curl);
            
            if (curl_errno($curl)) {
                throw new \Exception('Erreur cURL lors de la connexion: ' . curl_error($curl));
            }
            
            // Vérifier si la connexion a réussi (vérification basique)
            if (strpos($loginResponse, 'Authentification échouée') !== false) {
                throw new \Exception('Identifiants GAPS invalides');
            }
            
            // Étape 2 : Récupérer les notes (comme dans scriptGaps.js)
            $postData = [
                'rs' => 'replaceHtmlPart',
                'rsargs' => ['result', null]
            ];
            
            curl_setopt_array($curl, [
                CURLOPT_POSTFIELDS => http_build_query($postData)
            ]);
            
            $notesHtml = curl_exec($curl);
            
            // Fermer la session cURL
            curl_close($curl);
            
            // Étape 3 : Parser le HTML pour extraire les notes
            return $this->parseMarksFromHtml($notesHtml);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des notes depuis GAPS', [
                'username' => $username,
                'error' => $e->getMessage()
            ]);
            
            // En cas d'erreur, retourner un tableau vide plutôt que des données simulées
            return [];
        }
    }

    private function parseMarksFromHtml($html) {
        try {
            $marks = [];
            
            // Ajouter un log pour voir le HTML reçu
            Log::debug('HTML reçu:', ['html' => $html]);
            
            $dom = new \DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new \DOMXPath($dom);
            
            $rows = $xpath->query('//table[@class="displayArray"]/tr');
            
            // Vérifier si des lignes ont été trouvées
            if (!$rows || $rows->length === 0) {
                Log::warning('Aucune ligne trouvée dans le tableau');
                return [];
            }
            
            $idCounter = 1;
            
            if ($rows && $rows->length > 1) {
                for ($i = 1; $i < $rows->length; $i++) {
                    $row = $rows->item($i);
                    
                    // Vérifier si la ligne existe
                    if (!$row) {
                        Log::warning('Ligne null trouvée à l\'index ' . $i);
                        continue;
                    }
                    
                    try {
                        // Utiliser childNodes au lieu de getElementsByTagName
                        $cells = [];
                        $cellNodes = $row->childNodes;
                        
                        foreach ($cellNodes as $node) {
                            if ($node->nodeName == 'td') {
                                $cells[] = $node;
                            }
                        }
                        
                        if (count($cells) < 4) {
                            Log::warning('Nombre insuffisant de cellules', [
                                'found' => count($cells),
                                'expected' => 4
                            ]);
                            continue;
                        }

                        // Extraction des données des cellules
                        $courseName = trim($cells[0]->textContent);
                        $description = trim($cells[1]->textContent);
                        $date = $this->formatDate(trim($cells[2]->textContent));
                        $noteText = trim($cells[3]->textContent);

                        // Traitement de la note
                        if (preg_match('/(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/', $noteText, $matches)) {
                            $note = floatval($matches[1]);
                            $maxNote = floatval($matches[2]);

                            $marks[] = [
                                'id' => $idCounter++,
                                'course_name' => $courseName,
                                'description' => $description,
                                'date_note' => $date,
                                'note' => $note,
                                'max_note' => $maxNote,
                                'coefficient' => 1, // Valeur par défaut
                                'is_manual' => false
                            ];
                        }
                        
                    } catch (\Exception $e) {
                        Log::error('Erreur lors du traitement d\'une ligne', [
                            'error' => $e->getMessage(),
                            'line' => $i
                        ]);
                        continue;
                    }
                }
            }
            
            return $marks;
            
        } catch (\Exception $e) {
            Log::error('Erreur lors du parsing HTML', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Convertit une date au format JJ.MM.AAAA vers YYYY-MM-DD
     */
    private function formatDate($dateStr)
    {
        // Si la date est au format JJ.MM.AAAA
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})$/', $dateStr, $matches)) {
            return $matches[3] . '-' . $matches[2] . '-' . $matches[1];
        }
        
        // Si la date est déjà au bon format ou autre format, retourner tel quel
        return $dateStr;
    }

    /**
     * Ajouter une note manuelle
     */
    public function addManualNote(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_name' => 'required|string|max:255',
                'date_note' => 'required|date',
                'description' => 'required|string',
                'coefficient' => 'required|numeric|min:0',
                'note' => 'required|numeric|min:0',
                'max_note' => 'required|numeric|min:0',
                'include_in_average' => 'boolean'
            ]);

            $note = new ManualNote($validated);
            $note->user_id = $request->user()->id;
            $note->save();

            return response()->json([
                'success' => true,
                'data' => $note
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout d\'une note manuelle', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de la note'
            ], 500);
        }
    }

    /**
     * Récupérer les notes manuelles de l'utilisateur
     */
    public function getManualNotes(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }
            
            // Utiliser la relation manualNotes
            $notes = $user->manualNotes()
                ->orderBy('date_note', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notes
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des notes manuelles', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notes'
            ], 500);
        }
    }

    /**
     * Supprimer une note manuelle
     */
    public function deleteManualNote(Request $request, $id)
    {
        try {
            $note = ManualNote::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$note) {
                return response()->json([
                    'success' => false,
                    'message' => 'Note introuvable ou accès non autorisé'
                ], 404);
            }

            $note->delete();

            return response()->json([
                'success' => true,
                'message' => 'Note supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression d\'une note manuelle', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la note'
            ], 500);
        }
    }

    /**
     * Mettre à jour une note manuelle
     */
    public function updateManualNote(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'course_name' => 'string|max:255',
                'date_note' => 'date',
                'description' => 'string',
                'coefficient' => 'numeric|min:0',
                'note' => 'numeric|min:0',
                'max_note' => 'numeric|min:0',
                'include_in_average' => 'boolean'
            ]);

            $note = ManualNote::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$note) {
                return response()->json([
                    'success' => false,
                    'message' => 'Note introuvable ou accès non autorisé'
                ], 404);
            }

            $note->update($validated);

            return response()->json([
                'success' => true,
                'data' => $note,
                'message' => 'Note mise à jour avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour d\'une note manuelle', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la note'
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->orderBy('created_at', 'desc')->get();
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Déboguer les données reçues
        Log::debug('Données reçues pour la création de tâche:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|string|in:basse,moyenne,haute',
            'estimated_minutes' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation échouée:', $validator->errors()->toArray());
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $task = new Task();
        $task->title = $request->title;
        $task->description = $request->description;
        $task->due_date = $request->due_date;
        $task->priority = $request->priority ?? 'moyenne';
        $task->status = 'à faire';
        $task->user_id = $request->user()->id;
        // Traiter les minutes estimées correctement
        $task->estimated_minutes = $request->has('estimated_minutes') ? (int)$request->estimated_minutes : 0;
        
        // Débogage avant sauvegarde
        Log::debug('Tâche avant enregistrement:', $task->toArray());
        
        $task->save();
        
        // Débogage après sauvegarde
        Log::debug('Tâche après enregistrement:', $task->fresh()->toArray());

        return response()->json([
            'message' => 'Tâche créée avec succès',
            'task' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $task = Task::where('id', $id)
                    ->where('user_id', $request->user()->id)
                    ->first();

        if (!$task) {
            return response()->json([
                'message' => 'Tâche non trouvée'
            ], 404);
        }

        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Déboguer les données reçues
        Log::debug('Données reçues pour la mise à jour de tâche:', [
            'id' => $id,
            'data' => $request->all()
        ]);
        
        $task = Task::where('id', $id)
                    ->where('user_id', $request->user()->id)
                    ->first();

        if (!$task) {
            return response()->json([
                'message' => 'Tâche non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|string|in:basse,moyenne,haute',
            'status' => 'nullable|string|in:à faire,en cours,terminée',
            'estimated_minutes' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation de mise à jour échouée:', $validator->errors()->toArray());
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $task->title = $request->title;
        $task->description = $request->description;
        $task->due_date = $request->due_date;
        $task->priority = $request->priority ?? $task->priority;
        if ($request->has('status')) {
            $task->status = $request->status;
        }
        
        // Traiter les minutes estimées correctement
        if ($request->has('estimated_minutes')) {
            $task->estimated_minutes = (int)$request->estimated_minutes;
            Log::debug('Mise à jour du temps estimé:', ['value' => $task->estimated_minutes]);
        }
        
        // Débogage avant sauvegarde
        Log::debug('Tâche avant mise à jour:', $task->toArray());
        
        $task->save();
        
        // Débogage après sauvegarde
        Log::debug('Tâche après mise à jour:', $task->fresh()->toArray());

        return response()->json([
            'message' => 'Tâche mise à jour avec succès',
            'task' => $task
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $task = Task::where('id', $id)
                    ->where('user_id', $request->user()->id)
                    ->first();

        if (!$task) {
            return response()->json([
                'message' => 'Tâche non trouvée'
            ], 404);
        }

        $task->delete();

        return response()->json([
            'message' => 'Tâche supprimée avec succès'
        ]);
    }

    /**
     * Update the status of a task.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $id)
    {
        $task = Task::where('id', $id)
                    ->where('user_id', $request->user()->id)
                    ->first();

        if (!$task) {
            return response()->json([
                'message' => 'Tâche non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $task->status = $request->status;
        $task->save();

        return response()->json([
            'message' => 'Statut de la tâche mis à jour avec succès',
            'task' => $task
        ]);
    }
} 
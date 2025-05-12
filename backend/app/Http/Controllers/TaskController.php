<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    /**
     * Affiche le tableau de bord des tâches
     */
    public function dashboard()
    {
        $tasks = Auth::user()->tasks()->latest()->get();
        $todoTasks = $tasks->where('status', 'à faire');
        $inProgressTasks = $tasks->where('status', 'en cours');
        $completedTasks = $tasks->where('status', 'terminée');
        
        return view('tasks.dashboard', [
            'tasks' => $tasks,
            'todoTasks' => $todoTasks,
            'inProgressTasks' => $inProgressTasks,
            'completedTasks' => $completedTasks,
        ]);
    }
    
    /**
     * Affiche le formulaire de création de tâche
     */
    public function create()
    {
        return view('tasks.create');
    }
    
    /**
     * Enregistre une nouvelle tâche
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:à faire,en cours,terminée',
            'priority' => 'required|string|in:basse,moyenne,haute',
            'due_date' => 'nullable|date',
        ]);
        
        $task = new Task($validated);
        $task->user_id = Auth::id();
        $task->save();
        
       return redirect()->route('tasks.dashboard')
            ->with('success', 'Tâche créée avec succès!');

            // Optionnel : rediriger vers la dernière page visitée
            //return back()->with('success', 'Tâche créée avec succès!');
    }
    
    /**
     * Affiche le formulaire d'édition d'une tâche
     */
    public function edit(Task $task)
    {
        if (Gate::denies('update', $task)) {
            abort(403);
        }
        
        return view('tasks.edit', compact('task'));
    }
    
    /**
     * Met à jour une tâche
     */
    public function update(Request $request, Task $task)
    {
        if (Gate::denies('update', $task)) {
            abort(403);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:à faire,en cours,terminée',
            'priority' => 'required|string|in:basse,moyenne,haute',
            'due_date' => 'nullable|date',
        ]);
        
        $task->update($validated);
        
        return redirect()->route('tasks.dashboard')
                        ->with('success', 'Tâche mise à jour avec succès!');
    }
    
    /**
     * Supprime une tâche
     */
    public function destroy(Task $task)
    {
        if (Gate::denies('delete', $task)) {
            abort(403);
        }
        
        $task->delete();
        
        return redirect()->route('tasks.dashboard')
                        ->with('success', 'Tâche supprimée avec succès!');
    }
    
    /**
     * Met à jour le statut d'une tâche via AJAX
     */
    public function updateStatus(Request $request, Task $task)
    {
        if (Gate::denies('update', $task)) {
            abort(403);
        }
        
        $validated = $request->validate([
            'status' => 'required|string|in:à faire,en cours,terminée',
        ]);
        
        $task->update(['status' => $validated['status']]);
        
        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès'
        ]);
    }
}

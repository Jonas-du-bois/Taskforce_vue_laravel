<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    /**
     * Affiche la page d'accueil
     */
    public function index()
    {
        // Si l'utilisateur est connecté, prépare les données pour le tableau de bord
        if (Auth::check()) {
            $tasks = Auth::user()->tasks()->latest()->get();

            // Grouper les tâches par statut
            $todoTasks = $tasks->where('status', 'à faire');
            $inProgressTasks = $tasks->where('status', 'en cours');
            $completedTasks = $tasks->where('status', 'terminée');

            // Tâches en cours (à faire + en cours)
            $ongoingTasks = $tasks->filter(function ($task) {
                return in_array($task->status, ['à faire', 'en cours']);
            });

            // Statistiques
            $completedTodayCount = $completedTasks->filter(function ($task) {
                return $task->updated_at->isToday();
            })->count();

            $completedThisWeekCount = $completedTasks->filter(function ($task) {
                return $task->updated_at->isCurrentWeek();
            })->count();

            // Calcul du temps estimé total en minutes
            $totalEstimatedMinutes = $tasks->sum('estimated_minutes');
            $estimatedHours = floor($totalEstimatedMinutes / 60);
            $estimatedMinutes = $totalEstimatedMinutes % 60;

            // Tâches avec échéance proche (3 jours) ou en retard
            $now = Carbon::now();
            $dueSoonTasks = $ongoingTasks->filter(function ($task) use ($now) {
                return $task->due_date && $task->due_date->isFuture() && $task->due_date->diffInDays($now) <= 3;
            });

            $overdueTasks = $ongoingTasks->filter(function ($task) {
                return $task->due_date && $task->due_date->isPast();
            });

            return view('welcome', compact(
                'tasks',
                'todoTasks',
                'inProgressTasks',
                'completedTasks',
                'ongoingTasks',
                'completedTodayCount',
                'completedThisWeekCount',
                'dueSoonTasks',
                'overdueTasks',
                'estimatedHours',
                'estimatedMinutes'
            ));
        }

        // Sinon, affiche la page d'accueil pour les visiteurs
        return view('welcome');
    }

    public function about()
    {
        return view('about'); 
    }

    public function contact()
    {
        return view('contact'); 
    }

    public function mentionsLegales()
    {
        return view('mentions-legales'); 
    }

    public function sendContact(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'message' => 'required|string',
            ]);

            Log::info('Tentative d\'envoi d\'email de contact', [
                'from' => $request->email,
                'name' => $request->name
            ]);

            Mail::send('emails.contact', [
                'data' => [
                    'name' => $request->name,
                    'email' => $request->email,
                    'message' => $request->message
                ]
            ], function($message) use ($request) {
                $message->from($request->email, $request->name)
                        ->to('taskforce.contact@gmail.com')
                        ->subject('Nouveau message de contact - TaskForce');
            });

            Log::info('Email de contact envoyé avec succès', [
                'from' => $request->email,
                'name' => $request->name
            ]);

            return back()->with('success', 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de l\'email de contact', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'from' => $request->email,
                'name' => $request->name
            ]);
            return back()->with('error', 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.');
        }
    }
}

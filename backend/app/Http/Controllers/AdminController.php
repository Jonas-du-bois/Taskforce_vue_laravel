<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    private function checkAdmin()
    {
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return redirect()->route('home')->with('error', 'Accès non autorisé. Vous devez être administrateur.');
        }
        return true;
    }

    public function dashboard()
    {
        if ($this->checkAdmin() !== true) {
            return $this->checkAdmin();
        }

        $userCount = User::count();
        $taskCount = Task::count();

        return view('admin.dashboard', compact('userCount', 'taskCount'));
    }

    public function users()
    {
        if ($this->checkAdmin() !== true) {
            return $this->checkAdmin();
        }

        $users = User::all();
        return view('admin.users', compact('users'));
    }

    public function userDetails(User $user)
    {
        if ($this->checkAdmin() !== true) {
            return $this->checkAdmin();
        }

        $tasks = $user->tasks()->orderBy('created_at', 'desc')->get();
        return view('admin.user-details', compact('user', 'tasks'));
    }

    public function updateUser(Request $request, $id)
    {
        if ($this->checkAdmin() !== true) {
            return $this->checkAdmin();
        }

        $user = User::findOrFail($id);
        
        $request->validate([
            'is_admin' => 'required|boolean'
        ]);

        $user->update([
            'is_admin' => $request->is_admin
        ]);

        return redirect()->route('admin.users')->with('success', 'Le rôle de l\'utilisateur a été mis à jour avec succès.');
    }

    public function deleteUser($id)
    {
        if ($this->checkAdmin() !== true) {
            return $this->checkAdmin();
        }

        $user = User::findOrFail($id);
        
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users')->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'L\'utilisateur a été supprimé avec succès.');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class FormController extends Controller
{
    public function showLoginForm() {
        return view('login_form');
    }

    public function login(Request $request)
    {
        try {
            Log::info('Tentative de connexion pour : ' . $request->login);
            
            $request->validate([
                'login' => 'required|string',
                'password' => 'required|string',
            ]);

            // Déterminer si le login est un email ou un nom d'utilisateur
            $isEmail = filter_var($request->login, FILTER_VALIDATE_EMAIL);
            $field = $isEmail ? 'email' : 'username';
            
            $user = User::where($field, $request->login)->first();
            
            Log::info('Utilisateur trouvé : ' . ($user ? 'Oui' : 'Non'));

            if (!$user || !Hash::check($request->password, $user->password)) {
                Log::info('Échec de la connexion - Identifiants incorrects');
                return back()->with('error', 'Identifiants incorrects.');
            }

            if (!$user->hasVerifiedEmail()) {
                Log::info('Tentative de connexion avec email non vérifié : ' . $user->email);
                return back()->with('error', 'Veuillez confirmer votre adresse email avant de vous connecter. 
                    <a href="' . route('verification.resend') . '" class="text-indigo-600 hover:text-indigo-800">Renvoyer l\'email de confirmation</a>');
            }

            Auth::login($user);
            Log::info('Connexion réussie pour : ' . $user->email);
            
            return redirect()->intended('/');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la connexion : ' . $e->getMessage());
            return back()->with('error', 'Une erreur est survenue lors de la connexion.');
        }
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    // Afficher le profil
    public function showProfile() {
        $user = Auth::user();
        
        // Vérifier si l'image existe
        if ($user->profile_photo && !Storage::exists('public/profile_photos/' . $user->profile_photo)) {
            $user->profile_photo = null;
            User::where('id', $user->id)->update(['profile_photo' => null]);
        }
        
        return view('profile', ['user' => $user]);
    }

    // Mettre à jour le profil
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        // Valider les données
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        // Traiter la photo de profil si elle est fournie
        if ($request->hasFile('profile_photo')) {
            $photoName = time() . '.' . $request->profile_photo->getClientOriginalExtension();
            $request->profile_photo->storeAs('public/profile_photos', $photoName);
            
            // Supprimer l'ancienne photo si elle existe
            if ($user->profile_photo) {
                Storage::delete('public/profile_photos/' . $user->profile_photo);
            }
            
            $validatedData['profile_photo'] = $photoName;
        }
        
        // Mettre à jour l'utilisateur
        User::where('id', $user->id)->update($validatedData);
        
        return redirect()->route('profile')->with('success', 'Profil mis à jour avec succès!');
    }

    // Afficher le formulaire de changement de mot de passe
    public function showChangePasswordForm() {
        return view('change_password');
    }

    // Changer le mot de passe
    public function changePassword(Request $request) {
        $validatedData = $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Vérifier si le mot de passe actuel est correct
        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'Le mot de passe actuel est incorrect.'
            ]);
        }

        // Mise à jour du mot de passe
        User::where('id', $user->id)->update([
            'password' => Hash::make($validatedData['password'])
        ]);

        return redirect()->route('profile')->with('success', 'Mot de passe modifié avec succès!');
    }
}


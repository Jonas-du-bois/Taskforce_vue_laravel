<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;

class ProfileController extends Controller
{
    public function index()
    {
        return view('profile');
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'profile_photo' => 'nullable|image|max:2048', // 2MB max
        ]);

        // Mise à jour des informations de base
        $user->username = $request->username;
        $user->name = $request->name;
        $user->phone_number = $request->phone_number;

        // Gestion de la photo de profil
        if ($request->hasFile('profile_photo')) {
            // Suppression de l'ancienne photo si elle existe
            if ($user->profile_photo) {
                Storage::disk('public')->delete('profile_photos/' . $user->profile_photo);
            }

            // Stockage de la nouvelle photo
            $file = $request->file('profile_photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('profile_photos', $filename, 'public');
            $user->profile_photo = $filename;
        }

        $user->save();

        return redirect()->route('profile.index')->with('success', 'Profil mis à jour avec succès !');
    }

    public function password()
    {
        return view('change_password');
    }
} 
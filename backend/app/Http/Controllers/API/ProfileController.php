<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
            'class' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $user->name = $request->name;
        $user->email = $request->email;
        
        if ($request->has('class')) {
            $user->class = $request->class;
        }
        
        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * Change the authenticated user's password
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|string|min:8',
            'new_password_confirmation' => 'required|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }

    /**
     * Get available classes for the dropdown menu
     *
     * @return \Illuminate\Http\Response
     */
    public function getAvailableClasses()
    {
        // Vous pourriez charger ces données à partir d'une table dédiée,
        // mais pour l'instant, nous utilisons un tableau statique
        $classes = [
            'Terminale S',
            'Terminale ES',
            'Terminale L',
            'Première S',
            'Première ES',
            'Première L',
            'Seconde',
            'Troisième',
            'Quatrième',
            'Cinquième',
            'Sixième'
        ];

        return response()->json(['classes' => $classes]);
    }
} 
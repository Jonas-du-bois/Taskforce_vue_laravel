<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $verificationToken = Str::random(60);

            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'verification_token' => $verificationToken,
            ]);

            try {
                Mail::send('emails.verify-email', ['user' => $user], function($message) use ($user) {
                    $message->to($user->email)
                            ->subject('Confirmation de votre adresse email');
                });
                Log::info('Email de confirmation envoyé avec succès à ' . $user->email);
            } catch (\Exception $e) {
                Log::error('Erreur lors de l\'envoi de l\'email de confirmation : ' . $e->getMessage());
                // On continue même si l'email n'a pas pu être envoyé
            }

            return view('auth.verification-notice')
                ->with('success', 'Votre compte a été créé avec succès. Veuillez vérifier votre email pour confirmer votre adresse.');
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'inscription : ' . $e->getMessage());
            return back()->with('error', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
    }

    public function confirmEmail($token)
    {
        try {
            $user = User::where('verification_token', $token)->first();

            if (!$user) {
                return redirect()->route('showLoginForm')->with('error', 'Lien de confirmation invalide ou expiré.');
            }

            $user->email_verified_at = now();
            $user->verification_token = null;
            $user->save();

            return redirect()->route('showLoginForm')->with('success', 'Votre email a été confirmé avec succès. Vous pouvez maintenant vous connecter.');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la confirmation d\'email : ' . $e->getMessage());
            return redirect()->route('showLoginForm')->with('error', 'Une erreur est survenue lors de la confirmation de votre email.');
        }
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Send contact email
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
        }

        try {
            // Envoi de l'email
            Mail::raw($request->message, function ($message) use ($request) {
                $message->from($request->email, $request->name)
                        ->to('contact@taskforce.com')
                        ->subject('Contact depuis le site: ' . $request->subject);
            });

            return response()->json([
                'message' => 'Votre message a été envoyé avec succès !'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'envoi du message.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 
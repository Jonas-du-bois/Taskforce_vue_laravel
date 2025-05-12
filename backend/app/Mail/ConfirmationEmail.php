<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Crée une nouvelle instance du message.
     *
     * @param $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Construire le message de l'email.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Email de confirmation')
                    ->view('email.confirmation'); // Correction du chemin de la vue
    }
}

<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'class',
        'password',
        'profile_photo',
        'phone_number',
        'prenom',
        'nom',
        'is_admin',
        'role',
        'verification_token',
        'gaps_login',
        'gaps_password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'gaps_password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
    ];

    /**
     * Obtenir les tâches de l'utilisateur.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Vérifie si l'utilisateur est un administrateur.
     */
    public function isAdmin()
    {
        return $this->is_admin === true || $this->role === 'admin';
    }

    public function isVerified()
    {
        return $this->email_verified_at !== null;
    }

    /**
     * Obtenir les notes manuelles de l'utilisateur.
     */
    public function manualNotes()
    {
        return $this->hasMany(ManualNote::class);
    }
}

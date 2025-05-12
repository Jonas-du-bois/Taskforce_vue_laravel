<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'user_id',
        'estimated_minutes',
    ];

    /**
     * Les attributs qui doivent être convertis.
     *
     * @var array
     */
    protected $casts = [
        'due_date' => 'date',
    ];

    /**
     * Obtient l'utilisateur propriétaire de cette tâche.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Vérifie si la tâche est en cours.
     *
     * @return bool
     */
    public function isOngoing()
    {
        return in_array($this->status, ['à faire', 'en cours']);
    }

    /**
     * Vérifie si la tâche est terminée.
     *
     * @return bool
     */
    public function isCompleted()
    {
        return $this->status === 'terminée';
    }
}

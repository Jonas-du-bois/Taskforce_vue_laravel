<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_name',
        'date_note',
        'description',
        'coefficient',
        'note',
        'max_note',
        'include_in_average',
    ];

    protected $casts = [
        'date_note' => 'date',
        'note' => 'float',
        'max_note' => 'float',
        'include_in_average' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

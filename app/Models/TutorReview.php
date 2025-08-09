<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TutorReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'reviewer_id',
        'tutor_id',
        'rating',
        'comment',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
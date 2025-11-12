<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestionOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_question_id',
        'option',
        'is_correct',
    ];

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }
}

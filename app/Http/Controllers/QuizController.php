<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function submit(Request $request, Quiz $quiz)
    {
        $user = Auth::user();
        $answers = $request->input('answers');
        $questions = $quiz->questions()->with('options')->get();
        $score = 0;

        foreach ($questions as $question) {
            $correctOption = $question->options->firstWhere('is_correct', true);
            if ($correctOption && isset($answers[$question->id]) && $answers[$question->id] == $correctOption->id) {
                $score++;
            }
        }

        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'score' => $score,
        ]);

        return redirect()->back()->with('quiz_results', [
            'score' => $score,
            'total' => $questions->count(),
            'attempt' => $attempt,
        ]);
    }
}
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
        $totalQuestions = $questions->count();

        foreach ($questions as $question) {
            $correctOption = $question->options->firstWhere('is_correct', true);
            if ($correctOption && isset($answers[$question->id]) && $answers[$question->id] == $correctOption->id) {
                $score++;
            }
        }

        QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'score' => $score,
            'total_questions' => $totalQuestions,
        ]);

        $percentage = $totalQuestions > 0 ? ($score / $totalQuestions) * 100 : 0;
        $passed = $percentage >= 80;

        $response = redirect()->back()->with('quiz_submitted', true);
        if ($passed && is_null($quiz->course_section_id)) {
            $response = $response->with('success', 'Course completed!');
        }

        return $response;
    }
}

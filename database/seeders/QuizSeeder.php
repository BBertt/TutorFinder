<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizQuestionOption;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = Course::all();
        if ($courses->isEmpty()) {
            $this->command->info('No courses found. Skipping QuizSeeder.');
            return;
        }

        foreach ($courses as $course) {
            // Create a final quiz for each course
            $finalQuiz = Quiz::create([
                'title' => 'Final Quiz for ' . $course->title,
                'description' => 'Test your overall knowledge of this course.',
                'course_id' => $course->id,
            ]);
            $this->createQuestionsForQuiz($finalQuiz, 'final');

            // Create a quiz for the first section of each course
            $section = $course->sections()->first();
            if ($section) {
                $sectionQuiz = Quiz::create([
                    'title' => 'Quiz for ' . $section->title,
                    'description' => 'Test your knowledge from this first chapter.',
                    'course_section_id' => $section->id,
                ]);
                $this->createQuestionsForQuiz($sectionQuiz, 'section');
            }
        }
    }

    private function createQuestionsForQuiz(Quiz $quiz, $type)
    {
        $question1Text = $type === 'final' ? 'What is the main topic of this entire course?' : 'What is the capital of France?';
        $question2Text = $type === 'final' ? 'What was the most important concept in the final section?' : 'What is 2 + 2?';

        $question1 = QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'question' => $question1Text,
        ]);

        QuizQuestionOption::create(['quiz_question_id' => $question1->id, 'option' => 'Option A', 'is_correct' => true]);
        QuizQuestionOption::create(['quiz_question_id' => $question1->id, 'option' => 'Option B', 'is_correct' => false]);
        QuizQuestionOption::create(['quiz_question_id' => $question1->id, 'option' => 'Option C', 'is_correct' => false]);
        QuizQuestionOption::create(['quiz_question_id' => $question1->id, 'option' => 'Option D', 'is_correct' => false]);

        $question2 = QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'question' => $question2Text,
        ]);

        QuizQuestionOption::create(['quiz_question_id' => $question2->id, 'option' => 'Correct Answer', 'is_correct' => true]);
        QuizQuestionOption::create(['quiz_question_id' => $question2->id, 'option' => 'Wrong Answer 1', 'is_correct' => false]);
        QuizQuestionOption::create(['quiz_question_id' => $question2->id, 'option' => 'Wrong Answer 2', 'is_correct' => false]);
    }
}

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

        $uiUxCourse = Course::where('title', 'UI/UX Design 30-Day Challenge')->first();
        if ($uiUxCourse) {
            $this->createCourseQuizzes($uiUxCourse, 'uiux');
        }

        $nextJsCourse = Course::where('title', 'Next.js 15 Tutorial')->first();
        if ($nextJsCourse) {
            $this->createCourseQuizzes($nextJsCourse, 'nextjs');
        }

        $businessCourse = Course::where('title', 'Business Management Course')->first();
        if ($businessCourse) {
            $this->createCourseQuizzes($businessCourse, 'business');
        }

        $laravelCourse = Course::where('title', 'Learn Laravel The Right Way')->first();
        if ($laravelCourse) {
            $this->createCourseQuizzes($laravelCourse, 'laravel');
        }

        $pandasCourse = Course::where('title', 'Python Pandas Tutorial')->first();
        if ($pandasCourse) {
            $this->createCourseQuizzes($pandasCourse, 'pandas');
        }

        $specialCourses = ['UI/UX Design 30-Day Challenge', 'Next.js 15 Tutorial', 'Business Management Course', 'Learn Laravel The Right Way', 'Python Pandas Tutorial'];

        foreach ($courses as $course) {
            if (in_array($course->title, $specialCourses)) {
                continue;
            }

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

    private function createCourseQuizzes(Course $course, string $type)
    {
        // Create a final quiz
        $finalQuiz = Quiz::create([
            'title' => 'Final Quiz for ' . $course->title,
            'description' => 'Test your overall knowledge of this course.',
            'course_id' => $course->id,
        ]);
        if ($type === 'uiux') {
            $this->createUiUxQuestions($finalQuiz);
        } elseif ($type === 'nextjs') {
            $this->createNextJsQuestions($finalQuiz);
        } elseif ($type === 'business') {
            $this->createBusinessQuestions($finalQuiz);
        } elseif ($type === 'laravel') {
            $this->createLaravelQuestions($finalQuiz);
        } elseif ($type === 'pandas') {
            $this->createPandasQuestions($finalQuiz);
        }

        // Create a quiz for each section
        foreach ($course->sections as $section) {
            $sectionQuiz = Quiz::create([
                'title' => 'Quiz for ' . $section->title,
                'description' => 'Test your knowledge from this chapter.',
                'course_section_id' => $section->id,
            ]);
            if ($type === 'uiux') {
                $this->createUiUxQuestions($sectionQuiz, $section);
            } elseif ($type === 'nextjs') {
                $this->createNextJsQuestions($sectionQuiz, $section);
            } elseif ($type === 'business') {
                $this->createBusinessQuestions($sectionQuiz, $section);
            } elseif ($type === 'laravel') {
                $this->createLaravelQuestions($sectionQuiz, $section);
            } elseif ($type === 'pandas') {
                $this->createPandasQuestions($sectionQuiz, $section);
            }
        }
    }

    private function createPandasQuestions(Quiz $quiz, CourseSection $section = null)
    {
        $questions = [];

        if ($section) {
            switch ($section->title) {
                case 'Pandas Fundamentals':
                    $questions = [
                        [
                            'question' => 'What is a Pandas DataFrame?',
                            'options' => [
                                ['option' => 'A 2-dimensional labeled data structure with columns of potentially different types.', 'is_correct' => true],
                                ['option' => 'A 1-dimensional labeled array.', 'is_correct' => false],
                                ['option' => 'A built-in Python data type.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
                case 'Data Manipulation':
                    $questions = [
                        [
                            'question' => 'How can you filter rows in a DataFrame based on a condition?',
                            'options' => [
                                ['option' => 'Using boolean indexing.', 'is_correct' => true],
                                ['option' => 'Using a for loop.', 'is_correct' => false],
                                ['option' => 'It\'s not possible to filter rows.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
            }
        } else { // Final Quiz
            $questions = [
                [
                    'question' => 'What is the main purpose of the pandas library in Python?',
                    'options' => [
                        ['option' => 'Data analysis and manipulation.', 'is_correct' => true],
                        ['option' => 'Creating graphical user interfaces.', 'is_correct' => false],
                        ['option' => 'Building web servers.', 'is_correct' => false],
                    ],
                ],
                [
                    'question' => 'Which method is used to read a CSV file into a pandas DataFrame?',
                    'options' => [
                        ['option' => 'pd.read_csv()', 'is_correct' => true],
                        ['option' => 'pd.open_csv()', 'is_correct' => false],
                        ['option' => 'pd.load_csv()', 'is_correct' => false],
                    ],
                ],
            ];
        }

        foreach ($questions as $q) {
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $q['question'],
            ]);

            foreach ($q['options'] as $opt) {
                QuizQuestionOption::create([
                    'quiz_question_id' => $question->id,
                    'option' => $opt['option'],
                    'is_correct' => $opt['is_correct'],
                ]);
            }
        }
    }

    private function createLaravelQuestions(Quiz $quiz, CourseSection $section = null)
    {
        $questions = [];

        if ($section) {
            switch ($section->title) {
                case 'Introduction & Setup':
                    $questions = [
                        [
                            'question' => 'What is Laravel primarily used for?',
                            'options' => [
                                ['option' => 'Building web applications.', 'is_correct' => true],
                                ['option' => 'Data analysis.', 'is_correct' => false],
                                ['option' => 'Mobile app development.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
                case 'Routing':
                    $questions = [
                        [
                            'question' => 'How do you define a basic route in Laravel?',
                            'options' => [
                                ['option' => 'Route::get(\'/uri\', function () { ... });', 'is_correct' => true],
                                ['option' => 'Router.get(\'/uri\', () => { ... });', 'is_correct' => false],
                                ['option' => 'Route::make(\'/uri\', \'Controller@method\');', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
                case 'Service Layer':
                    $questions = [
                        [
                            'question' => 'What is the purpose of Laravel\'s Service Container?',
                            'options' => [
                                ['option' => 'To manage class dependencies and perform dependency injection.', 'is_correct' => true],
                                ['option' => 'To handle HTTP requests.', 'is_correct' => false],
                                ['option' => 'To define database migrations.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
            }
        } else { // Final Quiz
            $questions = [
                [
                    'question' => 'What is Artisan in Laravel?',
                    'options' => [
                        ['option' => 'A command-line interface included with Laravel.', 'is_correct' => true],
                        ['option' => 'A database management tool.', 'is_correct' => false],
                        ['option' => 'A frontend framework.', 'is_correct' => false],
                    ],
                ],
                [
                    'question' => 'What is Blade in Laravel?',
                    'options' => [
                        ['option' => 'Laravel\'s templating engine.', 'is_correct' => true],
                        ['option' => 'A type of database.', 'is_correct' => false],
                        ['option' => 'An authentication system.', 'is_correct' => false],
                    ],
                ],
            ];
        }

        foreach ($questions as $q) {
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $q['question'],
            ]);

            foreach ($q['options'] as $opt) {
                QuizQuestionOption::create([
                    'quiz_question_id' => $question->id,
                    'option' => $opt['option'],
                    'is_correct' => $opt['is_correct'],
                ]);
            }
        }
    }

    private function createBusinessQuestions(Quiz $quiz, CourseSection $section = null)
    {
        $questions = [];

        if ($section) {
            switch ($section->title) {
                case 'Business Fundamentals':
                    $questions = [
                        [
                            'question' => 'What is Business Finance?',
                            'options' => [
                                ['option' => 'The management of money and other valuable assets.', 'is_correct' => true],
                                ['option' => 'The marketing of a business.', 'is_correct' => false],
                                ['option' => 'The hiring of employees.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
            }
        } else { // Final Quiz
            $questions = [
                [
                    'question' => 'What is a key component of a business strategy?',
                    'options' => [
                        ['option' => 'Setting clear goals and objectives.', 'is_correct' => true],
                        ['option' => 'Ignoring the competition.', 'is_correct' => false],
                        ['option' => 'Focusing only on short-term profits.', 'is_correct' => false],
                    ],
                ],
            ];
        }

        foreach ($questions as $q) {
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $q['question'],
            ]);

            foreach ($q['options'] as $opt) {
                QuizQuestionOption::create([
                    'quiz_question_id' => $question->id,
                    'option' => $opt['option'],
                    'is_correct' => $opt['is_correct'],
                ]);
            }
        }
    }

    private function createNextJsQuestions(Quiz $quiz, CourseSection $section = null)
    {
        $questions = [];

        if ($section) {
            switch ($section->title) {
                case 'Getting Started':
                    $questions = [
                        [
                            'question' => 'What is Next.js?',
                            'options' => [
                                ['option' => 'A React framework for building full-stack web applications.', 'is_correct' => true],
                                ['option' => 'A CSS framework.', 'is_correct' => false],
                                ['option' => 'A database.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
                case 'Routing Fundamentals':
                    $questions = [
                        [
                            'question' => 'How do you create a nested route in Next.js?',
                            'options' => [
                                ['option' => 'By creating a folder inside another folder in the `app` directory.', 'is_correct' => true],
                                ['option' => 'By using a special component.', 'is_correct' => false],
                                ['option' => 'By editing a config file.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
            }
        } else { // Final Quiz
            $questions = [
                [
                    'question' => 'What is the purpose of a Layout component in Next.js?',
                    'options' => [
                        ['option' => 'To share UI between multiple pages.', 'is_correct' => true],
                        ['option' => 'To handle API requests.', 'is_correct' => false],
                        ['option' => 'To define the database schema.', 'is_correct' => false],
                    ],
                ],
                [
                    'question' => 'What are Server Actions in Next.js?',
                    'options' => [
                        ['option' => 'Functions that run on the server and can be called from client components.', 'is_correct' => true],
                        ['option' => 'A way to style components.', 'is_correct' => false],
                        ['option' => 'A feature for creating animations.', 'is_correct' => false],
                    ],
                ],
            ];
        }

        foreach ($questions as $q) {
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $q['question'],
            ]);

            foreach ($q['options'] as $opt) {
                QuizQuestionOption::create([
                    'quiz_question_id' => $question->id,
                    'option' => $opt['option'],
                    'is_correct' => $opt['is_correct'],
                ]);
            }
        }
    }

    private function createUiUxQuestions(Quiz $quiz, CourseSection $section = null)
    {
        $questions = [];

        if ($section) {
            switch ($section->title) {
                case 'UI/UX Fundamentals':
                    $questions = [
                        [
                            'question' => 'What is the main difference between UI and UX design?',
                            'options' => [
                                ['option' => 'UI is about the visual interface, while UX is about the overall user experience.', 'is_correct' => true],
                                ['option' => 'UI and UX are the same thing.', 'is_correct' => false],
                                ['option' => 'UX is a subset of UI.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
                case 'Designing Website Components':
                    $questions = [
                        [
                            'question' => 'What is a key consideration when designing a navigation bar?',
                            'options' => [
                                ['option' => 'Clarity and ease of use.', 'is_correct' => true],
                                ['option' => 'Using as many colors as possible.', 'is_correct' => false],
                                ['option' => 'Hiding it from the user.', 'is_correct' => false],
                            ],
                        ],
                    ];
                    break;
            }
        } else { // Final Quiz
            $questions = [
                [
                    'question' => 'What is the primary goal of a UI/UX designer?',
                    'options' => [
                        ['option' => 'To create a user-friendly and visually appealing product.', 'is_correct' => true],
                        ['option' => 'To write code.', 'is_correct' => false],
                        ['option' => 'To manage the project budget.', 'is_correct' => false],
                    ],
                ],
                [
                    'question' => 'What is a design portfolio used for?',
                    'options' => [
                        ['option' => 'To showcase your skills and past work to potential employers.', 'is_correct' => true],
                        ['option' => 'To store personal photos.', 'is_correct' => false],
                        ['option' => 'A list of your favorite websites.', 'is_correct' => false],
                    ],
                ],
            ];
        }

        foreach ($questions as $q) {
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $q['question'],
            ]);

            foreach ($q['options'] as $opt) {
                QuizQuestionOption::create([
                    'quiz_question_id' => $question->id,
                    'option' => $opt['option'],
                    'is_correct' => $opt['is_correct'],
                ]);
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

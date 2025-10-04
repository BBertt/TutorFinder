<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseCart;
use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use App\Models\CourseReview;
use App\Models\CourseSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = Category::factory()->count(5)->create();

        $tutors = User::where('role_id', 2)->get();
        $students = User::where('role_id', 3)->get();


        Course::factory()
            ->count(10)
            ->sequence(fn ($sequence) => [
                'user_id' => $tutors->random()->id,
                'category_id' => $categories->random()->id
            ])
            ->create()
            ->each(function ($course) use ($students) {

                CourseSection::factory()
                    ->count(rand(3, 5))
                    ->for($course)
                    ->create()
                    ->each(function ($section) {
                        CourseLesson::factory()
                            ->count(rand(4, 8))
                            ->for($section)
                            ->create();
                    });
                $enrolledStudents = $students->random(rand(1, $students->count()));
                foreach ($enrolledStudents as $student) {
                    CourseEnrollment::create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                        'enrollment_date' => now(),
                    ]);
                }


                $reviewingStudents = $enrolledStudents->random(rand(1, $enrolledStudents->count()));
                 foreach ($reviewingStudents as $student) {
                    CourseReview::factory()->create([
                         'user_id' => $student->id,
                         'course_id' => $course->id,
                    ]);
                }

                $cartStudents = $students->random(rand(1, $students->count()));
                 foreach ($cartStudents as $student) {
                    CourseCart::create([
                         'user_id' => $student->id,
                         'course_id' => $course->id,
                    ]);
                }
            });
    }
}

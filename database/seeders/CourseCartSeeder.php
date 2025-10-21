<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCart;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseCartSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $courses = Course::all();

        if ($users->isEmpty() || $courses->isEmpty()) {
            $this->command->info('No users or courses found, skipping CourseCartSeeder.');
            return;
        }

        foreach ($users as $user) {
            $coursesToCart = $courses->random(rand(1, min(3, $courses->count())));
            foreach ($coursesToCart as $course) {
                CourseCart::firstOrCreate([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                ]);
            }
        }
    }
}

<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseCart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseCartFactory extends Factory
{
    protected $model = CourseCart::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
        ];
    }
}

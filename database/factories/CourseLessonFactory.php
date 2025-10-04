<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseLesson>
 */
class CourseLessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => 'Lesson: ' . $this->faker->sentence(5),
            'description' => $this->faker->paragraph(3),
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ];
    }
}

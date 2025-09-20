<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'student_outcome' => $this->faker->paragraph,
            'requirements' => $this->faker->paragraph,
            'price' => $this->faker->randomFloat(2, 10, 100),
            'status' => 'approved',
            'thumbnail_image' => 'thumbnails/sample.jpg',
            'intro_video' => 'videos/sample.mp4',
        ];
    }
}
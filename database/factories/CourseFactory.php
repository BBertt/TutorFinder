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
            'user_id' => User::all()->random()->id,
            'category_id' => Category::all()->random()->id,
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(6),
            'student_outcome' => $this->faker->paragraph(4),
            'requirements' => $this->faker->paragraph(3),
            'price' => $this->faker->randomFloat(2, 100000, 200000),
            'status' => 'published',
            'thumbnail_image' => 'assets/images/landing/books.png',
            'intro_video' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseReview>
 */
class CourseReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         return [
            'rating' => $this->faker->randomFloat(1, 4, 5),
            'comment' => $this->faker->paragraph(),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Forum>
 */
class ForumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(8),
            'description' => $this->faker->paragraph(5),
            // 'likes' => $this->faker->numberBetween(0, 500),
            // 'dislikes' => $this->faker->numberBetween(0, 50),
        ];
    }
}

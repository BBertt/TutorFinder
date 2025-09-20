<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\User;
use App\Models\Category;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();

        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->info('Please seed users and categories first.');
            return;
        }

        for ($i = 0; $i < 5; $i++) {
            Course::create([
                'user_id' => $users->random()->id,
                'category_id' => $categories->random()->id,
                'title' => 'Sample Course ' . ($i + 1),
                'description' => 'This is a sample course description.',
                'student_outcome' => 'Learn new skills.',
                'requirements' => 'No prior knowledge required.',
                'price' => rand(10, 100),
                'status' => 'approved',
                'thumbnail_image' => 'thumbnails/sample.jpg',
                'intro_video' => 'videos/sample.mp4',
            ]);
        }
    }
}
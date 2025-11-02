<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Web Development', 'description' => 'Courses related to web development.'],
            ['name' => 'Mobile Development', 'description' => 'Courses related to mobile app development.'],
            ['name' => 'Data Science', 'description' => 'Courses related to data science.'],
            ['name' => 'Business', 'description' => 'Courses related to business and entrepreneurship.'],
            ['name' => 'UI/UX Design', 'description' => 'Courses related to design and user experience.'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

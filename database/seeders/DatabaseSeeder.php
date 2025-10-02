<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'tutor']);
        Role::create(['name' => 'student']);

        // Create a user for each role
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'role_id' => 1,
        ]);

        User::factory()->create([
            'first_name' => 'Tutor',
            'last_name' => 'User',
            'email' => 'tutor@example.com',
            'role_id' => 2,
        ]);

        User::factory()->create([
            'first_name' => 'Student',
            'last_name' => 'User',
            'email' => 'student@example.com',
            'role_id' => 3,
        ]);

        $this->call([
            CategorySeeder::class,
            CourseSeeder::class,
            CourseCartSeeder::class,
        ]);
    }
}

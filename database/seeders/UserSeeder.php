<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\TutorReview;
use App\Models\User;
use App\Models\TutorRegistration;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
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

        TutorRegistration::create([
            'user_id' => 2,
            'status' => 'approved',
        ]);

        User::factory()->create([
            'first_name' => 'Student',
            'last_name' => 'User',
            'email' => 'student@example.com',
            'role_id' => 3,
        ]);

        User::factory()->create([
            'first_name' => 'Bertrand',
            'last_name' => 'Wijaya',
            'email' => 'bertrand@example.com',
            'role_id' => 3,
        ]);

        User::factory()->create([
            'first_name' => 'Jerenico',
            'last_name' => 'Semanuel',
            'email' => 'jerenico@example.com',
            'role_id' => 3,
        ]);

        User::factory()->create([
            'first_name' => 'Joddy',
            'last_name' => 'Hartono',
            'email' => 'joddy@example.com',
            'role_id' => 3,
        ]);


        $students = User::factory()->count(10)->create(['role_id' => 3]);

        $tutors = User::factory()->count(5)->create(['role_id' => 2]);


        foreach ($tutors as $tutor) {
            TutorRegistration::create([
                'user_id' => $tutor->id,
                'status' => 'approved',
            ]);
            $reviewers = $students->random(rand(6, $students->count()));

            foreach ($reviewers as $reviewer) {
                TutorReview::factory()->create([
                    'tutor_id' => $tutor->id,
                    'reviewer_id' => $reviewer->id,
                ]);
            }
        }
    }
}

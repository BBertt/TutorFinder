<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseCart;
use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use App\Models\CourseReview;
use App\Models\CourseSection;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tutors = User::where('role_id', 2)->get();
        $students = User::where('role_id', 3)->get();

        if ($tutors->isEmpty() || $students->isEmpty()) {
            $this->command->error('Please ensure there is at least one tutor and one student before running the CourseSeeder.');
            return;
        }

        $coursesData= [[
            'title' => 'Laravel - Build Multi Vendor Ecommerce Website (2024)',
            'description' => 'Develop a Robust Multi-Vendor E-commerce Website Using Laravel 10, with Comprehensive Step-by-step Instructions',
            'user_id' => $tutors->random()->id,
            'category_id' => 1, // 1 For Web Development
            'student_outcome' => "Create a Multi Vendor Ecommerce Project with Laravel 10
                                    Laravel Fundamentals A-Z
                                    Advance Product Management System
                                    Multi-authentication Admin-Vendor-User
                                    Multi Vendor Feature
                                    Advanced Product Search
                                    Advanced Product Coupon
                                    Advanced Product Variants Feature
                                    Multi Product Image Upload Feature
                                    Product Review & Rating
                                    Product Discount Feature
                                    Multiple Payment Gateways
                                    Product Wishlist Feature
                                    Order Management Feature",
            'requirements' => "You have to know basic PHP
                                Basic HTML, CSS, Bootstrap, jQuery
                                Local Server : XAMPP/WAMP/MAMP/Laragon
                                Text Editor/IDE: Notepad++ / Sublime Text / Visual Studio Code / PhpStorm",
            'intro_video' => 'assets/videos/laravel_intro.mp4',
            'thumbnail_image' => 'assets/images/dummy/laravel.png',
            'status' => 'published',
            'price' => 150000,
        ],
        [
            'title' => 'Mobile App Development for Beginners',
            'description' => 'In this course you will learn the basics of mobile app development and get hands-on experience creating an Android, iOS, and Flutter app.',
            'user_id' => $tutors->random()->id,
            'category_id' => 2, // 2 For Mobile Development
            'student_outcome' => "Learn how to decide what tools and languages to use to develop apps
                                    Understand the basics of mobile app development
                                    Know what concepts like push notifications, modals, and deep links mean
                                    Compare and contrast software architectures like MVC, MVP, and MVVM
                                    Build an Android app hands-on using Kotlin and Android Studio
                                    Develop an iOS app hands-on using Swift and XCode
                                    Create a Flutter app hands-on using Dart and Visual Studio Code
                                    Learn how to run an app on an emulator, simulator, and devices",
            'requirements' => "A computer running Windows, Mac, or Linux (note that a Mac is required to follow along with the iOS section)",
            'intro_video' => 'assets/videos/laravel_intro.mp4',
            'thumbnail_image' => 'assets/images/dummy/mobile_dev.png',
            'status' => 'published',
            'price' => 200000,

        ],
        [
            'title' => 'Learn Pandas for Data Science',
            'description' => 'Unlock the power of data with Pandas, the Python library that has become essential for data manipulation and analysis. This beginner-friendly course is designed for anyone looking to break into data science, analysis, or machine learning by mastering one of the most critical tools in the Python ecosystem.
                In this course, you’ll learn how to harness the capabilities of Pandas to import, clean, analyze, and manipulate data with ease. We’ll start from the basics, explaining what Pandas is and why it’s a go-to choice for data professionals. From setting up your Python environment to understanding core data structures like Series and DataFrames, you’ll gain foundational skills to handle any dataset confidently.',
            'user_id' => $tutors->random()->id,
            'category_id' => 3, // 3 For Data Science
            'student_outcome' => "Master Data Manipulation: Understand the core functionalities of the Pandas library, including loading, cleaning, & transforming data to prepare it for analysis
                                    Explore and Analyze Data Efficiently: Learn to leverage Pandas for data exploration, like filtering, aggregating, and grouping data, to gain meaningful insights
                                    Optimize and Automate Data Workflows: Discover how to optimize data workflows in Pandas, making your data processing tasks faster and more efficient.
                                    Advanced Data Handling Techniques: Develop proficiency with advanced data manipulation techniques such as merging, joining, pivoting, and reshaping data.",
            'requirements' => "Basic python will be enough (string, lists, dictionaries, variables and function)",
            'intro_video' => 'assets/videos/laravel_intro.mp4',
            'thumbnail_image' => 'assets/images/dummy/data_science.png',
            'status' => 'published',
            'price' => 100000,
        ],[
            'title' => 'Build Your Business | Transition from Work to Business',
            'description' => 'Transit your life from working undersome to working for your dream, learn the hacks of how to completely transform',
            'user_id' => $tutors->random()->id,
            'category_id' => 4, // 4 For Business
            'student_outcome' => "Career path
                                    Choosing what they want to do : Business or work?
                                    Steps to start a business
                                    Financial and career planning
                                    Practical steps involved in the transition
                                    Common mistakes that people make while they choose a career",
            'requirements' => "This course is learnable and practicable by anyone and everyone with the interest in Career growth and Entrepreneurship",
            'intro_video' => 'assets/videos/laravel_intro.mp4',
            'thumbnail_image' => 'assets/images/dummy/business.png',
            'status' => 'published',
            'price' => 300000,
        ],
        [
           'title' => 'Learn Figma 2025: From Basics to Your First Design Project',
            'description' => 'Explore Figma in depth from scratch to a level where you can confidently craft your first UI/UX project!',
            'user_id' => $tutors->random()->id,
            'category_id' => 5, // 5 For UI/UX Design
            'student_outcome' => "Dive into Figma’s interface and tools with confidence, building a strong base for your journey into UI/UX design.
                                Explore Figma’s powerful team features, learning how to share projects, give and receive feedback, and design together in real-time like a pro.
                                Unlock Figma’s design interface with tips and tricks for smooth workflows, helping you work smarter and faster.
                                Gain expertise in Figma’s key tools and properties, giving you control to create refined, precise designs.
                                Design dynamic, reusable elements to streamline your work and bring flexibility into every project
                                Develop interactive components that go beyond basics, giving you the power to build engaging, user-centered designs
                                Master Auto Layout to ensure your designs look perfect across devices, preparing you for real-world responsive projects.
                                Discover how to establish consistent styles and grids that elevate your designs, adding a professional touch to your work.
                                Transform static screens into interactive, testable prototypes, preparing you for user testing and feedback.
                                Put all your skills into action with a capstone project—a fully responsive website design—giving you the confidence to jump into UI/UX design equipped with hands-on experience.",
            'requirements' => "No prior experience with Figma is necessary—just a desire to learn!",
            'intro_video' => 'assets/videos/laravel_intro.mp4',
            'thumbnail_image' => 'assets/images/dummy/design.png',
            'status' => 'published',
            'price' => 100000,

        ]];


        $createdCourses = collect($coursesData)->map(function ($courseData) use ($tutors) {
            return Course::create(
                $courseData + ['user_id' => $tutors->random()->id]
            );
        });


        $createdCourses->each(function (Course $course) use ($students) {
            CourseSection::factory()
                ->count(rand(3, 5))
                ->for($course)
                ->create()
                ->each(function (CourseSection $section) {
                    CourseLesson::factory()
                        ->count(rand(4, 8))
                        ->for($section)
                        ->create();
                });

            $enrolledStudents = $students->random(rand(1, $students->count()));
            foreach ($enrolledStudents as $student) {
                CourseEnrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'enrollment_date' => now()->subDays(rand(1, 60)),
                ]);
            }

            if ($enrolledStudents->count() > 0) {
                $reviewingStudents = $enrolledStudents->random(rand(1, $enrolledStudents->count()));
                foreach ($reviewingStudents as $student) {
                    CourseReview::factory()->create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ]);
                }
            }
        });
    }
}

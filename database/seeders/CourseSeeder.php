<?php

namespace Database\Seeders;

use App\Models\Course;
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

        $coursesData = [[ 
            'title' => 'UI/UX Design 30-Day Challenge',
            'description' => 'A 30-day challenge to learn UI/UX design from scratch, covering everything from fundamentals to building a portfolio.',
            'user_id' => $tutors->random()->id,
            'category_id' => 5, // 5 For UI/UX Design
            'student_outcome' => 'Understand the fundamentals of UI/UX design.
                                    Learn to use Figma for designing and prototyping.
                                    Design various components like navigations, hero sections, and cards.
                                    Master responsive design and form design.
                                    Create interactive prototypes and animations.
                                    Build a UI/UX design portfolio.',
            'requirements' => 'No prior experience with Figma or UI/UX design is necessary. Just a willingness to learn!',
            'intro_video' => 'https://www.youtube.com/watch?v=X-_eMAaPv5I',
            'thumbnail_image' => 'assets/images/dummy/uiux_course.jpg',
            'status' => 'published',
            'price' => 120000,
        ],
            [
                'title' => 'Next.js 15 Tutorial',
                'description' => 'A comprehensive tutorial on Next.js 15, covering everything from the basics to advanced topics like server components, data fetching, and authentication.',
                'user_id' => $tutors->random()->id,
                'category_id' => 1, // 1 For Web Development
                'student_outcome' => 'Understand the fundamentals of Next.js.
                                        Learn about routing, layouts, and metadata.
                                        Master data fetching and mutations with server actions.
                                        Implement authentication and authorization.
                                        Deploy Next.js applications to Vercel.',
                'requirements' => 'Basic knowledge of React and JavaScript is required.',
                'intro_video' => 'https://www.youtube.com/watch?v=b4ba60j_4o8',
                'thumbnail_image' => 'assets/images/dummy/nextjs_course.png',
                'status' => 'published',
                'price' => 250000,
            ],
            [
                'title' => 'Business Management Course',
                'description' => 'Learn the essentials of business management, from finance and strategy to marketing and operations.',
                'user_id' => $tutors->random()->id,
                'category_id' => 4, // 4 For Business
                'student_outcome' => 'Understand key business functions like finance, marketing, and HRM.
                                        Learn how to develop a business strategy.
                                        Gain insights into starting and growing a business.
                                        Learn about business administration and operations.',
                'requirements' => 'No prior business knowledge is required. A willingness to learn is essential.',
                'intro_video' => 'https://www.youtube.com/watch?v=T3l51Psce3c',
                'thumbnail_image' => 'assets/images/dummy/business_course.png',
                'status' => 'published',
                'price' => 180000,
            ],
            [
                'title' => 'Learn Laravel The Right Way',
                'description' => 'A comprehensive series to learn Laravel from scratch, covering core concepts, architecture, routing, services, and frontend integration.',
                'user_id' => $tutors->random()->id,
                'category_id' => 1, // 1 For Web Development
                'student_outcome' => "Understand Laravel's core principles and architecture.
                                        Master routing, middleware, and service containers.
                                        Work with Blade templates and Vite for assets.
                                        Learn database migrations and raw SQL queries.",
                'requirements' => 'Basic PHP knowledge is recommended.',
                'intro_video' => 'https://www.youtube.com/watch?v=w6Mr6Nlf-lE',
                'thumbnail_image' => 'assets/images/dummy/laravel_course.png',
                'status' => 'published',
                'price' => 200000,
            ],
            [
                'title' => 'Python Pandas Tutorial',
                'description' => 'A complete guide to data analysis with Python Pandas, from the basics of DataFrames to advanced data manipulation techniques.',
                'user_id' => $tutors->random()->id,
                'category_id' => 3, // 3 For Data Science
                'student_outcome' => 'Master the basics of Pandas DataFrames and Series.
                                        Learn to filter, sort, and update data.
                                        Handle missing values and clean data effectively.
                                        Work with time series data.
                                        Read and write data from various sources like Excel, JSON, and SQL.',
                'requirements' => 'A basic understanding of Python is recommended.',
                'intro_video' => 'https://www.youtube.com/watch?v=ZyhVh-qRZPA',
                'thumbnail_image' => 'assets/images/dummy/pandas_course.png',
                'status' => 'published',
                'price' => 150000,
            ],
        ];

        $createdCourses = collect($coursesData)->map(function ($courseData) use ($tutors) {
            $course = new Course($courseData);
            $course->user_id = $tutors->random()->id;
            $course->save();

            return $course;
        });

        $createdCourses->each(function (Course $course) use ($students) {
            if ($course->title === 'UI/UX Design 30-Day Challenge') {
                $this->createYoutubeLessons($course);
            } elseif ($course->title === 'Next.js 15 Tutorial') {
                $this->createNextJsLessons($course);
            } elseif ($course->title === 'Business Management Course') {
                $this->createBusinessLessons($course);
            } elseif ($course->title === 'Learn Laravel The Right Way') {
                $this->createLaravelLessons($course);
            } elseif ($course->title === 'Python Pandas Tutorial') {
                $this->createPandasLessons($course);
            }

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
    
    private function createPandasLessons(Course $course)
    {
        $videos = [
            ['title' => 'Python Pandas Tutorial (Part 1): Getting Started with Data Analysis - Installation and Loading Data', 'video_url' => 'https://www.youtube.com/watch?v=ZyhVh-qRZPA'],
            ['title' => 'Python Pandas Tutorial (Part 2): DataFrame and Series Basics - Selecting Rows and Columns', 'video_url' => 'https://www.youtube.com/watch?v=zmdjNSmRXF4'],
            ['title' => 'Python Pandas Tutorial (Part 3): Indexes - How to Set, Reset, and Use Indexes', 'video_url' => 'https://www.youtube.com/watch?v=W9XjRYFkkyw'],
            ['title' => 'Python Pandas Tutorial (Part 4): Filtering - Using Conditionals to Filter Rows and Columns', 'video_url' => 'https://www.youtube.com/watch?v=Lw2rlcxScZY'],
            ['title' => 'Python Pandas Tutorial (Part 5): Updating Rows and Columns - Modifying Data Within DataFrames', 'video_url' => 'https://www.youtube.com/watch?v=DCDe29sIKcE'],
            ['title' => 'Python Pandas Tutorial (Part 6): Add/Remove Rows and Columns From DataFrames', 'video_url' => 'https://www.youtube.com/watch?v=HQ6XO9eT-fc'],
            ['title' => 'Python Pandas Tutorial (Part 7): Sorting Data', 'video_url' => 'https://www.youtube.com/watch?v=T11QYVfZoD0'],
            ['title' => 'Python Pandas Tutorial (Part 8): Grouping and Aggregating - Analyzing and Exploring Your Data', 'video_url' => 'https://www.youtube.com/watch?v=txMdrV1Ut64'],
            ['title' => 'Python Pandas Tutorial (Part 9): Cleaning Data - Casting Datatypes and Handling Missing Values', 'video_url' => 'https://www.youtube.com/watch?v=KdmPHEnPJPs'],
            ['title' => 'Python Pandas Tutorial (Part 10): Working with Dates and Time Series Data', 'video_url' => 'https://www.youtube.com/watch?v=UFuo7EHI8zc'],
            ['title' => 'Python Pandas Tutorial (Part 11): Reading/Writing Data to Different Sources - Excel, JSON, SQL, Etc', 'video_url' => 'https://www.youtube.com/watch?v=N6hyN6BW6ao'],
        ];

        $sections = [
            ['title' => 'Pandas Fundamentals', 'videos' => array_slice($videos, 0, 3)],
            ['title' => 'Data Manipulation', 'videos' => array_slice($videos, 3, 4)],
            ['title' => 'Advanced Topics', 'videos' => array_slice($videos, 7, 4)],
        ];

        foreach ($sections as $sectionData) {
            $section = CourseSection::create([
                'course_id' => $course->id,
                'title' => $sectionData['title'],
            ]);

            foreach ($sectionData['videos'] as $videoData) {
                CourseLesson::create([
                    'course_section_id' => $section->id,
                    'title' => $videoData['title'],
                    'description' => $videoData['title'],
                    'video_url' => $videoData['video_url'],
                ]);
            }
        }
    }

    private function createLaravelLessons(Course $course)
    {
        $videos = [
            ['title' => 'What is Laravel & Why You Should Learn It | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=w6Mr6Nlf-lE'],
            ['title' => 'What You Need to Know Before Learning Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=gIpenotiUGE'],
            ['title' => 'Setting Up Laravel with Sail | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=S_z03NUUiBk'],
            ['title' => 'MVC the Laravel Way | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=sUMELDHZvqY'],
            ['title' => 'Understanding Laravel Architecture | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=W0KFGXx1HG8'],
            ['title' => 'Understanding Laravel’s Directory Structure | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=KzyMmRVRInM'],
            ['title' => 'Getting Started with Artisan Commands in Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=gw7O8P0J1jE'],
            ['title' => 'Getting Started with Laravel Tinker | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=sZysCyzl9Vk'],
            ['title' => 'Working with Laravel Config Files | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=Ts5fLYgEM8E'],
            ['title' => 'The Basics of Routing in Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=pP4g0xPq0TQ'],
            ['title' => 'Working with Route Parameters in Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=DgQEDXBcyZw'],
            ['title' => 'Clean Up Your Routes In Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=Aj8egM0HMNM'],
            ['title' => 'Group & Organize Your Routes | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=0MBzQg8sAZg'],
            ['title' => 'How Middleware Works in Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=C63AxM2y3pc'],
            ['title' => 'Understanding the Laravel Service Container | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=VO6Sm3GbCUk'],
            ['title' => 'What Are Laravel Service Providers and How Do They Work? | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=r4A_3f7KxbQ'],
            ['title' => 'What Are Laravel Facades and How Do They Work? | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=5LtSVmKx25s'],
            ['title' => 'How to Make the Most of Laravel’s Built-In Helpers | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=VZqx3QTwQfM'],
            ['title' => 'Get Sharp with Laravel Blade | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=AoMz0_zRPjg'],
            ['title' => 'Building Reusable Laravel Templates with Blade | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=4ULNx-c3jTc'],
            ['title' => 'Simplify Your Views with Laravel Blade Components | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=_VDiNlT3FOA'],
            ['title' => 'Say Hello to Vite: A Faster Way to Handle Assets | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=GH-qeijh2Xc'],
            ['title' => 'Getting Started with Databases & Migrations in Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=ZkDTqAi2_6s'],
            ['title' => 'Build a Transactions Page Using Raw SQL in Laravel | Learn Laravel The Right Way', 'video_url' => 'https://www.youtube.com/watch?v=zS-i4SUAeHY'],
        ];

        $sections = [
            ['title' => 'Introduction & Setup', 'videos' => array_slice($videos, 0, 3)],
            ['title' => 'Core Concepts & Architecture', 'videos' => array_slice($videos, 3, 3)],
            ['title' => 'Command Line & Configuration', 'videos' => array_slice($videos, 6, 3)],
            ['title' => 'Routing', 'videos' => array_slice($videos, 9, 4)],
            ['title' => 'Service Layer', 'videos' => array_slice($videos, 13, 5)],
            ['title' => 'Frontend & Data', 'videos' => array_slice($videos, 18, 6)],
        ];

        foreach ($sections as $sectionData) {
            $section = CourseSection::create([
                'course_id' => $course->id,
                'title' => $sectionData['title'],
            ]);

            foreach ($sectionData['videos'] as $videoData) {
                CourseLesson::create([
                    'course_section_id' => $section->id,
                    'title' => $videoData['title'],
                    'description' => $videoData['title'],
                    'video_url' => $videoData['video_url'],
                ]);
            }
        }
    }

    private function createBusinessLessons(Course $course)
    {
        $videos = [
            ['title' => 'Business Finance in Business Management', 'video_url' => 'https://www.youtube.com/watch?v=T3l51Psce3c'],
            ['title' => '6 Steps to Write Business Management Strategy for Your Own Business', 'video_url' => 'https://www.youtube.com/watch?v=gGE4GUv1-F0'],
            ['title' => 'Top 40 Business Marketing Methods to Include in Business Management Process', 'video_url' => 'https://www.youtube.com/watch?v=uaTTzNgRt-o'],
            ['title' => '7 Steps of Business Operations You Must Include in Business Management Process', 'video_url' => 'https://www.youtube.com/watch?v=n5QbXvDAZN8'],
            ['title' => 'Human Resource Management Explained | Don\'t Ignore HRM', 'video_url' => 'https://www.youtube.com/watch?v=PhkcstGNWtc'],
            ['title' => '3 Business Research Methods for Your New Business Ideas', 'video_url' => 'https://www.youtube.com/watch?v=jctM1Rcaeo4'],
            ['title' => 'Start a Business in 2025 | With 50 Business Management Skills', 'video_url' => 'https://www.youtube.com/watch?v=c1Z-rATTTxE'],
            ['title' => 'How to Grow Business with Better Quality Management System.', 'video_url' => 'https://www.youtube.com/watch?v=HMSfAk_igCI'],
            ['title' => '40 Business Documents You Must Need When you Start Business', 'video_url' => 'https://www.youtube.com/watch?v=72rTAyxd974'],
            ['title' => 'Start a Business with Self Management | Business Planning Strategies', 'video_url' => 'https://www.youtube.com/watch?v=aQedlJk4zcA'],
            ['title' => 'How to Provide Great Customer Service to Get More Clients in 2023', 'video_url' => 'https://www.youtube.com/watch?v=EiIlIHDqt-Q'],
            ['title' => 'Business Administration in 2 Minutes | Start a Business with proper Business Administration Process', 'video_url' => 'https://www.youtube.com/watch?v=6mkoGSqTqFI'],
            ['title' => 'How to Learn Business Accounting before You Start New Business', 'video_url' => 'https://www.youtube.com/watch?v=0a4tXP7m_N0'],
            ['title' => '20 Business Management Mistakes to Avoid When Starting a New Business', 'video_url' => 'https://www.youtube.com/watch?v=dABkukhG08A'],
            ['title' => 'How to Understand Demand and Supply to Start a New Business', 'video_url' => 'https://www.youtube.com/watch?v=ufhcZyMPgQk'],
            ['title' => 'Basics of Business Economics to Start a Business in 2025', 'video_url' => 'https://www.youtube.com/watch?v=e5L3XgLPtZQ'],
            ['title' => 'How to Write a Business Budget Plan to Start a Business', 'video_url' => 'https://www.youtube.com/watch?v=CnOucbYNsys'],
            ['title' => 'International Business Management Basics before You Move Next Step', 'video_url' => 'https://www.youtube.com/watch?v=YlUDw2Z09nQ'],
            ['title' => 'How to Start and Grow Your Business To The Next Level', 'video_url' => 'https://www.youtube.com/watch?v=BHL_zqoF--8'],
            ['title' => 'How to Make More Money in Your Small Business to beat your Competitors', 'video_url' => 'https://www.youtube.com/watch?v=-bO6ktwZlTk'],
            ['title' => 'Introducing Business Management Course', 'video_url' => 'https://www.youtube.com/watch?v=HE9JioDuXkQ'],
            ['title' => 'How to Get Customers for Your New Business', 'video_url' => 'https://www.youtube.com/watch?v=rVEvsLNRAuk'],
            ['title' => 'How to Launch Product Step by Step - 7 Easy Steps', 'video_url' => 'https://www.youtube.com/watch?v=mRYp0_QoW-w'],
            ['title' => 'How to Manage a Business and Become a Great Leader', 'video_url' => 'https://www.youtube.com/watch?v=r1wramwGjmE'],
        ];

        $sections = [
            ['title' => 'Business Fundamentals', 'videos' => array_slice($videos, 0, 6)],
            ['title' => 'Starting a Business', 'videos' => array_slice($videos, 6, 6)],
            ['title' => 'Core Business Knowledge', 'videos' => array_slice($videos, 12, 6)],
            ['title' => 'Growth and Leadership', 'videos' => array_slice($videos, 18, 6)],
        ];

        foreach ($sections as $sectionData) {
            $section = CourseSection::create([
                'course_id' => $course->id,
                'title' => $sectionData['title'],
            ]);

            foreach ($sectionData['videos'] as $videoData) {
                CourseLesson::create([
                    'course_section_id' => $section->id,
                    'title' => $videoData['title'],
                    'description' => $videoData['title'],
                    'video_url' => $videoData['video_url'],
                ]);
            }
        }
    }

    private function createNextJsLessons(Course $course)
    {
        $videos = [
            ['title' => 'Next.js 15 Tutorial - 1 - Introduction', 'video_url' => 'https://www.youtube.com/watch?v=b4ba60j_4o8'],
            ['title' => 'Next.js 15 Tutorial - 2 - Hello World', 'video_url' => 'https://www.youtube.com/watch?v=xiSuX0f1mEI'],
            ['title' => 'Next.js 15 Tutorial - 3 - Project Structure', 'video_url' => 'https://www.youtube.com/watch?v=L0g87N0piT0'],
            ['title' => 'Next.js 15 Tutorial - 4 - Before We Start', 'video_url' => 'https://www.youtube.com/watch?v=7DC3ZrxvUUU'],
            ['title' => 'Next.js 15 Tutorial - 5 - Routing', 'video_url' => 'https://www.youtube.com/watch?v=9602Yzvd7ik'],
            ['title' => 'Next.js 15 Tutorial - 6 - Nested Routes', 'video_url' => 'https://www.youtube.com/watch?v=H7JjKjkC33c'],
            ['title' => 'Next.js 15 Tutorial - 7 - Dynamic Routes', 'video_url' => 'https://www.youtube.com/watch?v=k9g6aVLH3p4'],
            ['title' => 'Next.js 15 Tutorial - 8 - Nested Dynamic Routes', 'video_url' => 'https://www.youtube.com/watch?v=edrJf0GKfAI'],
            ['title' => 'Next.js 15 Tutorial - 9 - Catch all Segments', 'video_url' => 'https://www.youtube.com/watch?v=d46hLIg1B3Q'],
            ['title' => 'Next.js 15 Tutorial - 10 - Not Found Page', 'video_url' => 'https://www.youtube.com/watch?v=GCipVDqBD3k'],
            ['title' => 'Next.js 15 Tutorial - 11 - File Colocation', 'video_url' => 'https://www.youtube.com/watch?v=fpOinVG85Pk'],
            ['title' => 'Next.js 15 Tutorial - 12 - Private Folders', 'video_url' => 'https://www.youtube.com/watch?v=nJjs3wrji5s'],
            ['title' => 'Next.js 15 Tutorial - 13 - Route Groups', 'video_url' => 'https://www.youtube.com/watch?v=auXXk38rGgk'],
            ['title' => 'Next.js 15 Tutorial - 14 - Layouts', 'video_url' => 'https://www.youtube.com/watch?v=NK-8a8EzWrU'],
            ['title' => 'Next.js 15 Tutorial - 15 - Nested Layouts', 'video_url' => 'https://www.youtube.com/watch?v=TzF2RKFjRyk'],
            ['title' => 'Next.js 15 Tutorial - 16 - Multiple Root Layouts', 'video_url' => 'https://www.youtube.com/watch?v=KZC6TRG3Mks'],
            ['title' => 'Next.js 15 Tutorial - 17 - Routing Metadata', 'video_url' => 'https://www.youtube.com/watch?v=OldUurB0Wx8'],
            ['title' => 'Next.js 15 Tutorial - 18 - title Metadata', 'video_url' => 'https://www.youtube.com/watch?v=dckNsCjnV9A'],
            ['title' => 'Next.js 15 Tutorial - 19 - Link Component', 'video_url' => 'https://www.youtube.com/watch?v=9y7E44zHiGM'],
            ['title' => 'Next.js 15 Tutorial - 20 - Active Links', 'video_url' => 'https://www.youtube.com/watch?v=aJjMeCUvZ0E'],
            ['title' => 'Next.js 15 Tutorial - 21 - params and searchParams', 'video_url' => 'https://www.youtube.com/watch?v=qPsY4AKFlnM'],
            ['title' => 'Next.js 15 Tutorial - 22 - Navigating Programmatically', 'video_url' => 'https://www.youtube.com/watch?v=Z9P6UveWGKc'],
            ['title' => 'Next.js 15 Tutorial - 23 - Templates', 'video_url' => 'https://www.youtube.com/watch?v=yfww2kplO-k'],
            ['title' => 'Next.js 15 Tutorial - 24 - Loading UI', 'video_url' => 'https://www.youtube.com/watch?v=0OVg4ikUaz0'],
            ['title' => 'Next.js 15 Tutorial - 25 - Error Handling', 'video_url' => 'https://www.youtube.com/watch?v=fWV5WPSbgdg'],
            ['title' => 'Next.js 15 Tutorial - 26 - Recovering from Errors', 'video_url' => 'https://www.youtube.com/watch?v=15beQR0DFMQ'],
            ['title' => 'Next.js 15 Tutorial - 27 - Handling Errors in Nested Routes', 'video_url' => 'https://www.youtube.com/watch?v=-ZPpNu0ybNZM'],
            ['title' => 'Next.js 15 Tutorial - 28 - Handling Errors in Layouts', 'video_url' => 'https://www.youtube.com/watch?v=-OAVelXX5sE'],
            ['title' => 'Next.js 15 Tutorial - 29 - Handling Global Errors', 'video_url' => 'https://www.youtube.com/watch?v=ywUDMEVR3Mg'],
            ['title' => 'Next.js 15 Tutorial - 30 - Parallel Routes', 'video_url' => 'https://www.youtube.com/watch?v=697kNwfU-4M'],
            ['title' => 'Next.js 15 Tutorial - 31 - Unmatched Routes', 'video_url' => 'https://www.youtube.com/watch?v=N2Hjwj5ibjQ'],
            ['title' => 'Next.js 15 Tutorial - 32 - Conditional Routes', 'video_url' => 'https://www.youtube.com/watch?v=P-_P3J11_bE'],
            ['title' => 'Next.js 15 Tutorial - 33 - Intercepting Routes', 'video_url' => 'https://www.youtube.com/watch?v=FTiwIVxWC00'],
            ['title' => 'Next.js 15 Tutorial - 34 - Parallel Intercepting Routes', 'video_url' => 'https://www.youtube.com/watch?v=U6aRqv7rzQ8'],
            ['title' => 'Next.js 15 Tutorial - 35 - Route Handlers', 'video_url' => 'https://www.youtube.com/watch?v=27Uj6BeIDV0'],
            ['title' => 'Next.js 15 Tutorial - 36 - Handling GET Requests', 'video_url' => 'https://www.youtube.com/watch?v=bD_Be8WiFvg'],
            ['title' => 'Next.js 15 Tutorial - 37 - Handling POST Requests', 'video_url' => 'https://www.youtube.com/watch?v=jkJ7JtQ2x5Y'],
            ['title' => 'Next.js 15 Tutorial - 38 - Dynamic Route Handlers', 'video_url' => 'https://www.youtube.com/watch?v=EBkKNzJURJM'],
            ['title' => 'Next.js 15 Tutorial - 39 - Handling PATCH Requests', 'video_url' => 'https://www.youtube.com/watch?v=rlHkm-Rbo74'],
            ['title' => 'Next.js 15 Tutorial - 40 - Handling DELETE Requests', 'video_url' => 'https://www.youtube.com/watch?v=Rv92ysl9tOQ'],
            ['title' => 'Next.js 15 Tutorial - 41 - URL Query Parameters', 'video_url' => 'https://www.youtube.com/watch?v=LvRLbeBYkuo'],
            ['title' => 'Next.js 15 Tutorial - 42 - Headers in Route Handlers', 'video_url' => 'https://www.youtube.com/watch?v=xshMFZRXDPM'],
            ['title' => 'Next.js 15 Tutorial - 43 - Cookies in Route Handlers', 'video_url' => 'https://www.youtube.com/watch?v=7KEwSiD7VxY'],
            ['title' => 'Next.js 15 Tutorial - 44 - Redirects in Route Handlers', 'video_url' => 'https://www.youtube.com/watch?v=L0iIzarEQ6Q'],
            ['title' => 'Next.js 15 Tutorial - 45 - Caching in Route Handlers', 'video_url' => 'https://www.youtube.com/watch?v=1afNuqtb7q8'],
            ['title' => 'Next.js 15 Tutorial - 46 - Middleware', 'video_url' => 'https://www.youtube.com/watch?v=t1KTTZbqCm0'],
            ['title' => 'Next.js 15 Tutorial - 47 - Rendering', 'video_url' => 'https://www.youtube.com/watch?v=6-qMfLcPhOw'],
            ['title' => 'Next.js 15 Tutorial - 48 - Client-side Rendering (CSR)', 'video_url' => 'https://www.youtube.com/watch?v=-FIUWaYXmTU'],
            ['title' => 'Next.js 15 Tutorial - 49 - Server-side Rendering (SSR)', 'video_url' => 'https://www.youtube.com/watch?v=R8ZwbehCGP0'],
            ['title' => 'Next.js 15 Tutorial - 50 - Suspense SSR', 'video_url' => 'https://www.youtube.com/watch?v=cwjsoOZVK34'],
            ['title' => 'Next.js 15 Tutorial - 51 - React Server Components', 'video_url' => 'https://www.youtube.com/watch?v=Nnr6w8vamUo'],
            ['title' => 'Next.js 15 Tutorial - 52 - Server and Client Components', 'video_url' => 'https://www.youtube.com/watch?v=dMCSiA5gzkU'],
            ['title' => 'Next.js 15 Tutorial - 53 - RSC Rendering Lifecycle', 'video_url' => 'https://www.youtube.com/watch?v=aZAMP-4Szgg'],
            ['title' => 'Next.js 15 Tutorial - 54 - Static Rendering', 'video_url' => 'https://www.youtube.com/watch?v=O6VFEwHujW0'],
            ['title' => 'Next.js 15 Tutorial - 55 - Dynamic Rendering', 'video_url' => 'https://www.youtube.com/watch?v=Zmi8Ad8TBYY'],
            ['title' => 'Next.js 15 Tutorial - 56 - generateStaticParams', 'video_url' => 'https://www.youtube.com/watch?v=09aGB_Q6cqE'],
            ['title' => 'Next.js 15 Tutorial - 57 - dynamicParams', 'video_url' => 'https://www.youtube.com/watch?v=oEF3dyNgmcs'],
            ['title' => 'Next.js 15 Tutorial - 58 - Streaming', 'video_url' => 'https://www.youtube.com/watch?v=oSf1gUDGJOA'],
            ['title' => 'Next.js 15 Tutorial - 59 - Server and Client Composition Patterns', 'video_url' => 'https://www.youtube.com/watch?v=HQcxPCDwTuE'],
            ['title' => 'Next.js 15 Tutorial - 60 - Server-only Code', 'video_url' => 'https://www.youtube.com/watch?v=BmcGheLzzT0'],
            ['title' => 'Next.js 15 Tutorial - 61 - Third Party Packages', 'video_url' => 'https://www.youtube.com/watch?v=FJvUhHiihIQ'],
            ['title' => 'Next.js 15 Tutorial - 62 - Context Providers', 'video_url' => 'https://www.youtube.com/watch?v=ebOgXUPG3_k'],
            ['title' => 'Next.js 15 Tutorial - 63 - Client-only Code', 'video_url' => 'https://www.youtube.com/watch?v=zVRVMTTVHes'],
            ['title' => 'Next.js 15 Tutorial - 64 - Client Component Placement', 'video_url' => 'https://www.youtube.com/watch?v=yJNuVay1SHw'],
            ['title' => 'Next.js 15 Tutorial - 65 - Interleaving Server and Client Components', 'video_url' => 'https://www.youtube.com/watch?v=PM_STAq4MSg'],
            ['title' => 'Next.js 15 Tutorial - 66 - Data Fetching', 'video_url' => 'https://www.youtube.com/watch?v=DRsU93Lde2k'],
            ['title' => 'Next.js 15 Tutorial - 67 - Fetching Data in Client Components', 'video_url' => 'https://www.youtube.com/watch?v=7Kz4--kCBP0'],
            ['title' => 'Next.js 15 Tutorial - 68 - Fetching Data in Server Components', 'video_url' => 'https://www.youtube.com/watch?v=WKfPctdIDek'],
            ['title' => 'Next.js 15 Tutorial - 69 - Loading and Error States', 'video_url' => 'https://www.youtube.com/watch?v=jdLSKIzvKnk'],
            ['title' => 'Next.js 15 Tutorial - 70 - Sequential Data Fetching', 'video_url' => 'https://www.youtube.com/watch?v=Fo4BZtzV2xQ'],
            ['title' => 'Next.js 15 Tutorial - 71 - Parallel Data Fetching', 'video_url' => 'https://www.youtube.com/watch?v=TLcuO9anpPo'],
            ['title' => 'Next.js 15 Tutorial - 72 - Fetching from a Database', 'video_url' => 'https://www.youtube.com/watch?v=IUeSwzvz9i4'],
            ['title' => 'Next.js 15 Tutorial - 73 - Data Mutations', 'video_url' => 'https://www.youtube.com/watch?v=F8DB4LM1dME'],
            ['title' => 'Next.js 15 Tutorial - 74 - Forms with Server Actions', 'video_url' => 'https://www.youtube.com/watch?v=xWFbnrTap3M'],
            ['title' => 'Next.js 15 Tutorial - 75 - Pending State with useFormStatus', 'video_url' => 'https://www.youtube.com/watch?v=o3M7RmsyiBU'],
            ['title' => 'Next.js 15 Tutorial - 76 - Form Validation with useActionState', 'video_url' => 'https://www.youtube.com/watch?v=4-3K7SgoVf4'],
            ['title' => 'Next.js 15 Tutorial - 77 - Separating Server Actions', 'video_url' => 'https://www.youtube.com/watch?v=UiQpt9b_ei4'],
            ['title' => 'Next.js 15 Tutorial - 78 - useFormStatus vs useActionState', 'video_url' => 'https://www.youtube.com/watch?v=qpA-eGxASxo'],
            ['title' => 'Next.js 15 Tutorial - 79 - Update Server Action', 'video_url' => 'https://www.youtube.com/watch?v=SbaKEqCRcDE'],
            ['title' => 'Next.js 15 Tutorial - 80 - Delete Server Action', 'video_url' => 'https://www.youtube.com/watch?v=oi71gLPFQtk'],
            ['title' => 'Next.js 15 Tutorial - 81 - Optimistic Updates', 'video_url' => 'https://www.youtube.com/watch?v=ipmfUw8I2qc'],
            ['title' => 'Next.js 15 Tutorial - 82 - Form Component', 'video_url' => 'https://www.youtube.com/watch?v=8CYDkIncDSw'],
            ['title' => 'Next.js 15 Tutorial - 83 - Authentication', 'video_url' => 'https://www.youtube.com/watch?v=X3CHpXpeQ0c'],
            ['title' => 'Next.js 15 Tutorial - 84 - Clerk Setup', 'video_url' => 'https://www.youtube.com/watch?v=GXIjfcYeDog'],
            ['title' => 'Next.js 15 Tutorial - 85 - Sign in and Sign out', 'video_url' => 'https://www.youtube.com/watch?v=Qm-1PwZeUhU'],
            ['title' => 'Next.js 15 Tutorial - 86 - Profile Settings', 'video_url' => 'https://www.youtube.com/watch?v=DmuwoBrYuIE'],
            ['title' => 'Next.js 15 Tutorial - 87 - Conditional UI Rendering', 'video_url' => 'https://www.youtube.com/watch?v=ZIqa2hS0X6k'],
            ['title' => 'Next.js 15 Tutorial - 88 - Protecting Routes', 'video_url' => 'https://www.youtube.com/watch?v=O4LhNvL5N28'],
            ['title' => 'Next.js 15 Tutorial - 89 - Read Session and User Data', 'video_url' => 'https://www.youtube.com/watch?v=lUqOhq3YxnQ'],
            ['title' => 'Next.js 15 Tutorial - 90 - Role Based Access Control', 'video_url' => 'https://www.youtube.com/watch?v=aY5Mq-3UemY'],
            ['title' => 'Next.js 15 Tutorial - 91 - Customizing Clerk Components', 'video_url' => 'https://www.youtube.com/watch?v=AocT--scISg'],
            ['title' => 'Next.js 15 Tutorial - 92 - Deploying Next.js Apps to Vercel', 'video_url' => 'https://www.youtube.com/watch?v=eJBQqzXmTeM'],
        ];

        $sections = [
            ['title' => 'Getting Started', 'videos' => array_slice($videos, 0, 4)],
            ['title' => 'Routing Fundamentals', 'videos' => array_slice($videos, 4, 9)],
            ['title' => 'Layouts and Metadata', 'videos' => array_slice($videos, 13, 5)],
            ['title' => 'Navigation', 'videos' => array_slice($videos, 18, 4)],
            ['title' => 'UI and Error Handling', 'videos' => array_slice($videos, 22, 7)],
            ['title' => 'Advanced Routing', 'videos' => array_slice($videos, 29, 5)],
            ['title' => 'Route Handlers', 'videos' => array_slice($videos, 34, 11)],
            ['title' => 'Middleware and Rendering', 'videos' => array_slice($videos, 45, 13)],
            ['title' => 'Component Composition', 'videos' => array_slice($videos, 58, 7)],
            ['title' => 'Data Fetching', 'videos' => array_slice($videos, 65, 7)],
            ['title' => 'Data Mutations & Server Actions', 'videos' => array_slice($videos, 72, 10)],
            ['title' => 'Authentication', 'videos' => array_slice($videos, 82, 9)],
            ['title' => 'Deployment', 'videos' => array_slice($videos, 91, 1)],
        ];

        foreach ($sections as $sectionData) {
            $section = CourseSection::create([
                'course_id' => $course->id,
                'title' => $sectionData['title'],
            ]);

            foreach ($sectionData['videos'] as $videoData) {
                CourseLesson::create([
                    'course_section_id' => $section->id,
                    'title' => $videoData['title'],
                    'description' => $videoData['title'],
                    'video_url' => $videoData['video_url'],
                ]);
            }
        }
    }

    private function createYoutubeLessons(Course $course)
    {
        $videos = [
            ['title' => 'Learn UI/UX for Free - 30 Videos in 30 Days', 'video_url' => 'https://www.youtube.com/watch?v=X-_eMAaPv5I'],
            ['title' => 'WHAT IS UI/UX? And which to focus on', 'video_url' => 'https://www.youtube.com/watch?v=SbVZCiYBVoU'],
            ['title' => 'The Sweet Tools of UI/UX Design', 'video_url' => 'https://www.youtube.com/watch?v=Gz7IhYEYGEA'],
            ['title' => 'UI/UX Desktop Navigations in Figma (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=EZBwM1aOwLc'],
            ['title' => 'Who made the Best UI/UX Navigation? (Review)', 'video_url' => 'https://www.youtube.com/watch?v=XdtwJdFjoVs'],
            ['title' => 'The UI/UX of Hero Sections (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=YNxCjIccPO8'],
            ['title' => 'UI/UX Refactoring of your Hero Sections (Review)', 'video_url' => 'https://www.youtube.com/watch?v=cYnJLT36Oxo'],
            ['title' => 'The UI/UX of Card Design (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=jXEn5IFxmAc'],
            ['title' => 'Who Designed the BEST UI/UX Cards?', 'video_url' => 'https://www.youtube.com/watch?v=D1TFx9iZB08'],
            ['title' => 'Learn Responsive Web Design (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=TPNheq7g1P8'],
            ['title' => 'Who made the BEST Responsive Design?', 'video_url' => 'https://www.youtube.com/watch?v=exQKEte8cmQ'],
            ['title' => 'Can you make THIS Design Responsive? (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=-QGdFPLaW_k'],
            ['title' => 'Who Designed the BEST Responsive Card?', 'video_url' => 'https://www.youtube.com/watch?v=rGheGnrcdgc'],
            ['title' => 'Designing Forms in Figma - UI/UX Challenge', 'video_url' => 'https://www.youtube.com/watch?v=EKjCC4PwjFo'],
            ['title' => 'UI/UX Form Design DO\'s and DON\'Ts! Review', 'video_url' => 'https://www.youtube.com/watch?v=I5Vz2pl8pPI'],
            ['title' => 'UI/UX Prototyping and Animation in Figma (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=Xc8zxE9pB4w'],
            ['title' => 'Who made the BEST UI Prototyping Animation?', 'video_url' => 'https://www.youtube.com/watch?v=YfsR96CgzkE'],
            ['title' => 'Using Generative AI in UI/UX Design', 'video_url' => 'https://www.youtube.com/watch?v=opMic9UdFo8'],
            ['title' => 'The World of Embellishments in UI/UX Design (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=P96IGCr93IA'],
            ['title' => 'Who made the BEST UI/UX Layout from THIS Challenge?', 'video_url' => 'https://www.youtube.com/watch?v=OiQ54LUy29E'],
            ['title' => 'The UI/UX of Light / Dark Mode Design (Challenge)', 'video_url' => 'https://www.youtube.com/watch?v=wqTZuEQ2P-s'],
            ['title' => 'It\'s time to design your portfolio - CHALLENGE!', 'video_url' => 'https://www.youtube.com/watch?v=FsYi-O9-ZVw'],
            ['title' => '6 UI/UX Design Refactors of Design Portfolios', 'video_url' => 'https://www.youtube.com/watch?v=4C43hMGm-6U'],
            ['title' => 'Designing CONSISTENT Sub Pages | UI/UX Challenge', 'video_url' => 'https://www.youtube.com/watch?v=YVdm3e1NBf4'],
            ['title' => 'Who Designed the BEST Sub Page for this Layout?', 'video_url' => 'https://www.youtube.com/watch?v=QKrglAsEgY8'],
            ['title' => 'Designing Dashboards in Figma | UI/UX Challenge', 'video_url' => 'https://www.youtube.com/watch?v=C95S7gW2-_U'],
            ['title' => 'Dashboard UI/UX Design Reviews | Who did it best?', 'video_url' => 'https://www.youtube.com/watch?v=uMQnKUIXUSI'],
            ['title' => 'Most UI/UX Designers will Fail this Challenge', 'video_url' => 'https://www.youtube.com/watch?v=d2ECtM9Ahq4'],
            ['title' => 'FINAL UI/UX Review for the 30 Day Challenge', 'video_url' => 'https://www.youtube.com/watch?v=IUTmJ_ZYDRg'],
            ['title' => 'Interactive UI/UX Crash Course', 'video_url' => 'https://www.youtube.com/watch?v=cTUD_vCrY7M'],
        ];

        $sections = [
            ['title' => 'UI/UX Fundamentals', 'videos' => array_slice($videos, 0, 3)],
            ['title' => 'Designing Website Components', 'videos' => array_slice($videos, 3, 6)],
            ['title' => 'Responsive Design and Forms', 'videos' => array_slice($videos, 9, 6)],
            ['title' => 'Advanced Techniques', 'videos' => array_slice($videos, 15, 6)],
            ['title' => 'Building a Portfolio', 'videos' => array_slice($videos, 21, 6)],
            ['title' => 'Final Challenge and Recap', 'videos' => array_slice($videos, 27, 3)],
        ];

        foreach ($sections as $sectionData) {
            $section = CourseSection::create([
                'course_id' => $course->id,
                'title' => $sectionData['title'],
            ]);

            foreach ($sectionData['videos'] as $videoData) {
                CourseLesson::create([
                    'course_section_id' => $section->id,
                    'title' => $videoData['title'],
                    'description' => $videoData['title'],
                    'video_url' => $videoData['video_url'],
                ]);
            }
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchasedCoursesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $enrolledCourses = $user->enrollments()
            ->with(['course.user', 'course.reviews', 'course' => function ($query) {
                $query->withAvg('reviews', 'rating');
            }])
            ->latest()
            ->paginate(9);

        return Inertia::render('Courses/PurchasedCourse', [
            'enrolledCourses' => $enrolledCourses,
        ]);
    }
}

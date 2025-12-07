<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchasedCoursesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role_id === 2) {
             return redirect()->route('tutor.courses.index')->with('error', 'Unauthorized action.');
        }
        if ($user->role_id === 1) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized action.');
        }

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

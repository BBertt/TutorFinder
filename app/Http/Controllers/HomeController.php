<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use App\Models\Forum;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index() {
        $user = Auth::user();

        $myCoursesQuery = Course::with('user')->withAvg('reviews', 'rating');

        // For tutor
        if ($user->role_id === 2) {
            $myCoursesQuery->where('user_id', $user->id);
            $excludeCourseIds = $myCoursesQuery->pluck('id')->toArray();
        } else {
            // For student
            $enrolledCourseIds = CourseEnrollment::where('user_id', $user->id)->pluck('course_id')->toArray();
            $myCoursesQuery->whereIn('id', $enrolledCourseIds);
            $excludeCourseIds = $enrolledCourseIds;
        }

        $myCourses = $myCoursesQuery->latest()->take(3)->get();
        $recommendedCourses = Course::with('user')
            ->withAvg('reviews', 'rating')
            ->where('status', 'published')
            ->whereNotIn('id', $excludeCourseIds)
            ->orderByDesc('reviews_avg_rating')
            ->take(3)
            ->get();

        $tutors = User::withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->take(2)->get();
        $forums = Forum::with(['user', 'replies', 'userVote'])->orderByDesc('likes')->take(2)->get();

        return Inertia::render('Home', [
            'user' => $user,
            'myCourses' => $myCourses,
            'recommendedCourses' => $recommendedCourses,
            'tutors' => $tutors,
            'forums' => $forums
        ]);
    }
}

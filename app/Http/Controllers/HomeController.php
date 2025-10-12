<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\Course;
use App\Models\User;
use App\Models\Forum;

class HomeController extends Controller
{
    public function index() {
        $user = auth()->user();
        $courses = Course::with('user')->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->take(3)->get();
        $tutors = User::withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->take(2)->get();
        $forums = Forum::with(['user', 'replies'])->orderByDesc('likes')->take(2)->get();
        
        return Inertia::render('Home', [
            'user' => $user,
            'courses' => $courses,
            'tutors' => $tutors,
            'forums' => $forums
        ]);
    }
}

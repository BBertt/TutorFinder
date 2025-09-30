<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class TutorReviewController extends Controller
{
    public function show()
    {
        $reviews = User::withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->take(2)->get();
        
        return Inertia::render('Landing', [
            'reviews' => $reviews
        ]);
    }
}

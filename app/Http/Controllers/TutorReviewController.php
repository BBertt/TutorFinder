<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TutorReview; // Import TutorReview model
use Illuminate\Http\Request; // Import Request
use Illuminate\Support\Facades\Auth; // Import Auth
use Inertia\Inertia;

class TutorReviewController extends Controller
{
    public function show()
    {
        $reviews = User::withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->take(2)->get();
        
        return Inertia::render('Landing/Landing', [
            'reviews' => $reviews
        ]);
    }

    public function store(Request $request, User $tutor)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        if ($tutor->id === Auth::id()) {
            return response()->json(['message' => 'You cannot review yourself.'], 403);
        }

        // Check if the user has already reviewed this tutor
        $existingReview = TutorReview::where('user_id', Auth::id())
                                      ->where('tutor_id', $tutor->id)
                                      ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this tutor.'], 409);
        }

        $tutorReview = new TutorReview();
        $tutorReview->user_id = Auth::id();
        $tutorReview->tutor_id = $tutor->id;
        $tutorReview->rating = $request->rating;
        $tutorReview->review = $request->review;
        $tutorReview->save();

        return response()->json(['message' => 'Tutor review submitted successfully.'], 201);
    }
}

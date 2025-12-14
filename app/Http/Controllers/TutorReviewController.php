<?php

namespace App\Http\Controllers;

use App\Models\TutorReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TutorReviewController extends Controller
{
    public function show()
    {
        $reviews = User::withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->take(2)->get();

        return Inertia::render('Landing/Landing', [
            'reviews' => $reviews,
        ]);
    }

    public function store(Request $request, User $tutor)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($tutor->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot review yourself.');
        }

        // Check if the user has already reviewed this tutor
        $existingReview = TutorReview::where('reviewer_id', Auth::id())
            ->where('tutor_id', $tutor->id)
            ->first();

        if ($existingReview) {
            return redirect()->back()->with('error', 'You have already reviewed this tutor.');
        }

        $tutorReview = new TutorReview();
        $tutorReview->reviewer_id = Auth::id();
        $tutorReview->tutor_id = $tutor->id;
        $tutorReview->rating = $request->rating;
        $tutorReview->comment = $request->comment;
        $tutorReview->save();

        return redirect()->back()->with('success', 'Tutor review submitted successfully.');
    }
}

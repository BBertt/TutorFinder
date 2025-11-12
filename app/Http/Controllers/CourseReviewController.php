<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseReviewController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Check if the user has already reviewed this course
        $existingReview = CourseReview::where('user_id', Auth::id())
                                      ->where('course_id', $course->id)
                                      ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this course.'], 409);
        }

        $courseReview = new CourseReview();
        $courseReview->user_id = Auth::id();
        $courseReview->course_id = $course->id;
        $courseReview->rating = $request->rating;
        $courseReview->comment = $request->comment;
        $courseReview->save();

        return redirect()->back()->with('success', 'Thank you for your review!');
    }
}

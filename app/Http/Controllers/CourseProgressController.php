<?php

namespace App\Http\Controllers;

use App\Models\CourseProgress;
use Illuminate\Http\Request;

class CourseProgressController extends Controller
{
    public function update(Request $request, $course_lesson_id)
    {
        $user = auth()->user();

        $progress = CourseProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'course_lesson_id' => $course_lesson_id,
            ],
            [
                'course_id' => $request->course_id,
                'is_completed' => true,
            ]
        );

        return response()->json(['success' => true]);
    }
}

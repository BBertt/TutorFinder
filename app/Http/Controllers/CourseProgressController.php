<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseProgressController extends Controller
{
    public function update(Request $request, $course_lesson_id)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        CourseProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'course_lesson_id' => $course_lesson_id,
            ],
            [
                'course_id' => $request->course_id,
                'is_completed' => true,
            ]
        );

        if ($request->is_finishing) {
            $course = Course::with('lessons')->find($request->course_id);
            $total_lessons = $course->lessons->count();
            $completed_lessons = $user->progress()->where('course_id', $request->course_id)->where('is_completed', true)->count();

            if ($total_lessons > 0 && $total_lessons === $completed_lessons) {
                return redirect()->back()->with('success', 'Congratulations on completing the course!');
            }
        }

        return response()->json(['success' => true]);
    }
}

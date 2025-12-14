<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseProgress;
use App\Models\TutorReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentCourseController extends Controller
{
    public function viewPurchased()
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

    public function learn(Course $course)
    {
        $user = Auth::user();

        if ($user->role_id === 2 && $course->user_id !== $user->id) {
            return redirect()->route('tutor.courses.index')->with('error', 'Unauthorized action.');
        }
        if ($user->role_id === 1) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized action.');
        }

        /** @var \App\Models\User $user */
        $isEnrolled = $user->enrollments()->where('course_id', $course->id)->exists();

        $isOwner = $user->id === $course->user_id;

        if (! $isEnrolled && ! $isOwner) {
            return redirect()->back()->with('error', 'You are not enrolled in this course.');
        }

        $course->load([
            'user',
            'sections.lessons',
            'sections.quiz.questions.options',
            'sections.quiz.attempts' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            },
        ]);

        $progress = $user->progress()->where('course_id', $course->id)->get();

        $lastWatched = $progress->sortByDesc('updated_at')->first();

        $hasReviewedByUser = $course->reviews()->where('user_id', $user->id)->exists();

        $hasReviewedTutor = TutorReview::where('reviewer_id', $user->id)
            ->where('tutor_id', $course->user_id)
            ->exists();

        $finalAttempts = collect();
        if ($course->finalQuiz) {
            $finalAttempts = $course->finalQuiz->attempts->where('user_id', $user->id)->values();
        }

        $courseCompleted = false;
        if ($course->finalQuiz) {
            $courseCompleted = $finalAttempts->contains(function ($a) {
                return $a->total_questions > 0 && ($a->score / $a->total_questions) >= 0.8;
            });
        } else {
            $allLessonIds = $course->sections->flatMap->lessons->pluck('id');
            $completedLessonIds = $progress->pluck('course_lesson_id');
            $courseCompleted = $allLessonIds->count() > 0 && $allLessonIds->diff($completedLessonIds)->isEmpty();
        }

        return Inertia::render('Courses/LearnCourse', [
            'course' => $course,
            'progress' => $progress,
            'last_watched_lesson_id' => $lastWatched ? $lastWatched->course_lesson_id : null,
            'has_reviewed_by_user' => $hasReviewedByUser,
            'has_reviewed_tutor' => $hasReviewedTutor,
            'course_completed' => $courseCompleted,
            'final_quiz_attempts' => $finalAttempts,
        ]);
    }

    public function complete(Request $request, Course $course)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $isEnrolled = $user->enrollments()->where('course_id', $course->id)->exists();

        $isOwner = $user->id === $course->user_id;

        if (! $isEnrolled && ! $isOwner) {
            return redirect()->back()->with('error', 'You are not enrolled in this course.');
        }

        $course->load('sections.lessons');
        $hasFinalQuiz = (bool) $course->finalQuiz;
        if ($hasFinalQuiz) {
            return redirect()->back();
        }

        return redirect()->back()->with('success', 'Course completed!');
    }

    public function updateProgress(Request $request, $course_lesson_id)
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

        return redirect()->back();
    }
}

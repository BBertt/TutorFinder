<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\TransactionHeader;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Course::with('user')->withAvg('reviews', 'rating');
        $query->where('status', 'published');

        if (request('search')) {
            $query->where('title', 'like', '%'.request('search').'%')
                ->orWhereHas('user', function (Builder $query) {
                    $query->where('first_name', 'like', '%'.request('search').'%')
                        ->orWhere('last_name', 'like', '%'.request('search').'%');
                });
        }

        if (request('category')) {
            $query->where('category_id', '=', request('category'));
        }

        $courses = $query->latest()->paginate(6);

        return Inertia::render('Courses/CourseList', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load('user', 'category', 'reviews.user', 'sections.lessons');

        $isEnrolled = false;
        if (Auth::check()) {
            $user = Auth::user();
            /** @var \App\Models\User $user */
            $isEnrolled = $user->enrollments()->where('course_id', $course->id)->exists();
        }

        $hasPendingTransaction = false;
        if (Auth::check()) {
            $hasPendingTransaction = TransactionHeader::where('user_id', Auth::id())
                ->where('status', 'pending')
                ->whereHas('details', function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })
                ->exists();
        }

        return Inertia::render('Courses/CourseDetails', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'hasPendingTransaction' => $hasPendingTransaction,
        ]);
    }

    public function learn(Course $course)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $isEnrolled = $user->enrollments()->where('course_id', $course->id)->exists();

        if (! $isEnrolled) {
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
            'course_completed' => $courseCompleted,
            'final_quiz_attempts' => $finalAttempts,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        //
    }

    public function complete(Request $request, Course $course)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $isEnrolled = $user->enrollments()->where('course_id', $course->id)->exists();
        if (! $isEnrolled) {
            return redirect()->back()->with('error', 'You are not enrolled in this course.');
        }

        $course->load('sections.lessons');
        $hasFinalQuiz = (bool) $course->finalQuiz;
        if ($hasFinalQuiz) {
            return redirect()->back();
        }

        return redirect()->back()->with('success', 'Course completed!');
    }
}

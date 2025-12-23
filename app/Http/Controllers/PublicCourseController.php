<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseCart;
use App\Models\TransactionHeader;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role_id === 2) {
                return redirect()->route('tutor.courses.index')
                    ->with('error', 'Tutors cannot access the course catalog.');
            }
            if ($user->role_id === 1) {
                return redirect()->route('dashboard')
                    ->with('error', 'Unauthorized action.');
            }
        }
        $query = Course::with('user')->withAvg('reviews', 'rating');
        $query->where('status', 'published');

        if (request('search')) {
            $query->where('title', 'like', '%' . request('search') . '%')
                ->orWhereHas('user', function (Builder $query) {
                    $query->where('first_name', 'like', '%' . request('search') . '%')
                        ->orWhere('last_name', 'like', '%' . request('search') . '%');
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
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role_id === 2 && $user->id !== $course->user_id) {
                return redirect()->route('tutor.courses.index')
                    ->with('error', 'Unauthorized action.');
            }
            if ($user->role_id === 1) {
                return redirect()->route('dashboard')
                    ->with('error', 'Unauthorized action.');
            }
        }

        $course->load([
            'user',
            'category',
            'sections.lessons',
        ]);

        $reviews = $course->reviews()
        ->with('user')
        ->orderByDesc('rating')
        ->paginate(10);

        $isEnrolled = false;
        $isInCart = false; // 2. Initialize isInCart
        $hasPendingTransaction = false;
        $isTutor = false;

        if (Auth::check()) {
            $user = Auth::user();
            /** @var \App\Models\User $user */
            $isEnrolled = $user->enrollments()->where('course_id', $course->id)->exists();

            $isInCart = CourseCart::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->exists();

            // Check pending transactions
            $hasPendingTransaction = TransactionHeader::where('user_id', $user->id)
                ->where('status', 'pending')
                ->whereHas('details', function ($q) use ($course) {
                    $q->where('course_id', $course->id);
                })
                ->exists();
            
            // Check is tutor
            if ($user->role_id === 2) {
                $isTutor = true;
            }
        }

        return Inertia::render('Courses/CourseDetails', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'isInCart' => $isInCart,
            'hasPendingTransaction' => $hasPendingTransaction,
            'isTutor' => $isTutor,
            'reviews' => $reviews
        ]);
    }
}

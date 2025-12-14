<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('home', absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }

    /**
     * Display the email verification prompt.
     */
    public function show(Request $request): RedirectResponse|Response
    {
        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('home', absolute: false))
                    : Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verify(Request $request): RedirectResponse
    {
        $user = User::find($request->route('id'));

        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return redirect()->route('login')->with('error', 'Invalid verification link.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('success', 'Email already verified.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            // Assign 3 random courses to the user
            $randomCourses = Course::inRandomOrder()->limit(3)->get();
            foreach ($randomCourses as $course) {
                CourseEnrollment::create([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'enrollment_date' => now(),
                ]);
            }
        }

        Auth::login($user);

        return redirect()->route('home', ['verified' => 1]);
    }
}

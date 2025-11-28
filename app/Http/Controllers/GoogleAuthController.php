<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())->first();

            if (! $user) {
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'email_verified_at' => now(),
                    ]);
                } else {
                    $user = User::create([
                        'google_id' => $googleUser->getId(),
                        'first_name' => $googleUser->user['given_name'],
                        'last_name' => $googleUser->user['family_name'],
                        'email' => $googleUser->getEmail(),
                        'profile_image_path' => $googleUser->getAvatar(),
                        'email_verified_at' => now(),
                        'role_id' => 3, // Default to student role
                    ]);

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
            }

            Auth::login($user);

            if ($user->role->name === 'admin') {
                return redirect()->route('dashboard');
            }

            return redirect()->route('home');

        } catch (\Exception $e) {
            Log::error('Google Auth Callback Error: '.$e->getMessage());

            return redirect('/')->with('error', 'Login with Google failed. Please try again.');
        }
    }
}

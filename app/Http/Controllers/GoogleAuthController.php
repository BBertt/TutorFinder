<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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

            // Find user by google_id first
            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                // If user exists with google_id, update their info
                $user->update([
                    'first_name' => $googleUser->user['given_name'],
                    'last_name' => $googleUser->user['family_name'],
                    'profile_image_path' => $googleUser->getAvatar(),
                ]);
            } else {
                // If no user with google_id, find by email
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    // If user exists with email, update their google_id
                    $user->update(['google_id' => $googleUser->getId()]);
                } else {
                    // If no user exists at all, create a new one
                    $user = User::create([
                        'google_id' => $googleUser->getId(),
                        'first_name' => $googleUser->user['given_name'],
                        'last_name' => $googleUser->user['family_name'],
                        'email' => $googleUser->getEmail(),
                        'profile_image_path' => $googleUser->getAvatar(),
                        'email_verified_at' => now(),
                        'role_id' => 3, // Default to student role
                    ]);
                }
            }

            // Log the user in
            Auth::login($user);

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            // Log the actual error for debugging
            Log::error('Google Auth Callback Error: ' . $e->getMessage());
            return redirect('/')->with('error', 'Login with Google failed. Please try again.');
        }
    }
}

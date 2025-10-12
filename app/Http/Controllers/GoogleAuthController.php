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

            $user = User::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    $user->update(['google_id' => $googleUser->getId()]);
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
                }
            }

            Auth::login($user);

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            Log::error('Google Auth Callback Error: ' . $e->getMessage());
            return redirect('/')->with('error', 'Login with Google failed. Please try again.');
        }
    }
}

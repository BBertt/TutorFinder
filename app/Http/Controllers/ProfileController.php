<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        /** @var \App\Models\User $user */

        $user->load('role');

        $reviews = null;
        if ($user->role_id === 2) {
            $reviews = $user->reviews()->with('reviewer')->orderByDesc('rating')->paginate(10);
        }

        return Inertia::render('Profile', [
            'auth' => [
                'user' => $user, 
                'reviews' => $reviews
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($request->hasFile('profileImage')) {
            $user->profile_image_path = $request->file('profileImage')->store('profile');
        }

        $user->first_name = $request->firstName;
        $user->last_name = $request->lastName;
        $user->phone_number = $request->phoneNumber;
        $user->date_of_birth = $request->dateOfBirth;
        $user->bio = $request->bio;

        $user->save();

        return back()->with('success', 'Profile updated!');
    }
}

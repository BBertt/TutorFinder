<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = auth();
        /** @var \App\Models\User $user */

        return Inertia::render('Profile', [
            'auth' => [
                'user' => $user->user()->load('role'),
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

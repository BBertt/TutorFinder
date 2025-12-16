<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request) {
        $isTransactionPage = $request->is('users/transactions');

        $roles = $isTransactionPage ? ['student'] : ['student', 'tutor'];

        $users = User::with('role')
            ->whereHas('role', fn($q) => $q->whereIn('name', $roles))
            ->paginate(10);

        return Inertia::render(
            $isTransactionPage ? 'Admin/UserTransactionSelection' : 'Admin/Users',
            ['users' => $users]
        );
    }

    public function edit(User $user) {
        $user->load('role');
        return Inertia::render('Admin/UserEdit', ['user' => $user]);
    }

    public function update(ProfileUpdateRequest $request, User $user) : RedirectResponse {
        if ($request->hasFile('profileImage')) {
            $user->profile_image_path = $request->file('profileImage')->store('profile');
        }

        $user->first_name = $request->firstName;
        $user->last_name = $request->lastName;
        $user->phone_number = $request->phoneNumber;
        $user->date_of_birth = $request->dateOfBirth;
        $user->bio = $request->bio;

        $user->save();

        return redirect()->route('admin.users')->with('success', 'User updated!');
    }

    public function destroy(User $user) {
        $user->delete();
        return back()->with('success', 'User deleted successfully!');
    }
}

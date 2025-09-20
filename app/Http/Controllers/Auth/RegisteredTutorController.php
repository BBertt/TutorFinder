<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\TutorRegisterRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;

class RegisteredTutorController extends Controller
{
    public function create(): Response {
        return Inertia::render('Auth/TutorRegister');
    }

    public function store(TutorRegisterRequest $request): RedirectResponse {
        $tutor = User::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phoneNumber,
            'gender' => $request->gender,
            'date_of_birth' => $request->dateOfBirth,
            'role_id' => 2, // default role_id for tutor
        ]);

        event(new Registered($tutor));

        Auth::login($tutor);

        return redirect(route('home', absolute: false));
    }
}

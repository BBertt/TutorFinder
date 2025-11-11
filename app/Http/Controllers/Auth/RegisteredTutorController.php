<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\TutorRegisterRequest;
use App\Models\TutorRegistration;
use Carbon\Carbon;
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
            'role_id' => 2, // default role_id for tutor,
            'identification_image_path' => $request->file('identificationImage')->store('identification'),
            'certification_image_path' => $request->file('certificationImage')->store('certification'),
            'email_verified_at' => Carbon::now()
        ]);

        TutorRegistration::create([
            'user_id' => $tutor->id
        ]);

        event(new Registered($tutor));

        return redirect(route('login', absolute: false))->with('success', 'Registration successful! Please wait for approval.');
    }
}

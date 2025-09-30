<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Inertia\Inertia;

class TutorRegistrationController extends Controller
{
    public function index() {
        $tutors = User::whereHas('tutorRegistration', function (Builder $query) {
            $query->where('status', '=', 'pending');
        })->get();

        return Inertia::render('Admin/Tutors', [
            'tutors' => $tutors
        ]);
    }

    public function approve(User $tutor) {
        $registration = $tutor->tutorRegistration;
        $registration->status = 'approved';
        $registration->save();
        return back()->with('success', 'Tutor approved successfully!');
    }

    public function reject(User $tutor) {
        $tutor->delete();
        return back()->with('success', 'Tutor rejected successfully!');
    }
}

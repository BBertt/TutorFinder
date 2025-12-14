<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class TutorController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(User $tutor)
    {
        if ($tutor->role_id !== 2) {
            abort(404);
        }

        $tutor->load([
            'courses' => fn($q) => $q->with('user')->withAvg('reviews', 'rating')->latest(),
            'reviews' => fn($q) => $q->with('reviewer')->latest(),
        ]);

        return Inertia::render('Tutor/TutorProfile', [
            'tutor' => $tutor,
        ]);
    }
}

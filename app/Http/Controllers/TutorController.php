<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $tutor)
    {
        if ($tutor->role_id !== 2) {
            abort(404);
        }

        $tutor->load([
            'courses' => fn ($q) => $q->with('user')->withAvg('reviews', 'rating')->latest(),
            'reviews' => fn ($q) => $q->with('reviewer')->latest()
        ]);

        return Inertia::render('Tutor/TutorProfile', [
            'tutor' => $tutor
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}

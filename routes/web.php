<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TutorReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TutorRegistrationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::get('/landing', [TutorReviewController::class, 'show'])
->middleware('guest')->name('landing');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware('admin')->group(function() {
    Route::get('/dashboard', function() {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/tutors', [TutorRegistrationController::class, 'index'])->name('admin.tutors');
    Route::patch('/tutors/{tutor}/approve', [TutorRegistrationController::class, 'approve'])->name('admin.tutors.approve');
    Route::patch('/tutors/{tutor}/reject', [TutorRegistrationcOntroller::class, 'reject'])->name('admin.tutors.reject');
});

require __DIR__.'/auth.php';

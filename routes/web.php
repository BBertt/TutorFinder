<?php

use App\Http\Controllers\CourseCartController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TutorRegistrationController;
use App\Http\Controllers\TutorController;
use App\Http\Controllers\TutorReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.auth.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.auth.callback');

Route::post('/webhooks/xendit', [WebhookController::class, 'handleXendit'])->name('webhooks.xendit');

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

Route::get('/', function () {
    return redirect('/landing');
});
Route::middleware('guest')->group(function() {
    Route::get('/landing', [TutorReviewController::class, 'show'])->name('landing');
    Route::get('/about', function() {
        return Inertia::render('Landing/About');
    })->name('about');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Courses
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');

    // Tutor Profile
    Route::get('/tutors/{tutor}', [TutorController::class, 'show'])->name('tutors.show');

    // Cart
    Route::get('/cart', [CourseCartController::class, 'show'])->name('cart.show');
    Route::post('/cart', [CourseCartController::class, 'store'])->name('cart.store');

    // Transaction
    Route::post('/cart/checkout', [TransactionController::class, 'checkout'])->name('checkout');

    Route::get('/transaction/success', [TransactionController::class, 'success'])->name('transaction.success');
    Route::get('/transaction/failure', [TransactionController::class, 'failure'])->name('transaction.failure');
});

Route::middleware('admin')->group(function() {
    Route::get('/dashboard', function() {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::post('/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('/tutors', [TutorRegistrationController::class, 'index'])->name('admin.tutors');
    Route::patch('/tutors/{tutor}/approve', [TutorRegistrationController::class, 'approve'])->name('admin.tutors.approve');
    Route::patch('/tutors/{tutor}/reject', [TutorRegistrationController::class, 'reject'])->name('admin.tutors.reject');
});

Route::get('/transaction/success', [TransactionController::class, 'success'])->name('transaction.success');
Route::get('/transaction/failure', [TransactionController::class, 'failure'])->name('transaction.failure');

require __DIR__.'/auth.php';

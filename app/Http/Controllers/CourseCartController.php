<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseCart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CourseCartController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $course = Course::findOrFail($request->course_id);

        CourseCart::firstOrCreate([
            'user_id' => Auth::id(),
            'course_id' => $course->id,
        ]);

        return redirect()->back()->with('success', 'Course added to cart successfully.');
    }

    public function destroy(CourseCart $cartItem)
    {
        // Ensure the user owns the cart item
        if ($cartItem->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }

    public function show()
    {
        $user = User::with('role')->find(Auth::id());
        $cartItems = CourseCart::where('user_id', $user->id)->with('course.user')->get();

        return Inertia::render('Transaction/Cart', [
            'cartItems' => $cartItems,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

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

        return Redirect::back()->with('success', 'Course added to cart!');
    }
}

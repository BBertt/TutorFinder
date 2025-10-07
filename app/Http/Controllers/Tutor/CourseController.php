<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a list of the authenticated tutor's courses.
     */
    public function index()
    {
        $courses = Auth::user()->courses()
            ->withAvg('reviews', 'rating')
            ->latest()
            ->paginate(6);

        return Inertia::render('Tutor/ManageCourses', [
            'courses' => $courses
        ]);
    }

    /**
     * Show the form to create a new course.
     */
    public function create()
    {
        return Inertia::render('Tutor/CourseForm', [
            'categories' => Category::all()
        ]);
    }

    /**
     * Store a new course in the database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'student_outcome' => 'required|string',
            'requirements' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'thumbnail_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'intro_video' => 'nullable|mimetypes:video/mp4,video/quicktime|max:20480',
        ]);

        $course = new Course();
        $course->user_id = Auth::id();
        $course->title = $request->title;
        $course->description = $request->description;
        $course->student_outcome = $request->student_outcome;
        $course->requirements = $request->requirements;
        $course->price = $request->price;
        $course->category_id = $request->category_id;
        $course->status = 'draft';

        if ($request->hasFile('thumbnail_image')) {
            // This uses the default disk, just like your ProfileController.
            $course->thumbnail_image = $request->file('thumbnail_image')->store('course-thumbnails');
        }

        if ($request->hasFile('intro_video')) {
            $course->intro_video = $request->file('intro_video')->store('course-intros', 's3');
        }

        $course->save();

        return redirect()->route('tutor.courses.index')->with('success', 'Course saved as draft.');
    }

    /**
     * Show the form to edit an existing course.
     */
    public function edit(Course $course)
    {
        if ($course->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Tutor/CourseForm', [
            'course' => $course,
            'categories' => Category::all()
        ]);
    }

    /**
     * Update an existing course.
     */
    public function update(Request $request, Course $course)
    {
        if ($course->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'student_outcome' => 'required|string',
            'requirements' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'thumbnail_image' => 'nullable|image|max:2048',
        ]);


        $course->title = $request->title;
        $course->description = $request->description;
        $course->student_outcome = $request->student_outcome;
        $course->requirements = $request->requirements;
        $course->price = $request->price;
        $course->category_id = $request->category_id;

        if ($request->hasFile('thumbnail_image')) {

            if ($course->thumbnail_image) {
                Storage::delete($course->thumbnail_image);
            }
            $course->thumbnail_image = $request->file('thumbnail_image')->store('course-thumbnails');
        }

        $course->save();

        return redirect()->route('tutor.courses.index')->with('success', 'Course updated successfully.');
    }

    /**
     * Delete a course.
     */
    public function destroy(Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }

        if ($course->thumbnail_image) {
            Storage::delete($course->thumbnail_image);
        }

        $course->delete();

        return redirect()->route('tutor.courses.index')->with('success', 'Course deleted successfully.');
    }
}

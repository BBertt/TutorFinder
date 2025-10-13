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
    public function index(Request $request)
    {
        $request->validate(['status' => 'in:draft,published']);
        $status = $request->input('status', 'draft');
        $courses = Auth::user()->courses()->where('status', $status)->with('user')->withAvg('reviews', 'rating')->latest()->paginate(6);
        return Inertia::render('Tutor/ManageCourses', ['courses' => $courses, 'filters' => ['status' => $status]]);
    }

    /**
     * Show the form to create a new course.
     */
    public function create()
    {
        return Inertia::render('Tutor/CourseForm', [
            'categories' => Category::all(),
            'course' => null
        ]);
    }

    /**
     * Store a new course in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'student_outcome' => 'required|string',
            'requirements' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'thumbnail_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'intro_video' => 'nullable|mimetypes:video/mp4,video/quicktime|max:20480',
        ]);

        $course = new Course($request->except(['thumbnail_image', 'intro_video']));
        $course->user_id = Auth::id();
        $course->status = 'draft';

        if ($request->hasFile('thumbnail_image')) {
            $course->thumbnail_image = $request->file('thumbnail_image')->store('course-thumbnails');
        }
        if ($request->hasFile('intro_video')) {
            $course->intro_video = $request->file('intro_video')->store('course-intros');
        }

        $course->save();

        if ($request->input('action') === 'save_and_continue') {

            return redirect()->route('tutor.courses.edit', $course->id)
                ->with('success', 'Overview saved. Now build your curriculum.')
                ->with('from_create', true);
        }

        return redirect()->route('tutor.courses.index')->with('success', 'Course saved as draft.');
    }

    /**
     * Show the form to edit an existing course.
     */
     public function edit(Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }

        $course->load(['sections.lessons', 'category']);

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
            'intro_video' => 'nullable|mimetypes:video/mp4,video/quicktime|max:20480',
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

        if ($request->hasFile('intro_video')) {
            if ($course->intro_video) {
                Storage::delete($course->intro_video);
            }
            $course->intro_video = $request->file('intro_video')->store('course-intros');
        }

        $course->save();

        $course->load(['sections.lessons', 'category']);

        if ($request->input('action') === 'save_and_exit') {
            return redirect()->route('tutor.courses.index')->with('success', 'Course updated successfully.');
        }

        return back()->with('success', 'Changes saved.');
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

    public function publish(Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }

        $course->update(['status' => 'published']);

        return redirect()->route('tutor.courses.index')->with('success', 'Congratulations! Your course is now live.');
    }
}

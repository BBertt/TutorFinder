<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\CourseLesson;
use App\Models\CourseSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CourseLessonController extends Controller
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
    public function store(Request $request, CourseSection $section)
    {
        if ($section->course->user_id !== auth()->id()) { abort(403); }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'video' => 'nullable|mimetypes:video/mp4,video/quicktime',
        ]);

        if ($request->hasFile('video')) {
            $validated['video_url'] = $request->file('video')->store('course-lessons');
        }
        // video_url from YouTube is already in $validated
        $section->lessons()->create($validated);

        return back()->with('success', 'Lesson added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseLesson $courseLesson)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseLesson $courseLesson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseSection $section, CourseLesson $lesson)
    {
        if($section->course->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'video' => 'nullable|mimetypes:video/mp4,video/quicktime',
            'video_url' => 'nullable|string|regex:/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[&#?].*)?$/',
        ]);

        if($request->hasFile('video')){
            if($lesson->video_url && str_starts_with($lesson->video_url, 'course-lessons')){
                Storage::delete($lesson->video_url);
            }
            $validated['video_url'] = $request->file('video')->store('course-lessons');
        }

        $lesson->update($validated);

        return back()->with('success', 'Lesson updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseSection $section, CourseLesson $lesson)
    {
        if ($section->course->user_id !== auth()->id()) {
            abort(403);
        }

        if ($lesson->video_url) {
            Storage::delete($lesson->video_url);
        }

        $lesson->delete();
        return back()->with('success', 'Lesson deleted.');
    }
}

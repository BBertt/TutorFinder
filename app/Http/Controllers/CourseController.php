<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Course::with('user')->withAvg('reviews', 'rating');
        $query->where('status', 'published');

        if(request('search')) {
            $query->where('title', 'like', '%' . request('search') . '%')
                  ->orWhereHas('user', function (Builder $query) {
                    $query->where('first_name', 'like', '%' . request('search') . '%')
                          ->orWhere('last_name', 'like', '%' . request('search') . '%');
                    });
        }

        if (request('category')) {
            $query->where('category_id', '=', request('category'));
        }

        $courses = $query->latest()->paginate(6);

        return Inertia::render('Courses/CourseList', [
            'courses' => $courses,
        ]);
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
    public function show(Course $course)
    {
        $course->load('user', 'category', 'reviews.user', 'sections.lessons');

        return Inertia::render('Courses/CourseDetails', [
            'course' => $course,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        //
    }
}

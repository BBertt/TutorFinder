<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizQuestionOption;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['status' => 'in:draft,published']);
        $status = $request->input('status', 'draft');
        $courses = Auth::user()->courses()->where('status', $status)->with('user')->withAvg('reviews', 'rating')->latest()->paginate(6)->withQueryString();
        return Inertia::render('Tutor/ManageCourses', ['courses' => $courses, 'filters' => ['status' => $status]]);
    }

    public function create()
    {
        return Inertia::render('Tutor/CourseForm', [
            'categories' => Category::all(),
            'course' => null
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateFullCourse($request);
        $this->createOrUpdateCourse($validated, $request);
        return redirect()->route('tutor.courses.index')->with('success', 'Course created successfully!');
    }

    public function edit(Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }
        $course->load(['sections.lessons', 'category']);
        return Inertia::render('Tutor/CourseForm', [
            'course' => $course,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }
        $validated = $this->validateFullCourse($request, $course);
        $this->createOrUpdateCourse($validated, $request, $course);
        return redirect()->route('tutor.courses.index')->with('success', 'Course updated successfully!');
    }

    public function publish(Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }
        $course->update(['status' => 'published']);
        return redirect()->route('tutor.courses.index')->with('success', 'Course published!');
    }

    public function destroy(Course $course)
    {
        if ($course->user_id !== Auth::id()) { abort(403); }
        if ($course->thumbnail_image) { Storage::delete($course->thumbnail_image); }
        if ($course->intro_video) { Storage::delete($course->intro_video); }
        $course->delete();
        return redirect()->route('tutor.courses.index')->with('success', 'Course deleted.');
    }


    private function validateFullCourse(Request $request, Course $course = null): array
    {
        $isNew = $course === null;
        $status = $request->input('status');

        return $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'student_outcome' => 'required|string',
            'requirements' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published',

            'thumbnail_image' => $isNew ? 'required|image' : 'nullable|image',
            'intro_video' => 'nullable',

            'sections' => ['nullable', 'array', Rule::when($status === 'published', 'min:1', 'nullable')],

            'sections.*.id' => 'nullable|string',
            'sections.*.title' => 'required_with:sections|string|max:255',
            'sections.*.description' => 'nullable|string',

            'sections.*.lessons' => ['present', 'array', Rule::when($status === 'published', 'min:1', 'nullable')],
            'sections.*.lessons.*.id' => 'nullable|string',
            'sections.*.lessons.*.title' => [Rule::when($status === 'published', 'required', 'nullable'), 'string', 'max:255'],
            'sections.*.lessons.*.description' => [Rule::when($status === 'published', 'required', 'nullable'), 'string'],
            'sections.*.lessons.*.video' => ['nullable', 'file', 'mimetypes:video/mp4,video/quicktime'],
            'sections.*.lessons.*.video_url' => ['nullable','string','regex:/^(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/watch\\?v=|youtu\\.be\\/)[A-Za-z0-9_-]{11}(?:[&#?].*)?$/'],
        ]);
    }

    private function createOrUpdateCourse(array $validated, Request $request, Course $course = null)
    {
        $isNew = $course === null;

        DB::transaction(function () use ($validated, $request, $isNew, &$course) {

            $courseData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'student_outcome' => $validated['student_outcome'],
                'requirements' => $validated['requirements'],
                'price' => $validated['price'],
                'category_id' => $validated['category_id'],
                'status' => $validated['status'],
                'user_id' => Auth::id(),
                
            ];

            if ($request->hasFile('thumbnail_image')) {
                if (!$isNew && $course->thumbnail_image) { Storage::delete($course->thumbnail_image); }
                $courseData['thumbnail_image'] = $request->file('thumbnail_image')->store('course-thumbnails');
            }
            if ($request->hasFile('intro_video')) {
                if (!$isNew && $course->intro_video && str_starts_with($course->intro_video,'course-intros')) { Storage::delete($course->intro_video); }
                $courseData['intro_video'] = $request->file('intro_video')->store('course-intros');
            } else {
                $yt = $request->input('intro_video');
                if ($yt && preg_match('/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}/',$yt)) {
                    $courseData['intro_video'] = $yt;
                }
            }

            $course = Course::updateOrCreate(['id' => $isNew ? null : $course->id], $courseData);

            $sectionIds = [];
            if (!empty($validated['sections'])) {
                foreach ($validated['sections'] as $s_index => $sectionData) {
                    $section = $course->sections()->updateOrCreate(
                        ['id' => $sectionData['id'] ?? 0],
                        ['title' => $sectionData['title'], 'description' => $sectionData['description'] ?? '']
                    );
                    $sectionIds[] = $section->id;

                    // Optional section quiz
                    $quizTitle = $request->input("sections.$s_index.quiz_title");
                    $quizPayload = $request->input("sections.$s_index.quiz.questions", []);
                    if ($quizTitle) {
                        $quiz = $section->quiz()->updateOrCreate([], [
                            'title' => $quizTitle,
                            'description' => '',
                            'course_section_id' => $section->id,
                        ]);
                        // Sync questions/options (simple replace)
                        if (is_array($quizPayload)) {
                            $quiz->questions()->delete();
                            foreach ($quizPayload as $qData) {
                                if (!empty($qData['question'])) {
                                    $question = $quiz->questions()->create(['question' => $qData['question']]);
                                    foreach ($qData['options'] ?? [] as $optData) {
                                        if (!empty($optData['option'])) {
                                            $question->options()->create([
                                                'option' => $optData['option'],
                                                'is_correct' => !empty($optData['is_correct']),
                                            ]);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if ($section->quiz) { $section->quiz->delete(); }
                    }

                    $lessonIds = [];
                    if (isset($sectionData['lessons']) && is_array($sectionData['lessons'])) {
                        foreach ($sectionData['lessons'] as $l_index => $lessonData) {
                            $inputVideoUrl = $request->input("sections.$s_index.lessons.$l_index.video_url");
                            $lesson = $section->lessons()->updateOrCreate(
                                ['id' => $lessonData['id'] ?? 0],
                                [
                                    'title' => $lessonData['title'],
                                    'description' => $lessonData['description'],
                                    'video_url' => $inputVideoUrl ?? ($lessonData['video_url'] ?? null),
                                ]
                            );
                            $lessonIds[] = $lesson->id;

                            $videoFileKey = "sections.{$s_index}.lessons.{$l_index}.video";
                            if ($request->hasFile($videoFileKey)) {
                                if ($lesson->video_url) { Storage::delete($lesson->video_url); }
                                $lesson->video_url = $request->file($videoFileKey)->store('course-lessons');
                                $lesson->save();
                            }
                        }
                    }
                    $section->lessons()->whereNotIn('id', $lessonIds)->delete();
                }
            }

            if (!$isNew) {
                 $course->sections()->whereNotIn('id', $sectionIds)->delete();
            }

            // Optional final quiz + questions
            $finalQuizTitle = $request->input('final_quiz_title');
            $finalQuizPayload = $request->input('final_quiz.questions', []);
            if ($finalQuizTitle) {
                $final = $course->finalQuiz;
                if ($final) {
                    $final->update(['title' => $finalQuizTitle, 'description' => '']);
                } else {
                    $final = $course->quizzes()->create(['title' => $finalQuizTitle, 'description' => '', 'course_id' => $course->id]);
                }
                if (is_array($finalQuizPayload)) {
                    $final->questions()->delete();
                    foreach ($finalQuizPayload as $qData) {
                        if (!empty($qData['question'])) {
                            $question = $final->questions()->create(['question' => $qData['question']]);
                            foreach ($qData['options'] ?? [] as $optData) {
                                if (!empty($optData['option'])) {
                                    $question->options()->create([
                                        'option' => $optData['option'],
                                        'is_correct' => !empty($optData['is_correct']),
                                    ]);
                                }
                            }
                        }
                    }
                }
            } else {
                if ($course->finalQuiz) { $course->finalQuiz->delete(); }
            }
        });
    }
}

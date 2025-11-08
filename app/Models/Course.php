<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'student_outcome',
        'requirements',
        'price',
        'status',
        'thumbnail_image',
        'intro_video',
    ];
    protected $appends = ['thumbnail_image_url', 'intro_video_url', 'finalQuiz'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sections()
    {
        return $this->hasMany(CourseSection::class);
    }

    public function reviews()
    {
        return $this->hasMany(CourseReview::class);
    }

    public function getFinalQuizAttribute()
    {
        return Quiz::where('course_id', $this->id)
            ->whereNull('course_section_id')
            ->with('questions.options', 'attempts')
            ->first();
    }

    public function lessons()
    {
        return $this->hasManyThrough(CourseLesson::class, CourseSection::class);
    }

    public function getThumbnailImageUrlAttribute()
    {
        $path = $this->thumbnail_image;

        if (!$path) {
            return '/assets/images/landing/books.png';
        }

        if (str_starts_with($path, 'course-thumbnails')) {
            Log::debug("[Course.php] - Using storage path for thumbnail image: " . $path);
            return Storage::url($path);
        }

        Log::debug("[Course.php] - Using raw path for thumbnail image: " . $path);
        return '/' . ltrim($path, '/');
    }

     public function getIntroVideoUrlAttribute()
    {
        $path = $this->intro_video;

        if (!$path) {
            return null;
        }
        if (str_starts_with($path, 'course-intros')) {
            Log::debug("[Course.php] - Using storage path for intro video: " . $path);
            return Storage::url($path);
        }
        Log::debug("[Course.php] - Using raw path for intro video: " . $path);
        return '/' . ltrim($path, '/');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CourseLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_section_id',
        'title',
        'description',
        'video_url',
    ];

    protected $appends = ['s3_video_url'];

    public function getS3VideoUrlAttribute(): ?string
    {
        if ($this->video_url) {
            if (str_ends_with($this->video_url, '.mp4')) {
                return Storage::url($this->video_url);
            }
        }

        return null;
    }

    public function courseSection()
    {
        return $this->belongsTo(CourseSection::class);
    }
}

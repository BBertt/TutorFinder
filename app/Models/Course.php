<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
    protected $appends = ['thumbnail_image_url'];

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

    public function getThumbnailImageUrlAttribute()
    {
        if ($this->thumbnail_image) {
            return Storage::url($this->thumbnail_image);
        }

        return '/assets/images/landing/books.png';
    }
}

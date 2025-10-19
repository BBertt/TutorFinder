<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role_id',
        'phone_number',
        'gender',
        'date_of_birth',
        'profile_image_path',
        'identification_image_path',
        'certification_image_path',
        'bio',
        'google_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'profile_image_path'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['profile_image_url', 'identification_image_url', 'certification_image_url'];

    /**
     * Get the full URL for the user's profile image.
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        if ($this->profile_image_path) {
            if (str_starts_with($this->profile_image_path, 'http')) {
                return $this->profile_image_path;
            }
            return Storage::url($this->profile_image_path);
        }

        return null;
    }

    /**
     * Get the full URL for the user's identification image.
     */
    public function getIdentificationImageUrlAttribute(): ?string
    {
        if ($this->identification_image_path) {
            if (str_starts_with($this->identification_image_path, 'http')) {
                return $this->identification_image_path;
            }
            return Storage::url($this->identification_image_path);
        }

        return null;
    }

    /**
     * Get the full URL for the user's identification image.
     */
    public function getCertificationImageUrlAttribute(): ?string
    {
        if ($this->certification_image_path) {
            if (str_starts_with($this->certification_image_path, 'http')) {
                return $this->certification_image_path;
            }
            return Storage::url($this->certification_image_path);
        }

        return null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's role.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function reviews() {
        return $this->hasMany(TutorReview::class, 'tutor_id', 'id');
    }

    public function tutorRegistration() {
        return $this->hasOne(TutorRegistration::class, 'user_id', 'id');
    }

    public function courses() {
        return $this->hasMany(Course::class, 'user_id', 'id');
    }

    public function enrollments() {
        return $this->hasMany(CourseEnrollment::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Forum extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'likes',
        'dislikes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(ForumReply::class)->whereNull('parent_id');
    }

    public function allReplies()
    {
        return $this->hasMany(ForumReply::class);
    }

    public function votes()
    {
        return $this->morphMany(ForumVote::class, 'voteable');
    }

    public function userVote()
    {
        return $this->morphOne(ForumVote::class, 'voteable')->where('user_id', Auth::id());
    }
}

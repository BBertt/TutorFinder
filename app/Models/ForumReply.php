<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ForumReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'forum_id',
        'parent_id',
        'description',
        'likes',
        'dislikes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function parent()
    {
        return $this->belongsTo(ForumReply::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(ForumReply::class, 'parent_id');
    }

    public function allChildren()
    {
        return $this->children()->with(['user', 'userVote', 'allChildren']);
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

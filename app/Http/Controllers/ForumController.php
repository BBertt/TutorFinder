<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreForumRequest;
use App\Models\Forum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ForumController extends Controller
{
     public function index()
    {
        $forums = Forum::with('user', 'replies')->latest()->paginate(10);

        $baseQuery = User::query()
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.profile_image_path', DB::raw('SUM(COALESCE(forums.likes, 0) + COALESCE(forum_replies.likes, 0)) as total_likes'))
            ->leftJoin('forums', 'users.id', '=', 'forums.user_id')
            ->leftJoin('forum_replies', 'users.id', '=', 'forum_replies.user_id')
            ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.profile_image_path')
            ->orderByDesc('total_likes')
            ->limit(7);

        $topStudents = (clone $baseQuery)->where('role_id', 3)->get();
        $topTutors = (clone $baseQuery)->where('role_id', 2)->get();

        return Inertia::render('Forums/ForumIndex', [
            'forums' => $forums,
            'topStudents' => $topStudents,
            'topTutors' => $topTutors,
        ]);
    }

    public function show(Forum $forum)
    {
        $forum->load(['user', 'replies.user', 'replies.children.user']);
        return Inertia::render('Forums/ForumDetails', [
            'forum' => $forum
        ]);
    }

    public function create()
    {
        return Inertia::render('Forums/CreateForum');
    }

    public function store(StoreForumRequest $request)
    {
        $validated = $request->validated();

        Forum::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'likes' => 0,
            'dislikes' => 0,
        ]);

        return redirect()->route('forums.index')->with('success', 'Forum created successfully!');
    }
}

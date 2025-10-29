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
     public function index(Request $request)
    {
        $request->validate([
            'sort' => 'nullable|in:newest,oldest,top_likes'
        ]);

        $sort = $request->input('sort', 'newest');

        $forumsQuery = Forum::with('user', 'replies', 'userVote');

        switch($sort){
            case 'oldest':
                $forumsQuery->orderBy('created_at', 'asc');
                break;
            case 'top_likes':
                $forumsQuery->orderByDesc('likes');
                break;
            case 'newest':
            default:
                $forumsQuery->orderBy('created_at', 'desc');
                break;
        };

        $forums = $forumsQuery->paginate(10)->withQueryString();

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
            'filters' => ['sort' => $sort],
        ]);
    }

    public function show(Request $request, Forum $forum)
    {
        $request->validate(['sort' => 'nullable|in:newest,oldest,top_likes']);
        $sort = $request->input('sort', 'newest');

        $forum->load(['user', 'userVote']);

        $repliesQuery = $forum->replies()
            ->with(['user', 'userVote', 'children.user', 'children.userVote']);

        switch ($sort) {
            case 'oldest': $repliesQuery->oldest(); break;
            case 'top_likes': $repliesQuery->orderBy('likes', 'desc'); break;
            case 'newest': default: $repliesQuery->latest(); break;
        }

        $replies = $repliesQuery->paginate(10, ['*'], 'repliesPage')->withQueryString();

        return Inertia::render('Forums/ForumDetails', [
            'forum' => $forum,
            'replies' => $replies,
            'filters' => ['sort' => $sort]
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

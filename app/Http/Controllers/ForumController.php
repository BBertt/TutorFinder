<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreForumRequest;
use App\Models\Forum;
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ForumController extends Controller
{
     public function index(Request $request)
    {
        $request->validate([
            'sort' => 'nullable|in:newest,oldest,top_likes',
            'view' => 'nullable|in:my_forums',
            'search' => 'nullable|string',
        ]);

        $sort = $request->input('sort', 'newest');
        $view = $request->input('view', 'all');
        $search = $request->input('search');

        $forumsQuery = Forum::with('user', 'replies', 'userVote');

        if ($view === 'my_forums' && Auth::check()) {
            $forumsQuery->where('user_id', Auth::id());
        }

        if ($search) {
            $forumsQuery->where(function (Builder $query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function (Builder $query) use ($search) {
                        $query->where('first_name', 'like', '%' . $search . '%')
                            ->orWhere('last_name', 'like', '%' . $search . '%');
                    });
            });
        }

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
            'filters' => ['sort' => $sort, 'view' => $view, 'search' => $search],
        ]);
    }

    public function show(Request $request, Forum $forum)
    {
        $request->validate(['sort' => 'nullable|in:newest,oldest,top_likes']);
        $sort = $request->input('sort', 'newest');

        $forum->load(['user', 'userVote']);

        $repliesQuery = $forum->replies()->with(['user', 'userVote', 'allChildren']);

        switch ($sort) {
            case 'oldest': $repliesQuery->oldest(); break;
            case 'top_likes': $repliesQuery->orderBy('likes', 'desc'); break;
            case 'newest': default: $repliesQuery->latest(); break;
        }

        $replies = $repliesQuery->paginate(10, ['*'], 'repliesPage')->withQueryString();

        $repliesTotal = $forum->allReplies()->count();

        return Inertia::render('Forums/ForumDetails', [
            'forum' => $forum,
            'replies' => $replies,
            'filters' => ['sort' => $sort],
            'repliesTotal' => $repliesTotal
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

    public function destroy(Forum $forum)
    {
        if (Auth::id() !== $forum->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $forum->allReplies()->delete();
        $forum->votes()->delete();

        $forum->delete();

        return redirect()->back()->with('success', 'Forum deleted successfully.');
    }
}

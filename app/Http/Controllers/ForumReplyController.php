<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class ForumReplyController extends Controller
{
    public function store(Request $request, Forum $forum)
    {
        $request->validate(['description' => 'required|string']);

        $forum->replies()->create([
            'user_id' => FacadesAuth::id(),
            'description' => $request->description,
            'parent_id' => $request->parent_id,
            'likes' => 0,
            'dislikes' => 0,
        ]);

        return redirect()->back()->with('success', 'Reply posted!');
    }
}

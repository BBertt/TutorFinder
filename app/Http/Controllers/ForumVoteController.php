<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use App\Models\ForumReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumVoteController extends Controller
{
    public function store(Request $request, $type, $id)
    {
        $request->validate(['vote' => 'required|in:1,-1']);

        $class = $type === 'forum' ? Forum::class : ForumReply::class;
        $model = $class::findOrFail($id);

        $existingVote = $model->votes()->where('user_id', Auth::id())->first();

        if ($existingVote && $existingVote->vote == $request->vote) {
            $existingVote->delete();
        } else {
            $model->votes()->updateOrCreate(
                ['user_id' => Auth::id()],
                ['vote' => $request->vote]
            );
        }


        $model->likes = $model->votes()->where('vote', 1)->count();
        $model->dislikes = $model->votes()->where('vote', -1)->count();
        $model->save();

        return redirect()->back();
    }
}

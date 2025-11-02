<?php

namespace Database\Seeders;

use App\Models\Forum;
use App\Models\ForumReply;
use App\Models\ForumVote;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('role_id', [2, 3])->get();
        // Just in case there are not enough users
        if($users->count() < 10){
            $users = User::factory()->count(20)->create(['role_id' => 3]);
        }

        Forum::factory()->count(20)->make()->each(function (Forum $forum) use ($users){
            $forum->user_id = $users->random()->id;
            $forum->save();

            $voters = $users->random(rand(5, $users->count()));
            foreach($voters as $voter){
                ForumVote::factory()->create([
                    'user_id' => $voter->id,
                    'voteable_id' => $forum->id,
                    'voteable_type' => Forum::class,
                    'vote' => rand(0,10) < 8 ? 1: -1
                ]);
            }

            ForumReply::factory()->count(rand(2, 5))->make()->each(function (ForumReply $reply) use ($forum, $users){
                $reply->forum_id = $forum->id;
                $reply->user_id = $users->random()->id;
                $reply->save();

                $replyVoters = $users->random(rand(3, $users->count()));
                foreach($replyVoters as $voter){
                    ForumVote::factory()->create([
                        'user_id' => $voter->id,
                        'voteable_id' => $reply->id,
                        'voteable_type' => ForumReply::class,
                        'vote' => rand(0,10) < 8 ? 1: -1
                    ]);
                }
            });
        });
        $this->updateVote(Forum::class, 'forums');
        $this->updateVote(ForumReply::class, 'forum_replies');

    }

    private function updateVote(string $modelClass, string $tableName): void {
        DB::table('forum_votes')->select('voteable_id',
        DB::raw('SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) as likes'),
        DB::raw('SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) as dislikes'))
        ->where('voteable_type', $modelClass)
        ->groupBy('voteable_id')
        ->get()
        ->each(function ($item) use ($tableName) {
            DB::table($tableName)->where('id', $item->voteable_id)->update([
                'likes' => $item->likes,
                'dislikes' => $item->dislikes,
            ]);
        });
    }
}

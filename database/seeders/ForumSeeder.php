<?php

namespace Database\Seeders;

use App\Models\Forum;
use App\Models\ForumReply;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) {
            return;
        }

        Forum::factory()->count(20)->make()->each(function ($forum) use ($users) {
            $forum->user_id = $users->random()->id;
            $forum->save();

            ForumReply::factory()->count(rand(2, 8))->make()->each(function ($reply) use ($forum, $users) {
                $reply->forum_id = $forum->id;
                $reply->user_id = $users->random()->id;
                $reply->save();
            });
        });
    }
}
